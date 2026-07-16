import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "./ui/button";

export interface PaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
  buildHref: (page: number) => string;
}

export function Pagination({ page, pageSize, totalItems, buildHref }: PaginationProps) {
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);

  if (totalPages <= 1) {
    return null;
  }

  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-6 py-4 sm:flex-row">
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{start}</span>–
        <span className="font-medium text-foreground">{end}</span> of{" "}
        <span className="font-medium text-foreground">{totalItems}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} asChild={page > 1}>
          {page > 1 ? (
            <a href={buildHref(page - 1)}>
              <ChevronLeft className="size-4" />
              Previous
            </a>
          ) : (
            <span>
              <ChevronLeft className="size-4" />
              Previous
            </span>
          )}
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <Button variant="outline" size="sm" disabled={page >= totalPages} asChild={page < totalPages}>
          {page < totalPages ? (
            <a href={buildHref(page + 1)}>
              Next
              <ChevronRight className="size-4" />
            </a>
          ) : (
            <span>
              Next
              <ChevronRight className="size-4" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
