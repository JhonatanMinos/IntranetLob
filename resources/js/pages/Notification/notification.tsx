import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { index, show } from '@/routes/notifications';
import type { BreadcrumbItem, Notification } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Calendar } from 'lucide-react';

interface priority {
  value: string;
  label: string;
  color: string;
}

interface types {
  value: string;
  label: string;
}

export default function NotificationShow() {
  const { notification, priorities, types } = usePage<{
    notification: Notification;
    priorities: priority;
    types: types;
  }>().props;
  console.log(notification);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Notificaciones',
      href: index().url,
    },
    {
      title: notification.title,
      href: show({ notification: notification.id }).url,
    },
  ];

  const priority = priorities.find((p) => p.value === notification.priority);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={notification.title} />
      <main className="flex h-full flex-col overflow-y-auto px-5 py-5">
        <p className="text-slate dark: text-slate-400">Comunicado oficial</p>

        <div>
          <div className="flex flex-col justify-between gap-4 md:flex-row">
            <h1 className="text-4xl font-bold uppercase">{notification.type}</h1>
            <p className="flex flex-row gap-3">
              <Calendar />
              {notification.publishedAt}
            </p>
          </div>
          <div
            className={`m-5 flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm`}
          >
            <CardHeader>
              <CardTitle>{notification.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center md:flex-col">
              {notification.imagenPath && (
                <img
                  src={`/storage/${notification.imagenPath}`}
                  alt={notification.title}
                  className="rounded-xl aspect-3/2 shadow-xl/20"
                />
              )}
              {notification.content}
            </CardContent>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
