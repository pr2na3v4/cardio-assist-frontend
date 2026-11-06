/**
 * hooks/usePagination.js
 * ========================
 * Simple client-side pagination: slices an array into pages and exposes
 * navigation helpers. Used by Patient/History/Followup tables.
 */

import { useMemo, useState } from "react";

export function usePagination(items = [], pageSize = 10) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, safePage, pageSize]);

  return {
    page: safePage,
    totalPages,
    pageItems,
    nextPage: () => setPage((p) => Math.min(p + 1, totalPages)),
    prevPage: () => setPage((p) => Math.max(p - 1, 1)),
    goToPage: (p) => setPage(Math.min(Math.max(p, 1), totalPages)),
    resetPage: () => setPage(1),
  };
}
