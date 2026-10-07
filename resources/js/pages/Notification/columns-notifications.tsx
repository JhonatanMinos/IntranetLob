import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { SquarePen, Trash } from 'lucide-react';
import { StatusBadge } from '@/components/status-badge';
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
        const value = row.getValue<NotificationItem['priority']>('priority');

        const tones = {
          normal: 'success',
          importante: 'warning',
          urgente: 'danger',
        };

        return (
          <StatusBadge
            tone={tones[value] as 'success' | 'warning' | 'danger'}
            className="capitalize"
          >
            {value}
          </StatusBadge>
        );
      },
    },
    {
      header: 'Tipo',
      accessorKey: 'type',
      cell: ({ row }) => (
        <Badge variant="secondary" className="px-2">
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
      cell: ({ row }) => {
        const htmlContent = row.getValue('content') as string;

        // Creamos un elemento temporal para extraer solo el texto
        const doc = new DOMParser().parseFromString(htmlContent, 'text/html');
        const plainText = doc.body.textContent || '';

        return (
          <div className="max-w-[250px] truncate text-center text-muted-foreground italic">
            {plainText}
          </div>
        );
      },
    },
    {
      header: 'Fecha de publicación',
      accessorKey: 'publishedAt',
      cell: ({ row }) => {
        const dateValue = row.getValue('publishedAt');
        return (
          <div className="whitespace-nowrap">
            {format(new Date(dateValue as string), 'dd MMM yyyy', {
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
            <Button
              size="icon"
              onClick={() => onEdit?.(event)}
              variant="ghost"
              aria-label={`Editar ${event.title}`}
            >
              <SquarePen />
            </Button>
            <Button
              size="icon"
              onClick={() => onDelete?.(event)}
              variant="ghost"
              className="text-red-400 hover:text-red-500"
              aria-label={`Eliminar ${event.title}`}
            >
              <Trash />
            </Button>
          </div>
        );
      },
    },
  ];
}
