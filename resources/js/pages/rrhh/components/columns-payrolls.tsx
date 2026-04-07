import type { ColumnDef } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PayrollUpload } from '@/types';

export function getPayRollColumns(): ColumnDef<PayrollUpload>[] {
    return [
        {
            cell: ({ row }) => (
                <div className="font-semibold">
                    {row.original.zip_original_name}
                </div>
            ),
            id: 'zip_original_name',
            header: 'Zips',
        },
        {
            header: 'Lo subio',
            accessorKey: 'uploader',
        },
        {
            cell: ({ row }) => (
                <div className="font-semibold">{row.original.period_start}</div>
            ),
            id: 'period_start',
            header: 'Inicio del periodo',
        },
        {
            cell: ({ row }) => (
                <div className="font-semibold">{row.original.period_end}</div>
            ),
            id: 'period_end',
            header: 'Fin del periodo',
        },
        {
            accessorKey: 'status',
            header: 'Status',
        },
        {
            header: '',
            id: 'actions',
            cell: ({ row }) => {
                return (
                    <div className="flex flex-row gap-4">
                        <Button size="icon" variant="destructive">
                            <Trash2 />
                        </Button>
                    </div>
                );
            },
        },
    ];
}
