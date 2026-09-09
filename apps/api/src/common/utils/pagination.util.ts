import { PaginationDto } from '../dto/pagination.dto';

/**
 * Pagination helpers shared by every list endpoint.
 *
 * The same eight lines — destructure the DTO, compute `skip`, build a search
 * filter, run findMany + count, assemble `meta` — were repeated in fourteen
 * service methods. They differ only in the default sort column and which field
 * the search applies to, so both are parameters here.
 */

export interface ResolvedPagination {
  page: number;
  limit: number;
  skip: number;
  take: number;
  orderBy: Record<string, 'asc' | 'desc'>;
  search?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Normalizes the query DTO into Prisma-ready pagination arguments.
 *
 * `defaultOrder` exists because most lists are newest-first, but manually
 * ordered ones (team members by displayOrder) read ascending.
 */
export function resolvePagination(
  dto: PaginationDto,
  defaultSort = 'createdAt',
  defaultOrder: 'asc' | 'desc' = 'desc',
): ResolvedPagination {
  const {
    page = 1,
    limit = 10,
    search,
    sort = defaultSort,
    order = defaultOrder,
  } = dto ?? {};

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { [sort || defaultSort]: order },
    search,
  };
}

/**
 * Builds a case-insensitive "contains" filter over one or more fields.
 *
 * Returns an empty object when there is no search term, so the result can
 * always be spread into a `where` clause unconditionally. Multiple fields are
 * combined with OR.
 */
export function searchFilter(
  search: string | undefined,
  fields: string | string[],
): Record<string, unknown> {
  if (!search) return {};

  const list = Array.isArray(fields) ? fields : [fields];
  const match = (field: string) => ({
    [field]: { contains: search, mode: 'insensitive' as const },
  });

  return list.length === 1 ? match(list[0]) : { OR: list.map(match) };
}

/** Wraps rows and a total count in the standard paginated response shape. */
export function paginated<T>(
  data: T[],
  total: number,
  { page, limit }: ResolvedPagination,
): PaginatedResult<T> {
  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
