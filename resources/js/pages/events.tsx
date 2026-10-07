import type { PageProps } from '@inertiajs/core';
import { Head, router, usePage } from '@inertiajs/react';
import { getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/confirm-dialog';
import PaginationGeneric from '@/components/pagination';
import TableGeneric from '@/components/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import EventLayout from '@/layouts/event/layout';
import { CreateEvent } from '@/pages/Events/create-event';
import { destroy, index as events } from '@/routes/events';
import type { BreadcrumbItem, EventItem, PaginatedResponse } from '@/types';
import { getEventColumns } from './Events/columns-events';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Eventos',
    href: events().url,
  },
];

interface EventsProps extends PageProps {
  results: PaginatedResponse<EventItem>;
}

export default function Events() {
  const { results } = usePage<EventsProps>().props;
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<EventItem | null>(null);

  const handleEditOpen = useCallback((event: EventItem) => {
    setEditingEvent(event);
    setOpenEditModal(true);
  }, []);

  const handleDelete = useCallback((event: EventItem) => {
    setDeletingEvent(event);
  }, []);

  const confirmDelete = () => {
    if (!deletingEvent) return;
    router.delete(destroy(deletingEvent.id).url, {
      onSuccess: () => {
        setDeletingEvent(null);
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
  };

  const columns = useMemo(
    () =>
      getEventColumns({
        onEdit: handleEditOpen,
        onDelete: handleDelete,
      }),
    [handleDelete, handleEditOpen]
  );

  const table = useReactTable({
    data: results.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Eventos" />
      <EventLayout>
        <TableGeneric
          table={table}
          searchPlaceholder="Buscar eventos…"
          emptyMessage="No hay eventos para mostrar."
        />
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
              key={editingEvent.id}
              event={editingEvent}
              onSuccess={() => {
                setOpenEditModal(false);
                setEditingEvent(null);
                toast.success('Evento actualizado correctamente', {
                  position: 'bottom-right',
                });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={Boolean(deletingEvent)}
        onOpenChange={(open) => !open && setDeletingEvent(null)}
        title={`Eliminar “${deletingEvent?.title ?? ''}”`}
        description="El evento desaparecerá del calendario corporativo. Esta acción no se puede deshacer."
        onConfirm={confirmDelete}
      />
    </AppLayout>
  );
}
