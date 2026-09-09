import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { Observable, throwError, timer } from 'rxjs';
import { retry } from 'rxjs/operators';

/**
 * Retries a request once when the database connection turns out to be stale.
 *
 * Neon closes pooled connections that have been idle, and Prisma has no way to
 * know a pooled connection is dead until it uses it. The first request after a
 * quiet period then fails with P1017 ("Server has closed the connection") even
 * though nothing is wrong — the next attempt succeeds immediately.
 *
 * Only idempotent methods are retried. Replaying a POST or PATCH could apply
 * the write twice, since a dropped connection gives no way to tell whether the
 * statement committed before the socket closed.
 */
const TRANSIENT_PRISMA_CODES = new Set([
  'P1017', // Server has closed the connection
  'P1001', // Cannot reach database server
  'P2024', // Timed out fetching a connection from the pool
]);

const IDEMPOTENT_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export function isTransientDbError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    TRANSIENT_PRISMA_CODES.has(error.code)
  );
}

@Injectable()
export class DbRetryInterceptor implements NestInterceptor {
  private readonly logger = new Logger('DbRetry');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();

    if (!IDEMPOTENT_METHODS.has(request.method)) {
      return next.handle();
    }

    return next.handle().pipe(
      retry({
        count: 1,
        delay: (error) => {
          if (!isTransientDbError(error)) return throwError(() => error);
          this.logger.warn(
            `${request.method} ${request.url}: stale database connection, retrying once`,
          );
          // Brief pause so the pool can hand back a fresh connection.
          return timer(150);
        },
      }),
    );
  }
}
