import { Head } from '@inertiajs/react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { SquarePen, Trash } from 'lucide-react';
import TableGeneric from '@/components/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import NotificationLayout from '@/layouts/notification/layout';
import { index as notifications } from '@/routes/notifications';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Notificaciones',
    href: notifications().url,
  },
];

interface Notification {
  id: number;
  title: string;
  content: string;
  priority: 'normal' | 'importante' | 'urgente';
  type: 'aviso' | 'noticia' | 'articulo' | 'mensaje';
  published_at: string;
}

interface NotificationProps {
  data: Notification[];
}

export default function Notification({ data }: NotificationProps) {
  const columns: ColumnDef<Notification>[] = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'prioridad',
      accessorKey: 'priority',
      cell: ({ row }) => (
        <Badge className="px-2.5 text-muted-foreground">{row.getValue('priority')}</Badge>
      ),
    },
    {
      header: 'Tipo',
      accessorKey: 'type',
      cell: ({ row }) => (
        <Badge variant="outline" className="px-2.5 text-muted-foreground">
          {row.getValue('type')}
        </Badge>
      ),
    },
    {
      header: 'Titulo',
      accessorKey: 'title',
    },
    {
      header: 'Contenido',
      accessorKey: 'content',
      cell: ({ row }) => <div className="max-w-xs truncate">{row.getValue('content')}</div>,
    },
    {
      header: 'Fehca publicacion',
      accessorKey: 'published_at',
    },
    {
      header: '',
      id: 'actions',
      cell: ({ row }) => {
        const event = row.original;
        return (
          <div className="flex justify-center gap-2">
            <Button size="icon" onClick={() => onEdit?.(event)} variant="ghost">
              <SquarePen />
            </Button>
            <Button
              size="icon"
              onClick={() => onDelete?.(event)}
              variant="ghost"
              className="text-red-400 hover:text-red-500"
            >
              <Trash />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Notificaciones" />
      <NotificationLayout>
        <TableGeneric table={table} />
      </NotificationLayout>
    </AppLayout>
  );
}
