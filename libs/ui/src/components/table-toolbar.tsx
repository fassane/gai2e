import { ReactNode } from 'react';
import { LuRefreshCw, LuX } from 'react-icons/lu';
import { SearchInput } from './input';
import { Button } from './button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

export type TableToolbarFilter = {
  id: string;
  label: string;
  value?: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
};

type TableToolbarProps = {
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: TableToolbarFilter[];
  onClearFilters?: () => void;
  onRefresh?: () => void;
  onExport?: () => void;
  // Bouton(s) d'action principale (ex. "Nouveau dossier") affiché(s) à droite.
  actions?: ReactNode;
  className?: string;
};

//
export function TableToolbar({
  search,
  onSearchChange,
  searchPlaceholder = 'Rechercher',
  filters = [],
  onClearFilters,
  onRefresh,
  onExport,
  actions,
  className,
}: TableToolbarProps) {
  const hasActiveFilters = !!search || filters.some((f) => !!f.value);

  return (
    <div className={`flex items-center justify-between flex-wrap gap-3 ${className ?? ''}`}>
      <div className="flex items-center flex-wrap gap-2">
        {!!onSearchChange && (
          <SearchInput
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            containerClassName="w-auto min-w-50"
          />
        )}
        {filters.map((filter) => (
          <Select key={filter.id} value={filter.value} onValueChange={filter.onChange}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
        {hasActiveFilters && !!onClearFilters && (
          <Button type="button" variant="ghost" size="sm" onClick={onClearFilters} className="text-muted-foreground">
            <LuX /> Effacer les filtres
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {!!onRefresh && (
          <Button type="button" variant="outline" size="icon" onClick={onRefresh} title="Rafraîchir">
            <LuRefreshCw />
          </Button>
        )}
        {!!onExport && (
          <Button type="button" variant="outline" icon="download" onClick={onExport}>
            Exporter
          </Button>
        )}
        {actions}
      </div>
    </div>
  );
}
