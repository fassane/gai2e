import { FiChevronsLeft, FiChevronLeft, FiChevronRight, FiChevronsRight } from 'react-icons/fi';
import { Button } from './button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

// ─── Types ────────────────────────────────────────────────────────────────────
// currentPage est 1-indexé (page=1 = première page), pour matcher la
// pagination du backend.

interface PaginationProps {
  totalItems: number;
  currentPage: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  showInfo?: boolean;
}

function getPageNumbers(currentPage: number, totalPages: number): (number | '...')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | '...')[] = [1];

  if (currentPage > 4) pages.push('...');

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 3) pages.push('...');

  pages.push(totalPages);

  return pages;
}

export function Pagination({
  totalItems,
  currentPage,
  perPage,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 30, 50],
  showInfo = true,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / perPage);
  const from = (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, totalItems);

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between gap-3 py-4 mt-2 flex-wrap">
      <div className="flex items-center gap-1">
        {onPageSizeChange && (
          <Select
            value={String(perPage)}
            onValueChange={(v) => {
              onPageSizeChange(Number(v));
              onPageChange(1);
            }}
          >
            <SelectTrigger className="h-6 text-xs ml-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)} className="text-xs">
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {showInfo && (
          <p className="text-sm text-muted-foreground shrink-0">
            {from}–{to} sur {totalItems} éléments
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 ml-auto">
        <Button
          variant="outline"
          size="icon"
          className="hidden size-8 lg:flex"
          onClick={() => onPageChange(1)}
          disabled={!canPrev}
          aria-label="Première page"
        >
          <FiChevronsLeft />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canPrev}
          aria-label="Page précédente"
        >
          <FiChevronLeft />
        </Button>
        {/* Numéros de pages */}
        <div className="hidden sm:flex items-center gap-1">
          {pages.map((page, i) =>
            page === '...' ? (
              <span key={`ellipsis-${i}`} className="w-6 text-center text-sm text-muted-foreground select-none">
                …
              </span>
            ) : (
              <Button
                key={page}
                variant={page === currentPage ? 'default' : 'outline'}
                size="icon"
                className="size-8 text-xs"
                onClick={() => onPageChange(page)}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </Button>
            ),
          )}
        </div>

        {/* Indicateur mobile */}
        <span className="sm:hidden text-sm text-muted-foreground px-2">
          {currentPage} / {totalPages}
        </span>

        {/* Page suivante */}
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canNext}
          aria-label="Page suivante"
        >
          <FiChevronRight />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="hidden size-8 lg:flex"
          onClick={() => onPageChange(totalPages)}
          disabled={!canNext}
          aria-label="Dernière page"
        >
          <FiChevronsRight />
        </Button>
      </div>
    </div>
  );
}
