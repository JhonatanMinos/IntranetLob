import type { ColumnDef } from '@tanstack/react-table';
import { RefreshCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { PayrollUpload } from '@/types';

interface PayRollColumnsProps {
  onDelete: (item: PayrollUpload) => void;
  onRefresh: (item: PayrollUpload) => void;
}

export function getPayRollColumns({
  onDelete,
  onRefresh,
}: PayRollColumnsProps): ColumnDef<PayrollUpload>[] {
  return [
    {
      cell: ({ row }) => <div className="font-semibold">{row.original.zip_original_name}</div>,
      id: 'zip_original_name',
      header: 'Zips',
    },
    {
      header: 'Lo subio',
      accessorKey: 'uploader',
    },
    {
      cell: ({ row }) => <div className="font-semibold">{row.original.period_start}</div>,
      id: 'period_start',
      header: 'Inicio del periodo',
    },
    {
      cell: ({ row }) => <div className="font-semibold">{row.original.period_end}</div>,
      id: 'period_end',
      header: 'Fin del periodo',
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
    {
      header: 'Progreso',
      cell: ({ row }) => {
        const totalFiles = row.original.total_files;
        const completed = row.original.processed_files;
        const percent = Math.round((completed / totalFiles) * 100);
        return (
          <Field className="w-full max-w-sm">
            <FieldLabel className="progress-upload">
              <Progress value={percent} id="progress-upload" />
              <span className="ml-auto">{percent} %</span>
            </FieldLabel>
          </Field>
        );
      },
    },
    {
      header: '',
      id: 'actions',
      cell: ({ row }) => {
        const payroll = row.original;
        return (
          <div className="flex flex-row gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={() => onRefresh(payroll)}>
                  <RefreshCcw />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refrescar archivos fallidos</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="destructive" onClick={() => onDelete(payroll)}>
                  <Trash2 />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Eliminar Nomina</TooltipContent>
            </Tooltip>
          </div>
        );
      },
    },
  ];
}
