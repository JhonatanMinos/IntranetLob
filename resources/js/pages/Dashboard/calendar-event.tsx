import { parseISO, format, getDay, startOfWeek } from 'date-fns';
import { useMemo, useState } from 'react';
import { es } from 'date-fns/locale';
import { Calendar as BigCalendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ButtonGroup } from '@/components/ui/button-group';

type CalendarEvent = {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  type: 'birthday' | 'holiday' | 'event' | 'launch';
};

interface CalendarAgendaProps {
  events: CalendarEvent[];
}

const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse: parseISO,
  startOfWeek: () => startOfWeek(new Date(), { locale: es }),
  getDay,
  locales,
});

export function CalendarEvent({ events }: CalendarAgendaProps) {
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const parsedEvents = useMemo(
    () =>
      events.map((e) => ({
        id: e.id,
        title: e.title,
        start: parseISO(e.start_date),
        end: parseISO(e.end_date),
        resource: e.type,
      })),
    [events]
  );

  const eventStyleGetter = (event: any) => {
    const colors: Record<string, { bg: string; hover: string }> = {
      birthday: { bg: '#ec4899', hover: '#db2777' }, // pink-500
      holiday: { bg: '#22c55e', hover: '#16a34a' }, // green-500
      event: { bg: '#3b82f6', hover: '#2563eb' }, // blue-500
      launch: { bg: '#a855f7', hover: '#9333ea' }, // purple-500
    };

    const color = colors[event.resource] ?? {
      bg: '#6b7280',
      hover: '#4b5563',
    };

    return {
      style: {
        backgroundColor: color.bg,
        border: 'none',
        borderRadius: '0.35rem',
        color: 'white',
        padding: '2px 8px',
      },
    };
  };

  const CustomToolbar = (toolbar: any) => {
    const goToBack = () => toolbar.onNavigate('PREV');
    const goToNext = () => toolbar.onNavigate('NEXT');
    const goToToday = () => toolbar.onNavigate('TODAY');

    return (
      <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
        <ButtonGroup>
          <Button onClick={goToBack} className="rounded-lg px-3 py-1">
            <ChevronLeft />
          </Button>

          <Button onClick={goToToday} className="rounded-lg px-4 py-1">
            Hoy
          </Button>
          <Button onClick={goToNext} className="rounded-lg px-3 py-1">
            <ChevronRight />
          </Button>
        </ButtonGroup>
        <h2 className="text-xl font-semibold">{toolbar.label}</h2>
        <div className="flex gap-2">
          <ButtonGroup>
            {['month', 'week', 'day', 'agenda'].map((v) => (
              <Button
                key={v}
                onClick={() => toolbar.onView(v)}
                className={`rounded-lg px-3 py-1 capitalize`}
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
    <div className="h-screen w-full">
      <BigCalendar
        localizer={localizer}
        culture="es"
        events={parsedEvents}
        startAccessor="start"
        endAccessor="end"
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
        views={['month', 'week', 'day', 'agenda']}
        components={{ toolbar: CustomToolbar }}
        eventPropGetter={eventStyleGetter}
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
        className="overflow-y-auto"
      />
    </div>
  );
}
