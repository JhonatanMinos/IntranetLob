import { SquarePen, Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SimpleModel } from '@/types';

interface CompanyProps {
  onDelete: (item: SimpleModel) => void;
}

export function getCompanyColumns({ onDelete }) {
  return [
    {
      cell: ({ row }) => <div className="font-semibold">{row.original.name}</div>,
      id: 'name',
      header: 'Companias',
    },
    {
      header: '',
      id: 'actions',
      cell: ({ row }) => {
        const company = row.original;
        return (
          <div className="flex flex-row gap-4">
            <Button size="icon" variant="outline">
              <SquarePen />
            </Button>
            <Button size="icon" variant="destructive" onClick={() => onDelete?.(company)}>
              <Trash2Icon />
            </Button>
          </div>
        );
      },
    },
  ];
}
