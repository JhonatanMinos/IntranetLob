import { parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';

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

export function CalendarEvent({ events }: CalendarAgendaProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        new Date(),
    );

    const parsedEvents = events.map((e) => ({
        ...e,
        date: parseISO(e.start_date),
    }));

    const modifiers = {
        birthday: (date: Date) =>
            parsedEvents.some(
                (e) =>
                    e.type === 'birthday' &&
                    e.date.toDateString() === date.toDateString(),
            ),

        holiday: (date: Date) =>
            parsedEvents.some(
                (e) =>
                    e.type === 'festivo' &&
                    e.date.toDateString() === date.toDateString(),
            ),

        event: (date: Date) =>
            parsedEvents.some(
                (e) =>
                    e.type === 'evento' &&
                    e.date.toDateString() === date.toDateString(),
            ),

        launch: (date: Date) =>
            parsedEvents.some(
                (e) =>
                    e.type === 'lanzamiento' &&
                    e.date.toDateString() === date.toDateString(),
            ),
    };

    const modifiersClassNames = {
        birthday: 'bg-pink-300 text-white rounded-3xl',
        holiday: 'bg-green-300 text-white rounded-3xl',
        event: 'bg-blue-300 text-white rounded-3xl',
        launch: 'bg-purple-300 text-white rounded-3xl',
    };

    return (
        <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            className="w-7/10"
            showWeekNumber
            locale={es}
        />
    );
}
