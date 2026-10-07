import { Head, router } from '@inertiajs/react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { ContentState } from '@/components/content-state';
import { DataTablePanel } from '@/components/data-table-panel';
import { useTablePreferences } from '@/hooks/use-table-preferences';
import AppLayout from '@/layouts/app-layout';
import NotificationLayout from '@/layouts/notification/layout';
import { getNotificationColumns } from '@/pages/Notification/columns-notifications';
import { destroy, edit, index as notifications } from '@/routes/notifications';
import type { BreadcrumbItem, NotificationItem, PaginatedResponse } from '@/types';

const LazyPaginationGeneric = lazy(() => import('@/components/pagination'));

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Avisos',
    href: notifications().url,
  },
];

interface NotificationProps {
  data: PaginatedResponse<NotificationItem>;
}

export default function Notification({ data }: NotificationProps) {
  const [deletingNotification, setDeletingNotification] = useState<NotificationItem | null>(null);
  const tablePreferences = useTablePreferences('notifications');
  const handleEditOpen = useCallback((notification: NotificationItem) => {
    router.get(edit(notification.id).url);
  }, []);

  const handleDelete = useCallback((notification: NotificationItem) => {
    setDeletingNotification(notification);
  }, []);

  const confirmDelete = () => {
    if (!deletingNotification) return;
    router.delete(destroy(deletingNotification.id), {
      onSuccess: () => {
        setDeletingNotification(null);
        toast.success('Notificación eliminada', {
          position: 'bottom-right',
        });
        router.reload({ only: ['notifications'] });
      },
    });
  };

  const columns = useMemo(
    () =>
      getNotificationColumns({
        onEdit: handleEditOpen,
        onDelete: handleDelete,
      }),
    [handleDelete, handleEditOpen]
  );

  const table = useReactTable({
    data: data.data ?? [],
    columns,
    state: {
      globalFilter: tablePreferences.preferences.search,
      sorting: tablePreferences.preferences.sorting,
      columnVisibility: tablePreferences.preferences.columnVisibility,
      columnFilters: tablePreferences.preferences.columnFilters,
    },
    onGlobalFilterChange: tablePreferences.setSearch,
    onSortingChange: tablePreferences.setSorting,
    onColumnVisibilityChange: tablePreferences.setColumnVisibility,
    onColumnFiltersChange: tablePreferences.setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Notificaciones" />
      <NotificationLayout>
        <DataTablePanel
          table={table}
          searchPlaceholder="Buscar avisos…"
          emptyTitle="No hay avisos para mostrar"
          emptyDescription="Prueba con otra búsqueda o restablece la vista guardada."
          onReset={tablePreferences.reset}
          filters={[
            {
              columnId: 'priority',
              label: 'Prioridad',
              options: [
                { value: 'normal', label: 'Normal' },
                { value: 'importante', label: 'Importante' },
                { value: 'urgente', label: 'Urgente' },
              ],
            },
            {
              columnId: 'type',
              label: 'Tipo',
              options: [
                { value: 'adn', label: 'ADN' },
                { value: 'beneficios', label: 'Beneficios' },
                { value: 'colaboradores', label: 'Colaboradores' },
                { value: 'aviso', label: 'Aviso' },
              ],
            },
          ]}
        />
        <Suspense
          fallback={
            <ContentState variant="loading" title="Cargando paginación…" className="min-h-20" />
          }
        >
          <LazyPaginationGeneric links={data.links} meta={data.meta} />
        </Suspense>
      </NotificationLayout>
      <ConfirmDialog
        open={Boolean(deletingNotification)}
        onOpenChange={(open) => !open && setDeletingNotification(null)}
        title={`Eliminar “${deletingNotification?.title ?? ''}”`}
        description="El aviso dejará de estar disponible para los colaboradores. Esta acción no se puede deshacer."
        onConfirm={confirmDelete}
      />
    </AppLayout>
  );
}
