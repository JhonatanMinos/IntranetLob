import type { Table } from '@tanstack/react-table';
import { ContentState } from '@/components/content-state';
import { DataTableToolbar } from '@/components/data-table-toolbar';
import TableGeneric from '@/components/table';

interface DataTablePanelProps<T> {
  table: Table<T>;
  searchPlaceholder?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  onReset?: () => void;
  filters?: Array<{
    columnId: string;
    label: string;
    options: Array<{ value: string; label: string }>;
  }>;
}

export function DataTablePanel<T>({
  table,
  searchPlaceholder,
  emptyTitle = 'No se encontraron resultados',
  emptyDescription = 'Prueba con otros términos o restablece la vista.',
  onReset,
  filters,
}: DataTablePanelProps<T>) {
  const hasRows = table.getRowModel().rows.length > 0;
  const hasActivePreferences =
    Boolean(table.getState().globalFilter) ||
    table.getState().sorting.length > 0 ||
    table.getState().columnFilters.length > 0 ||
    Object.values(table.getState().columnVisibility).some((visible) => visible === false);

  return (
    <div className="space-y-3">
      <DataTableToolbar
        table={table}
        searchPlaceholder={searchPlaceholder}
        onReset={onReset}
        filters={filters}
      />
      {hasRows ? (
        <TableGeneric table={table} emptyMessage={emptyTitle} />
      ) : (
        <ContentState
          title={emptyTitle}
          description={emptyDescription}
          action={onReset && hasActivePreferences ? <ButtonReset onClick={onReset} /> : undefined}
        />
      )}
    </div>
  );
}

function ButtonReset({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border bg-background px-3 py-1.5 text-sm font-medium shadow-xs hover:bg-accent"
    >
      Restablecer vista
    </button>
  );
}
