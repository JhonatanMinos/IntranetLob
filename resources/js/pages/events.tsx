import { Head, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { CreateEvent } from '@/pages/Events/create-event';
import { EventsTable } from '@/pages/Events/events-table';
import { destroy, index as events } from '@/routes/events';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Events',
        href: events().url,
    },
];

interface Event {
    id: string;
    title: string;
    type: 'evento' | 'festivo' | 'lanzamiento';
    start_date: string;
    end_date: string;
}

interface EventsProps {
    results: Event[];
}

export default function Events({ results }: EventsProps) {
    const today = new Date();
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);

    const handleEditOpen = (event: Event) => {
        setEditingEvent(event);
        setOpenEditModal(true);
    };

    const handleDelete = (event: Event) => {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Eventos" />
            <div className="flex h-full flex-col space-y-6 px-3 py-5">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                            {format(today, 'MMMM', {
                                locale: es,
                            }).toUpperCase()}
                        </h2>
                        <Button
                            className="shrink-0 bg-blue-500 text-white"
                            onClick={() => setOpenModal(true)}
                        >
                            <Plus size={16} /> agregar Evento
                        </Button>
                    </div>
                </div>
            </div>
            <div className="p-4">
                <EventsTable
                    data={results}
                    onEdit={handleEditOpen}
                    onDelete={handleDelete}
                />
            </div>
            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Crear nuevo evento</DialogTitle>
                    </DialogHeader>
                    <CreateEvent
                        onSuccess={() => {
                            setOpenModal(false);
                            router.reload({ only: ['results'] });
                            toast.success('Evento creado correctamente', {
                                position: 'bottom-right',
                            });
                        }}
                    />
                </DialogContent>
            </Dialog>

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
