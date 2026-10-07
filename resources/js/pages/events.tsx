import type { PageProps } from '@inertiajs/core';
import { Head, router, usePage } from '@inertiajs/react';
import { getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import { endOfDay, format, isWithinInterval, parseISO, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarDays, CalendarX, List, SquarePen, Trash } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/confirm-dialog';
import PaginationGeneric from '@/components/pagination';
import { StatusBadge } from '@/components/status-badge';
import TableGeneric from '@/components/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import AppLayout from '@/layouts/app-layout';
import EventLayout from '@/layouts/event/layout';
import { CalendarEvent } from '@/pages/Dashboard/calendar-event';
import { CreateEvent } from '@/pages/Events/create-event';
import { destroy, index as events } from '@/routes/events';
import type { BreadcrumbItem, DashboardEvent, EventItem, PaginatedResponse } from '@/types';
import { getEventColumns } from './Events/columns-events';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Eventos', href: events().url }];

const eventTypes = [
  { value: 'evento', label: 'Eventos', color: 'bg-blue-500' },
  { value: 'festivo', label: 'Festivos', color: 'bg-green-500' },
  { value: 'campania', label: 'Campañas', color: 'bg-orange-500' },
  { value: 'lanzamiento', label: 'Lanzamientos', color: 'bg-purple-500' },
  { value: 'cumpleanos', label: 'Cumpleaños', color: 'bg-pink-500' },
] as const;

type EventType = EventItem['type'];

interface EventsProps extends PageProps {
  results: PaginatedResponse<EventItem>;
  calendarEvents: EventItem[];
  selectedYear: number;
  can: {
    create: boolean;
    update: boolean;
    delete: boolean;
  };
}

export default function Events() {
  const { results, calendarEvents, selectedYear, can } = usePage<EventsProps>().props;
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<EventItem | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return selectedYear === today.getFullYear() ? today : new Date(selectedYear, 0, 1);
  });
  const [activeTypes, setActiveTypes] = useState<EventType[]>([]);

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
      preserveScroll: true,
      onSuccess: () => {
        setDeletingEvent(null);
        toast.success('Evento eliminado correctamente', { position: 'bottom-right' });
      },
      onError: () => {
        toast.error('Error al eliminar el evento', { position: 'bottom-right' });
      },
    });
  };

  const columns = useMemo(
    () =>
      getEventColumns({
        onEdit: handleEditOpen,
        onDelete: handleDelete,
        canUpdate: can.update,
        canDelete: can.delete,
      }),
    [can.delete, can.update, handleDelete, handleEditOpen]
  );

  const table = useReactTable({
    data: results.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const filteredEvents = useMemo(
    () =>
      activeTypes.length === 0
        ? calendarEvents
        : calendarEvents.filter((event) => activeTypes.includes(event.type)),
    [activeTypes, calendarEvents]
  );

  const dashboardEvents = useMemo<DashboardEvent[]>(
    () =>
      filteredEvents.map((event) => ({
        id: event.id,
        title: event.title,
        type: event.type,
        start_date: event.startDate,
        end_date: event.endDate ?? event.startDate,
      })),
    [filteredEvents]
  );

  const selectedDayEvents = useMemo(
    () =>
      filteredEvents.filter((event) =>
        isWithinInterval(startOfDay(selectedDate), {
          start: startOfDay(parseISO(event.startDate)),
          end: endOfDay(parseISO(event.endDate ?? event.startDate)),
        })
      ),
    [filteredEvents, selectedDate]
  );

  const handleCalendarNavigate = (date: Date) => {
    setSelectedDate(date);
    const year = date.getFullYear();

    if (year !== selectedYear) {
      router.get(
        events({ query: { year } }).url,
        {},
        {
          preserveScroll: true,
          preserveState: true,
          replace: true,
          only: ['results', 'calendarEvents', 'selectedYear', 'can'],
        }
      );
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Calendario" />
      <EventLayout canCreate={can.create}>
        <Tabs defaultValue="calendar" className="gap-4">
          <div className="flex flex-col justify-between gap-3 rounded-xl border bg-card p-3 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-center gap-3">
              <TabsList>
                <TabsTrigger value="calendar">
                  <CalendarDays /> Calendario
                </TabsTrigger>
                <TabsTrigger value="list">
                  <List /> Lista
                </TabsTrigger>
              </TabsList>
              <span className="hidden text-sm text-muted-foreground md:inline">
                {filteredEvents.length} eventos en {selectedYear}
              </span>
            </div>

            <ToggleGroup
              type="multiple"
              variant="outline"
              size="sm"
              value={activeTypes}
              onValueChange={(value) => setActiveTypes(value as EventType[])}
              aria-label="Filtrar por tipo de evento"
              className="max-w-full overflow-x-auto"
            >
              {eventTypes.map((type) => (
                <ToggleGroupItem
                  key={type.value}
                  value={type.value}
                  aria-label={`Mostrar ${type.label}`}
                  className="gap-1.5"
                >
                  <span className={`size-2 rounded-full ${type.color}`} />
                  <span className="hidden lg:inline">{type.label}</span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <TabsContent value="calendar">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_19rem]">
              <Card className="min-w-0 gap-0 overflow-hidden py-0">
                <CardContent className="overflow-x-auto p-4 sm:p-6">
                  <div className="min-w-[720px]">
                    <CalendarEvent
                      events={dashboardEvents}
                      selectedDate={selectedDate}
                      onSelectDate={setSelectedDate}
                      onNavigate={handleCalendarNavigate}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="h-fit gap-3 xl:sticky xl:top-20">
                <CardHeader>
                  <CardTitle className="text-base">
                    {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {selectedDayEvents.length === 1
                      ? '1 evento programado'
                      : `${selectedDayEvents.length} eventos programados`}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedDayEvents.length > 0 ? (
                    selectedDayEvents.map((event) => (
                      <div key={event.id} className="rounded-lg border p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-medium leading-snug">{event.title}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {event.endDate && event.endDate !== event.startDate
                                ? `${format(parseISO(event.startDate), 'd MMM', { locale: es })} – ${format(parseISO(event.endDate), 'd MMM', { locale: es })}`
                                : 'Todo el día'}
                            </p>
                          </div>
                          <StatusBadge
                            tone={
                              event.type === 'festivo'
                                ? 'success'
                                : event.type === 'evento'
                                  ? 'info'
                                  : 'warning'
                            }
                            className="capitalize"
                          >
                            {event.type}
                          </StatusBadge>
                        </div>
                        {(can.update || can.delete) && (
                          <div className="mt-3 flex justify-end gap-1 border-t pt-2">
                            {can.update && (
                              <Button
                                size="xs"
                                variant="ghost"
                                onClick={() => handleEditOpen(event)}
                              >
                                <SquarePen /> Editar
                              </Button>
                            )}
                            {can.delete && (
                              <Button
                                size="xs"
                                variant="ghost"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDelete(event)}
                              >
                                <Trash /> Eliminar
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-10 text-center">
                      <CalendarX className="size-6 text-muted-foreground/50" />
                      <p className="text-sm font-medium">Día disponible</p>
                      <p className="text-xs text-muted-foreground">
                        Selecciona otra fecha para consultar sus eventos.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <TableGeneric
              table={table}
              searchPlaceholder="Buscar eventos…"
              emptyMessage="No hay eventos para mostrar."
            />
            <PaginationGeneric meta={results.meta} links={results.links} />
          </TabsContent>
        </Tabs>
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
                toast.success('Evento actualizado correctamente', { position: 'bottom-right' });
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
