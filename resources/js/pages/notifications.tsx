import { Head, router } from '@inertiajs/react';
import TableGeneric from '@/components/table';
import AppLayout from '@/layouts/app-layout';
import NotificationLayout from '@/layouts/notification/layout';
import { index as notifications, edit, destroy } from '@/routes/notifications';
import type {
    BreadcrumbItem,
    NotificationItem,
    paginatedResponse,
    PaginationLink,
} from '@/types';
import PaginationGeneric from '@/components/pagination';
import { getNotificationColumns } from '@/pages/Notification/columns-notifications';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notificaciones',
        href: notifications().url,
    },
];

interface NotificationProps {
    data: paginatedResponse<NotificationItem>;
}

export default function Notification({ data }: NotificationProps) {
    const handleEditOpen = (notification: NotificationItem) => {
        router.get(edit(notification.id).url);
    };

    const handleDelete = (notification: NotificationItem) => {
        router.delete(destroy(notification.id));
    };

    const columns = useMemo(
        () =>
            getNotificationColumns({
                onEdit: handleEditOpen,
                onDelete: handleDelete,
            }),
        [],
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
                <TableGeneric table={table} />
                <PaginationGeneric links={data.links} />
            </NotificationLayout>
        </AppLayout>
    );
}
