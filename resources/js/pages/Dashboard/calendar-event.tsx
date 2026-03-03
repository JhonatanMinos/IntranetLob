import { parseISO, format, getDay, startOfWeek } from 'date-fns';
import { useMemo, useState } from 'react';
import { es } from 'date-fns/locale';
import {
    Calendar as BigCalendar,
    dateFnsLocalizer,
    Views,
} from 'react-big-calendar';
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
    const [view, setView] = useState(Views.MOUNTH);
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
        [events],
    );

    const eventStyleGetter = (event: any) => {
        const colors: Record<string, string> = {
            birthday: 'bg-pink-500',
            holiday: 'bg-green-500',
            event: 'bg-blue-500',
            launch: 'bg-purple-500',
        };

        return {
            className: `${colors[event.resource]} text-white rounded-xl px-2 py-1 border-0`,
        };
    };

    const CustomToolbar = (toolbar: any) => {
        const goToBack = () => toolbar.onNavigate('Prev');
        const goToNext = () => toolbar.onNavigate('Next');
        const goToToday = () => toolbar.onNavigate('TODAY');

        return (
            <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
                <ButtonGroup>
                    <Button onClick={goToBack} className="rounded-lg px-3 py-1">
                        <ChevronLeft />
                    </Button>

                    <Button
                        onClick={goToToday}
                        className="rounded-lg px-4 py-1"
                    >
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
                                {v === 'month'
                                    ? 'Mes'
                                    : v === 'week'
                                      ? 'Semana'
                                      : v === 'day'
                                        ? 'Día'
                                        : 'Agenda'}
                            </Button>
                        ))}
                    </ButtonGroup>
                </div>
            </div>
        );
    };

    return (
        <div className="h-[700px] w-full">
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
                Views={['month', 'week', 'day', 'agenda']}
                components={{ toolbar: CustomToolbar }}
                eventPropGetter={eventStyleGetter}
                messages={{
                    today: 'hoy',
                    previous: 'Anterior',
                    next: 'Siguiente',
                    mounth: 'Mes',
                    week: 'Semana',
                    day: 'Dia',
                    agenda: 'Agenda',
                    date: 'Fecha',
                    time: 'Hora',
                    event: 'Evento',
                    noEventsInRange: 'No hay eventos en este rango',
                }}
                className="overflow-y-auto rounded-xl"
            />
        </div>
    );
}
