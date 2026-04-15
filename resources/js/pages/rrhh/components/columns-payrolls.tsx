import { router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { CloudDownload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { create } from '@/routes/payroll';
import type { User } from '@/types/auth';

export function getPayRollColumns(): ColumnDef<User>[] {
  return [
    {
      cell: ({ row }) => <div className="font-semibold">{row.original.name}</div>,
      id: 'name',
      header: 'Nombre',
    },
    {
      header: 'Status',
      cell: () => <Badge>Pendiente</Badge>,
    },
    {
      header: '',
      id: 'actions',
      cell: ({ row }) => {
        return (
          <div className="flex flex-row gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => router.get(create(row.original.id).url)}
                >
                  <CloudDownload />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Subir Archivo</TooltipContent>
            </Tooltip>
          </div>
        );
      },
    },
  ];
}
