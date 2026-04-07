import { Head, usePage } from '@inertiajs/react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo } from 'react';
import TableGeneric from '@/components/table';
import AppLayout from '@/layouts/app-layout';
import RrhhLayout from '@/layouts/rrhh/layout';
import { index } from '@/routes/payroll';
import type { BreadcrumbItem, PayrollUpload, paginatedResponse } from '@/types';
import { getPayRollColumns } from './components/columns-payrolls';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Capital Humano', href: '/rrhh' },
    { title: 'Nomina', href: index().url },
];

interface PayRollsProps extends PageProps {
    uploads: paginatedResponse<PayrollUpload>;
}

export default function PayRolls() {
    const { uploads } = usePage<PayRollsProps>().props;

    const columns = useMemo(() => getPayRollColumns(), []);

    const table = useReactTable({
        data: uploads.data ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nomina" />
            <RrhhLayout>
                <TableGeneric table={table} />
            </RrhhLayout>
        </AppLayout>
    );
}
