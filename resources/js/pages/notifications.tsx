import { Head, router } from '@inertiajs/react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo, Suspense, lazy } from 'react';
import PaginationGeneric from '@/components/pagination';
import TableGeneric from '@/components/table';
import AppLayout from '@/layouts/app-layout';
import NotificationLayout from '@/layouts/notification/layout';
import { getNotificationColumns } from '@/pages/Notification/columns-notifications';
import { destroy, edit, index as notifications } from '@/routes/notifications';
import type {
    BreadcrumbItem,
    NotificationItem,
    PaginatedResponse,
} from '@/types';
import { toast } from 'sonner';

// Lazy load heavy components
const LazyTableGeneric = lazy(() => import('@/components/table'));
const LazyPaginationGeneric = lazy(() => import('@/components/pagination'));

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notificaciones',
        href: notifications().url,
    },
];

interface NotificationProps {
    data: PaginatedResponse<NotificationItem>;
}

export default function Notification({ data }: NotificationProps) {
    const handleEditOpen = (notification: NotificationItem) => {
        router.get(edit(notification.id).url);
    };

    const handleDelete = (notification: NotificationItem) => {
        router.delete(destroy(notification.id), {
            onSuccess: () => {
                toast.success('Notificacion eliminada', {
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
        [handleDelete, handleEditOpen],
    );

    const table = useReactTable({
        data: data.data ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notificaciones" />
            <NotificationLayout>
                <Suspense fallback={<div>Loading...</div>}>
                    <LazyTableGeneric table={table} />
                    <LazyPaginationGeneric links={data.links} meta={data.meta} />
                </Suspense>
            </NotificationLayout>
        </AppLayout>
    );
}
