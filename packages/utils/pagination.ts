export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export function getPaginationOffset(page: number, pageSize: number): number {
  return Math.max(page - 1, 0) * pageSize;
}

export function normalizePagination(params: PaginationParams) {
  const page = Math.max(params.page ?? 1, 1);
  const pageSize = Math.min(Math.max(params.pageSize ?? 20, 1), 100);

  return { page, pageSize, skip: getPaginationOffset(page, pageSize) };
}