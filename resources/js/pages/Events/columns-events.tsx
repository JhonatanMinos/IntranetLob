import type { ColumnDef } from '@tanstack/react-table';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { SquarePen, Trash } from 'lucide-react';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import type { EventItem } from '@/types';

interface EventcolumnsProps {
  onEdit: (item: EventItem) => void;
  onDelete: (item: EventItem) => void;
}

export function getEventColumns({ onEdit, onDelete }: EventcolumnsProps): ColumnDef<EventItem>[] {
  return [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Titulo',
      accessorKey: 'title',
    },
    {
      header: 'Fecha',
      accessorKey: 'startDate',
      cell: ({ getValue }) =>
        format(parseISO(getValue<string>()), 'dd MMM yyyy', {
          locale: es,
        }),
    },
    {
      header: 'Tipo',
      accessorKey: 'type',
      cell: ({ getValue }) => {
        const type = getValue<string>();
        const tones = {
          evento: 'info',
          festivo: 'success',
          lanzamiento: 'warning',
          campania: 'warning',
          cumpleanos: 'info',
        };
        return (
          <StatusBadge
            tone={tones[type as keyof typeof tones] as 'info' | 'success' | 'warning'}
            className="capitalize"
          >
            {type}
          </StatusBadge>
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
              onClick={() => onEdit(event)}
              variant="ghost"
              aria-label={`Editar ${event.title}`}
            >
              <SquarePen />
            </Button>
            <Button
              size="icon"
              onClick={() => onDelete(event)}
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
