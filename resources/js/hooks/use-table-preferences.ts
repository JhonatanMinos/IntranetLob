import type {
  ColumnFiltersState,
  OnChangeFn,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import { useCallback } from 'react';
import { usePersistentState } from '@/hooks/use-persistent-state';

interface TablePreferences {
  search: string;
  sorting: SortingState;
  columnVisibility: VisibilityState;
  columnFilters: ColumnFiltersState;
}

const defaultPreferences: TablePreferences = {
  search: '',
  sorting: [],
  columnVisibility: {},
  columnFilters: [],
};

export function useTablePreferences(key: string) {
  const [preferences, setPreferences, reset] = usePersistentState<TablePreferences>(
    `table:${key}`,
    defaultPreferences
  );

  const setSearch = useCallback(
    (search: string) => setPreferences((current) => ({ ...current, search })),
    [setPreferences]
  );

  const setSorting: OnChangeFn<SortingState> = useCallback(
    (updater) =>
      setPreferences((current) => ({
        ...current,
        sorting: typeof updater === 'function' ? updater(current.sorting ?? []) : updater,
      })),
    [setPreferences]
  );

  const setColumnVisibility: OnChangeFn<VisibilityState> = useCallback(
    (updater) =>
      setPreferences((current) => ({
        ...current,
        columnVisibility:
          typeof updater === 'function' ? updater(current.columnVisibility ?? {}) : updater,
      })),
    [setPreferences]
  );

  const setColumnFilters: OnChangeFn<ColumnFiltersState> = useCallback(
    (updater) =>
      setPreferences((current) => ({
        ...current,
        columnFilters:
          typeof updater === 'function' ? updater(current.columnFilters ?? []) : updater,
      })),
    [setPreferences]
  );

  return {
    preferences: { ...defaultPreferences, ...preferences },
    setSearch,
    setSorting,
    setColumnVisibility,
    setColumnFilters,
    reset,
  };
}
