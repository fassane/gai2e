import { cn } from '../lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { ColgateWrapper } from './wrapper';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="skeleton" className={cn('bg-foreground/8 animate-pulse rounded-md', className)} {...props} />;
}

interface TableSkeletonProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  rowCount?: number;
}
function getColumnId<TData, TValue>(column: ColumnDef<TData, TValue>): string {
  if (column.id) return column.id;
  if ('accessorKey' in column && typeof column.accessorKey === 'string') return column.accessorKey;
  return Math.random().toString(36).slice(2);
}
function getSkeletonWidth(columnId: string, rowIndex: number): string {
  const widths = ['60%', '70%', '80%', '90%', '75%', '85%', '65%'];
  const hash = (columnId.length + rowIndex * 3) % widths.length;
  return widths[hash];
}

function TableSkeleton<TData, TValue>({ columns, rowCount = 6 }: TableSkeletonProps<TData, TValue>) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted border-b border-border">
          {columns.map((column) => {
            const id = getColumnId(column);
            return (
              <TableHead key={id}>
                {typeof column.header === 'string' ? (
                  <span className="text-sm font-medium">{column.header}</span>
                ) : (
                  <Skeleton className="h-4 w-24" />
                )}
              </TableHead>
            );
          })}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rowCount }).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map((column) => {
              const id = getColumnId(column);
              return (
                <TableCell key={id}>
                  <Skeleton
                    className="h-8"
                    style={{
                      width: getSkeletonWidth(id, rowIndex),
                    }}
                  />
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function DetailsPageSkeleton() {
  return (
    <ColgateWrapper>
      <Skeleton className="h-8 w-[30%]" />
      <div className="mt-6">
        <Skeleton className="h-28 w-full" />
        <div className="my-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2">
            <Skeleton className="h-90 w-full" />
          </div>
          <Skeleton className="h-90 w-full" />
        </div>
      </div>
    </ColgateWrapper>
  );
}

export { Skeleton, TableSkeleton, DetailsPageSkeleton };
