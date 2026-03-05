import { Head, router } from '@inertiajs/react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import PaginationGeneric from '@/components/pagination';
import TableGeneric from '@/components/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import EventLayout from '@/layouts/event/layout';
import { CreateEvent } from '@/pages/Events/create-event';
import { destroy, index as events } from '@/routes/events';
import type { BreadcrumbItem, EventItem, PaginatedResponse } from '@/types';
import { getEventColumns } from './Events/columns-events';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Events',
        href: events().url,
    },
];

interface EventsProps {
    results: PaginatedResponse<EventItem>;
}

export default function Events({ results }: EventsProps) {
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

    const handleEditOpen = (event: EventItem) => {
        setEditingEvent(event);
        setOpenEditModal(true);
    };

    const handleDelete = (event: EventItem) => {
        if (
            confirm(
                `¿Estás seguro de que deseas eliminar el evento "${event.title}"?`,
            )
        ) {
            router.delete(destroy(event.id).url, {
                onSuccess: () => {
                    toast.success('Evento eliminado correctamente', {
                        position: 'bottom-right',
                    });
                },
                onError: () => {
                    toast.error('Error al eliminar el evento', {
                        position: 'bottom-right',
                    });
                },
            });
        }
    };

    const columns = useMemo(
        () =>
            getEventColumns({
                onEdit: handleEditOpen,
                onDelete: handleDelete,
            }),
        [handleDelete, handleEditOpen],
    );

    const table = useReactTable({
        data: results.data ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Eventos" />
            <EventLayout>
                <TableGeneric table={table} />
                <PaginationGeneric meta={results.meta} links={results.links} />
            </EventLayout>
            <Dialog
                open={openEditModal}
                onOpenChange={(open) => {
                    if (!open) setEditingEvent(null);
                    setOpenEditModal(open);
                }}
            >
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Editar evento</DialogTitle>
                    </DialogHeader>
                    {editingEvent && (
                        <CreateEvent
                            event={editingEvent}
                            onSuccess={() => {
                                setOpenEditModal(false);
                                setEditingEvent(null);
                                router.reload({ only: ['results'] });
                                toast.success(
                                    'Evento actualizado correctamente',
                                    {
                                        position: 'bottom-right',
                                    },
                                );
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
