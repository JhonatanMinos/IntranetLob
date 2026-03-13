import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { payroll } from '@/routes/profile';
import type { BreadcrumbItem } from '@/types';
import Heading from '@/components/heading';
import { Head } from '@inertiajs/react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { getPayrollColumns } from './components/columns-payroll';
import TableGeneric from '@/components/table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payroll user',
        href: payroll().url,
    },
];

const data = [
    {
        period: '2026-01',
        date: '2026-01-05',
        reference: 'INV-001',
    },
    {
        period: '2026-01',
        date: '2026-01-12',
        reference: 'INV-002',
    },
    {
        period: '2026-02',
        date: '2026-02-03',
        reference: 'INV-003',
    },
    {
        period: '2026-02',
        date: '2026-02-18',
        reference: 'INV-004',
    },
    {
        period: '2026-03',
        date: '2026-03-01',
        reference: 'INV-005',
    },
];
export default function Payroll() {
    const table = useReactTable({
        data: data,
        columns: getPayrollColumns(),
        getCoreRowModel: getCoreRowModel(),
    });
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nominas" />
            <h1 className="sr-only">Payroll settings</h1>
            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Informacion de nominas"
                        description="vista y descarga de nomnas por mes"
                    />
                    <TableGeneric table={table} />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
