import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SKIP_TRANSFORM_KEY } from '../decorators/skip-transform.decorator';

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Response<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

/** A paginated service result: rows under `data`, counts under `meta`. */
function isPaginated(
  payload: unknown,
): payload is { data: unknown[]; meta: PaginationMeta } {
  return (
    !!payload &&
    typeof payload === 'object' &&
    Array.isArray((payload as any).data) &&
    !!(payload as any).meta
  );
}

/**
 * Wraps every handler result in the standard envelope.
 *
 * List endpoints return `{ data, meta }`; this used to unwrap `data` and throw
 * `meta` away, so total counts and page numbers never reached the client and
 * no consumer could paginate. `meta` is now carried alongside `data`, which
 * keeps the existing `data` shape intact for current callers.
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    // Routes that return a non-JSON body opt out entirely.
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_TRANSFORM_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skip) {
      return next.handle();
    }

    return next.handle().pipe(
      map((payload: any) => {
        const response: Response<T> = {
          success: true,
          message: payload?.message || 'Operation completed successfully',
          data: payload?.data ?? payload ?? {},
        };

        if (isPaginated(payload)) {
          response.meta = payload.meta;
        }

        return response;
      }),
    );
  }
}
