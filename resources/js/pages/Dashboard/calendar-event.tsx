import { endOfDay, format, getDay, parseISO, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { useMemo, useState } from 'react';
import type { EventPropGetter, ToolbarProps, View } from 'react-big-calendar';
import { Calendar as BigCalendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';

import type { DashboardEvent } from '@/types';

interface CalendarAgendaProps {
  events: DashboardEvent[];
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
  onSelectEvent?: (event: DashboardEvent) => void;
  onNavigate?: (date: Date) => void;
}

interface CalendarItem {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: DashboardEvent['type'];
  source: DashboardEvent;
}

const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse: parseISO,
  startOfWeek: () => startOfWeek(new Date(), { locale: es }),
  getDay,
  locales,
});

export function CalendarEvent({
  events,
  selectedDate,
  onSelectDate,
  onSelectEvent,
  onNavigate,
}: CalendarAgendaProps) {
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(selectedDate ?? new Date());
  const parsedEvents = useMemo(
    () =>
      events.map((e) => ({
        id: e.id,
        title: e.title,
        start: parseISO(e.start_date),
        end: endOfDay(parseISO(e.end_date || e.start_date)),
        resource: e.type,
        source: e,
      })),
    [events]
  );

  const eventStyleGetter: EventPropGetter<CalendarItem> = (event) => {
    const colors: Record<DashboardEvent['type'], string> = {
      cumpleanos: '#db2777',
      festivo: '#16a34a',
      evento: '#2563eb',
      lanzamiento: '#9333ea',
      campania: '#ea580c',
    };

    const color = colors[event.resource] ?? '#6b7280';

    return {
      style: {
        backgroundColor: color,
        border: 'none',
        borderRadius: '0.35rem',
        color: 'white',
        padding: '2px 8px',
      },
    };
  };

  const CustomToolbar = (toolbar: ToolbarProps<CalendarItem>) => {
    const goToBack = () => toolbar.onNavigate('PREV');
    const goToNext = () => toolbar.onNavigate('NEXT');
    const goToToday = () => toolbar.onNavigate('TODAY');

    return (
      <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
        <ButtonGroup>
          <Button type="button" variant="outline" onClick={goToBack} className="px-3">
            <ChevronLeft />
          </Button>

          <Button type="button" variant="outline" onClick={goToToday} className="px-4">
            Hoy
          </Button>
          <Button type="button" variant="outline" onClick={goToNext} className="px-3">
            <ChevronRight />
          </Button>
        </ButtonGroup>
        <h2 className="text-xl font-semibold">{toolbar.label}</h2>
        <div className="flex gap-2">
          <ButtonGroup>
            {['month', 'week', 'day', 'agenda'].map((v) => (
              <Button
                key={v}
                type="button"
                onClick={() => toolbar.onView(v as View)}
                variant={toolbar.view === v ? 'default' : 'outline'}
                className="px-3 capitalize"
              >
                {v === 'month' ? 'Mes' : v === 'week' ? 'Semana' : v === 'day' ? 'Día' : 'Agenda'}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[32rem] w-full flex-1">
      <BigCalendar
        localizer={localizer}
        culture="es"
        events={parsedEvents}
        startAccessor="start"
        endAccessor="end"
        view={view}
        onView={setView}
        date={date}
        onNavigate={(nextDate) => {
          setDate(nextDate);
          onNavigate?.(nextDate);
        }}
        views={['month', 'week', 'day', 'agenda']}
        components={{ toolbar: CustomToolbar }}
        eventPropGetter={eventStyleGetter}
        selectable
        dayPropGetter={(day) =>
          selectedDate && format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
            ? { style: { backgroundColor: 'color-mix(in oklab, var(--primary) 10%, transparent)' } }
            : {}
        }
        onSelectSlot={({ start }) => onSelectDate?.(start)}
        onSelectEvent={(event) => {
          onSelectDate?.(event.start);
          onSelectEvent?.(event.source);
        }}
        messages={{
          today: 'hoy',
          previous: 'Anterior',
          next: 'Siguiente',
          month: 'Mes',
          week: 'Semana',
          day: 'Dia',
          agenda: 'Agenda',
          date: 'Fecha',
          time: 'Hora',
          event: 'Evento',
          noEventsInRange: 'No hay eventos en este rango',
        }}
        className="overflow-y-auto rounded-lg bg-background"
      />
    </div>
  );
}
