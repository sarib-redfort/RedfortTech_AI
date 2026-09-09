import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

/**
 * Converts any thrown value into the standard error envelope.
 *
 * Two rules matter here:
 *  - Unexpected errors are logged in full server-side but reported to the
 *    client as a generic message. Returning `exception.message` leaked
 *    internals such as Prisma query text and column names.
 *  - Known Prisma errors are mapped to meaningful status codes instead of
 *    surfacing as opaque 500s (a duplicate email is a 409, not a crash).
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: unknown = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse() as any;

      if (typeof body === 'string') {
        message = body;
      } else if (Array.isArray(body?.message)) {
        // class-validator returns an array of failed constraints.
        message = 'Validation failed';
        errors = body.message;
      } else if (typeof body?.message === 'string') {
        message = body.message;
        errors = [body.message];
      } else {
        message = exception.message;
      }

      if (body?.errors) {
        errors = body.errors;
      }

      // A 5xx raised deliberately (e.g. a failed Cloudinary upload) still
      // needs to reach the logs, or the cause is invisible in production.
      if (status >= 500) {
        this.logger.error(
          `${request.method} ${request.url} -> ${status}: ${exception.message}`,
          exception.stack,
        );
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      ({ status, message } = this.mapPrismaError(exception));
      this.logger.error(
        `${request.method} ${request.url} -> Prisma ${exception.code}: ${exception.message}`,
      );
    } else {
      // Genuinely unexpected: log everything, tell the client nothing.
      this.logger.error(
        `${request.method} ${request.url} -> unhandled exception`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    // Never surface internals on a 500. 503 keeps its message: it tells the
    // caller the failure is transient, and reveals nothing about the system.
    if (status >= 500 && status !== HttpStatus.SERVICE_UNAVAILABLE) {
      message = 'Internal server error';
      errors = null;
    }

    response.status(status).json({
      success: false,
      message,
      errors: errors ?? {},
    });
  }

  private mapPrismaError(error: Prisma.PrismaClientKnownRequestError): {
    status: number;
    message: string;
  } {
    switch (error.code) {
      case 'P2002': {
        const target = (error.meta?.target as string[] | undefined)?.join(', ');
        return {
          status: HttpStatus.CONFLICT,
          message: target
            ? `A record with this ${target} already exists`
            : 'A record with these details already exists',
        };
      }
      case 'P2025':
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'The requested record was not found',
        };
      case 'P2003':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Referenced record does not exist',
        };
      case 'P2014':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'This change would break a required relation',
        };
      case 'P1017':
      case 'P1001':
      case 'P2024':
        // The database was unreachable or the pooled connection was stale.
        // 503 tells the caller this is transient and worth retrying, which a
        // generic 500 does not.
        return {
          status: HttpStatus.SERVICE_UNAVAILABLE,
          message: 'The service is temporarily unavailable. Please try again.',
        };
      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
        };
    }
  }
}
