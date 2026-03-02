import { ColumnDef } from '@tanstack/react-table';
import { CloudDownload } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Payroll = {
  period: string;
  date: string;
  reference: string;
  amount: number;
};

export function getPayrollColumns(): ColumnDef<Payroll>[] {
  return [
    {
      header: 'Periodo',
      accessorKey: 'period',
    },
    {
      header: 'Fecha',
      accessorKey: 'date',
    },
    {
      header: 'referencia',
      accessorKey: 'reference',
      cell: ({ getValue }) => {
        const reference = getValue<string>();
        return (
          <span className="rounded-full border border-slate-800 bg-slate-500/50 px-3 py-1 text-xs text-slate-300">
            {reference}
          </span>
        );
      },
    },
    {
      header: 'Monto',
      accessorKey: 'amount',
      cell: ({ getValue }) => {
        const amount = getValue<string>();
        return <span>${amount}</span>;
      },
    },
    {
      header: '',
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex justify-center gap-2">
          <Button>
            Descarga <CloudDownload />
          </Button>
        </div>
      ),
    },
  ];
}
