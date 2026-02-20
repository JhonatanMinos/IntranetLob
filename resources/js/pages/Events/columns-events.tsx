import type { EventItem } from '@/types';
import type { ColumnDef } from '@tanstack/react-table';
import { SquarePen, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

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
        const colors = {
          evento: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
          festivo: 'bg-green-500/20 text-green-400 border-green-500/30',
          lanzamiento: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        };
        return (
          <span className={`rounded-full border px-3 py-1 text-xs ${colors[type]}`}>{type}</span>
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
            <Button size="icon" onClick={() => onEdit(event)} variant="ghost">
              <SquarePen />
            </Button>
            <Button
              size="icon"
              onClick={() => onDelete(event)}
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
