import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { SquarePen, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { NotificationItem } from '@/types';

interface NotificationColumnsProps {
  onEdit: (item: NotificationItem) => void;
  onDelete: (item: NotificationItem) => void;
}

export function getNotificationColumns({
  onEdit,
  onDelete,
}: NotificationColumnsProps): ColumnDef<NotificationItem>[] {
  return [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'prioridad',
      accessorKey: 'priority',
      cell: ({ row }) => {
        const value = row.getValue('priority');

        const colors = {
          normal: 'bg-green-500/20 text-green-400 border-green-500/30',
          importante: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
          urgente: 'bg-red-500/20 text-red-400 border-red-500/30',
        };

        return (
          <Badge variant="outline" className={`px-2.5 capitalize ${colors[value] ?? ''}`}>
            {value}
          </Badge>
        );
      },
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
      accessorKey: 'publishedAt',
      cell: ({ row }) => {
        const dateValue = row.getValue('publishedAt');
        return (
          <div className="whitespace-nowrap">
            {format(new Date(dateValue as string), 'dd MMM yyyy HH:mm:ss', {
              locale: es,
            })}
          </div>
        );
      },
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
}
