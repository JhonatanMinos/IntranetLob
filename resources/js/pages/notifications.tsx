import { Head, router } from '@inertiajs/react';
import { getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/confirm-dialog';
import AppLayout from '@/layouts/app-layout';
import NotificationLayout from '@/layouts/notification/layout';
import { getNotificationColumns } from '@/pages/Notification/columns-notifications';
import { destroy, edit, index as notifications } from '@/routes/notifications';
import type { BreadcrumbItem, NotificationItem, PaginatedResponse } from '@/types';

// Lazy load heavy components
const LazyTableGeneric = lazy(async () => {
  const { default: TableGeneric } = await import('@/components/table');
  return {
    default: (props: {
      table: import('@tanstack/react-table').Table<NotificationItem>;
      searchPlaceholder?: string;
      emptyMessage?: string;
    }) => <TableGeneric {...props} />,
  };
});
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
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Notificaciones" />
      <NotificationLayout>
        <Suspense
          fallback={
            <div
              className="h-48 animate-pulse rounded-xl bg-muted"
              role="status"
              aria-label="Cargando avisos"
            />
          }
        >
          <LazyTableGeneric
            table={table}
            searchPlaceholder="Buscar avisos…"
            emptyMessage="No hay avisos para mostrar."
          />
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
