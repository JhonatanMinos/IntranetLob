import type { Table } from '@tanstack/react-table';
import { RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DataTableToolbarProps<T> {
  table: Table<T>;
  searchPlaceholder?: string;
  onReset?: () => void;
  filters?: Array<{
    columnId: string;
    label: string;
    options: Array<{ value: string; label: string }>;
  }>;
}

export function DataTableToolbar<T>({
  table,
  searchPlaceholder = 'Buscar en los resultados…',
  onReset,
  filters = [],
}: DataTableToolbarProps<T>) {
  const hideableColumns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanHide() && column.id !== 'actions');
  const sortableColumns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanSort() && column.id !== 'actions');
  const sorting = table.getState().sorting[0];
  const sortValue = sorting ? `${sorting.id}:${sorting.desc ? 'desc' : 'asc'}` : 'none';
  const hasPreferences =
    Boolean(table.getState().globalFilter) ||
    table.getState().sorting.length > 0 ||
    table.getState().columnFilters.length > 0 ||
    Object.values(table.getState().columnVisibility).some((visible) => visible === false);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <InputGroup className="w-full sm:max-w-sm">
        <InputGroupAddon>
          <Search aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput
          value={(table.getState().globalFilter as string) ?? ''}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
        />
      </InputGroup>

      <div className="flex flex-wrap items-center justify-end gap-2">
        {filters.map((filter) => {
          const column = table.getColumn(filter.columnId);
          if (!column) return null;

          return (
            <Select
              key={filter.columnId}
              value={(column.getFilterValue() as string) || 'all'}
              onValueChange={(value) => column.setFilterValue(value === 'all' ? undefined : value)}
            >
              <SelectTrigger className="w-[145px]">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{filter.label}: todos</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        })}

        {sortableColumns.length > 0 && (
          <Select
            value={sortValue}
            onValueChange={(value) => {
              if (value === 'none') {
                table.setSorting([]);
                return;
              }
              const [id, direction] = value.split(':');
              table.setSorting([{ id, desc: direction === 'desc' }]);
            }}
          >
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Orden original</SelectItem>
              {sortableColumns.flatMap((column) => {
                const label =
                  typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id;
                return [
                  <SelectItem key={`${column.id}:asc`} value={`${column.id}:asc`}>
                    {label} · A–Z
                  </SelectItem>,
                  <SelectItem key={`${column.id}:desc`} value={`${column.id}:desc`}>
                    {label} · Z–A
                  </SelectItem>,
                ];
              })}
            </SelectContent>
          </Select>
        )}

        {hideableColumns.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Elegir columnas visibles">
                <SlidersHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Columnas visibles</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {hideableColumns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  disabled={column.getIsVisible() && table.getVisibleLeafColumns().length === 1}
                  onCheckedChange={(value) => column.toggleVisibility(Boolean(value))}
                >
                  {typeof column.columnDef.header === 'string'
                    ? column.columnDef.header
                    : column.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {hasPreferences && onReset && (
          <Button variant="ghost" size="icon" onClick={onReset} aria-label="Restablecer vista">
            <RotateCcw />
          </Button>
        )}
      </div>
    </div>
  );
}
