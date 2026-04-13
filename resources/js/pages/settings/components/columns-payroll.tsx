import type { ColumnDef } from '@tanstack/react-table';
import { CloudDownload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PayrollUser {
    id: number;
    file_path: string;
    original_name: string;
    mime_type: string;
    file_size: number;
    user_id: number | null;
    name: string;
    processed: number;
    error_message: string | null;
    created_at: string;
    updated_at: string;
}

interface PayrollPros {
    onDownload: (item: PayrollUser) => void;
}

export function getPayrollColumns({
    onDownload,
}: PayrollPros): ColumnDef<PayrollUser>[] {
    return [
        {
            header: 'Archivo',
            accessorKey: 'original_name',
        },
        {
            header: '',
            id: 'actions',
            cell: ({ row }) => {
                const payroll = row.original;
                return (
                    <div className="flex justify-center gap-2">
                        <Button onClick={() => onDownload(payroll)}>
                            <CloudDownload />
                        </Button>
                    </div>
                );
            },
        },
    ];
}
