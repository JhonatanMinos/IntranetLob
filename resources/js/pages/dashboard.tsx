import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { BirthDays } from '@/pages/Dashboard/birthdays-card';
import { CalendarEvent } from '@/pages/Dashboard/calendar-event';
import { CarouselLob } from '@/pages/Dashboard/carousel-lob';
import { EventsCard } from '@/pages/Dashboard/events-card';
import { NewsCard } from '@/pages/Dashboard/news-card';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface Event {
    id: number;
    title: string;
    type: 'event' | 'holiday' | 'birthday';
    start_date: string; // ISO string
    end_date: string;
}

interface notification {
    id: number;
    title: string;
    content: string;
    priority: 'normal' | 'importante' | 'urgente';
    type: 'aviso' | 'noticia' | 'articulo' | 'mensaje';
    published_at: string;
}

interface birthday {
    id: number;
    name: string;
    position: string;
    birthdat: string;
}

interface DashboardProps {
    events: Event[];
    news: notification[];
    birthday: birthday[];
}

export default function Dashboard({ events, news, birthday }: DashboardProps) {
    const [open, setOpen] = useState(false);
    const today = new Date();

    const modifiersBorder = {
        cumpleanos: 'border-pink-300',
        festivo: 'border-green-300',
        evento: 'border-blue-300',
        lanzamiento: 'border-purple-300',
    };

    const modifiersClassNames = {
        cumpleanos: 'bg-pink-300 text-white rounded-3xl',
        festivo: 'bg-green-300 text-white rounded-3xl',
        evento: 'bg-blue-300 text-white rounded-3xl',
        lanzamiento: 'bg-purple-300 text-white rounded-3xl',
    };

    const modifiersText = {
        cumpleanos: 'text-pink-300',
        festivo: 'text-green-300',
        evento: 'text-blue-300',
        lanzamiento: 'text-purple-300',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
                    <div className="rounded bg-background lg:col-span-2">
                        <CarouselLob />
                        <NewsCard />
                    </div>
                    <div className="flex h-32 flex-col gap-4">
                        <BirthDays birthdays={birthday} />
                        <EventsCard setOpen={setOpen} events={events} />
                    </div>
                </div>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="h-[80vh] w-full max-w-5xl overflow-hidden rounded-lg shadow-lg md:h-[90vh] md:w-[90vw] md:max-w-none">
                    <DialogHeader className="border-b border-gray-200 p-4">
                        <DialogTitle className="text-xl">
                            Calendario
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex h-full flex-row gap-6">
                        <div className="flex flex-1 items-center justify-center">
                            <CalendarEvent events={events} />
                        </div>
                        <aside className="flex h-full w-full shrink-0 flex-col overflow-y-auto p-6 lg:w-[300px]">
                            <div className="mb-6">
                                <h2 className="mb-1 text-xl font-medium text-white">
                                    Eventos del dia
                                </h2>
                                <p className="text-sm text-gray-400">
                                    {format(today, 'dd MMM yyyy')}
                                </p>
                            </div>
                            {events?.length > 0 ? (
                                events.map((event) => (
                                    <div
                                        key={event.id}
                                        className="flex flex-col pt-2"
                                    >
                                        <div
                                            className={`group cursor-pointer rounded-lg border-l-4 ${modifiersBorder[event.type]} bg-[#2a2a2a] p-4 transition-colors hover:bg-[#333333]`}
                                        >
                                            <p className="mb-1 text-xs font-medium text-gray-400 group-hover:text-gray-300">
                                                10:00 AM
                                            </p>
                                            <h3 className="mb-2 text-base font-medium text-white">
                                                {event.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs">
                                                <span
                                                    className={`h-2 w-2 rounded-full ${modifiersClassNames[event.type]}`}
                                                ></span>
                                                <span
                                                    className={`group-hover:text-oragen-200 ${modifiersText[event.type]} `}
                                                >
                                                    {event.type}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400">
                                    No hay eventos hoy.
                                </p>
                            )}
                        </aside>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
