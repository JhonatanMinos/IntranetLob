import { Head, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { BirthDays } from '@/pages/Dashboard/birthdays-card';
import { CalendarEvent } from '@/pages/Dashboard/calendar-event';
import { CarouselLob } from '@/pages/Dashboard/carousel-lob';
import { EventsCard } from '@/pages/Dashboard/events-card';
import { NewsCard } from '@/pages/Dashboard/news-card';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, Notification } from '@/types';
import { CalendarX } from 'lucide-react';
import { Card } from '@/components/ui/card';

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

interface birthday {
  id: number;
  name: string;
  position: string;
  birthdat: string;
}

interface DashboardProps {
  events: Event[];
  news: Notification[];
  birthday: birthday[];
}

export default function Dashboard() {
  const { events, news, birthday } = usePage<DashboardProps>().props;

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
    cumpleanos: 'text-pink-900 dark:text-pink-300',
    festivo: 'text-green-900 dark:text-green-300',
    evento: 'text-blue-900 dark:text-blue-300',
    lanzamiento: 'text-purple-900 dark:text-purple-300',
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="h-screem flex flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
          <div className="rounded bg-background lg:col-span-2">
            <CarouselLob />
            <NewsCard news={news} />
          </div>
          <div className="flex h-32 flex-col gap-4">
            <BirthDays birthdays={birthday} />
            <EventsCard setOpen={setOpen} events={events} />
          </div>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex max-w-5xl flex-col gap-0 overflow-hidden rounded-lg p-0 shadow-lg md:h-[90vh] md:w-[90vw] md:max-w-none">
          <DialogHeader className="shrink-0 px-6 pt-6 pb-4">
            <DialogTitle>Calendario</DialogTitle>
          </DialogHeader>

          <div className="flex min-h-0 flex-1 flex-row gap-6 px-6 pb-6">
            {/* Calendario: min-h-0 es clave para que flex no lo desborde */}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <CalendarEvent events={events} />
            </div>

            <aside className="flex h-full w-full shrink-0 flex-col overflow-y-auto lg:w-[300px]">
              <div className="mb-6">
                <h2 className="mb-1 text-xl font-medium text-white">Eventos del dia</h2>
                <p className="text-sm text-gray-400">{format(today, 'dd MMM yyyy')}</p>
              </div>

              {events?.length > 0 ? (
                events.map((event) => (
                  <div key={event.id} className="flex flex-col pt-2">
                    <Card
                      className={`group cursor-pointer rounded-lg border-l-4 ${modifiersBorder[event.type]} bg-sidebar p-2 transition-colors`}
                    >
                      <p className="text-xs font-medium text-gray-400 group-hover:text-gray-300">
                        10:00 AM
                      </p>
                      <h3 className="mb-2 text-base font-medium">{event.title}</h3>
                      <div className="flex items-center gap-2 text-xs">
                        <span
                          className={`h-2 w-2 rounded-full ${modifiersClassNames[event.type]}`}
                        />
                        <span
                          className={`${modifiersText[event.type]} group-hover:text-orange-200`}
                        >
                          {event.type}
                        </span>
                      </div>
                    </Card>
                  </div>
                ))
              ) : (
                <div className="flex h-44 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed">
                  <CalendarX className="text-muted" />
                  <p className="text-sm text-muted">No hay eventos programados.</p>
                </div>
              )}
            </aside>
          </div>
        </DialogContent>
      </Dialog>{' '}
    </AppLayout>
  );
}
