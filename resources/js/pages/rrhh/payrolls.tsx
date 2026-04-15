import type { PageProps } from '@inertiajs/core';
import { Head, router, usePage } from '@inertiajs/react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo } from 'react';
import { toast } from 'sonner';
import PaginationGeneric from '@/components/pagination';
import TableGeneric from '@/components/table';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import RrhhLayout from '@/layouts/rrhh/layout';
import { destroy, index, retry } from '@/routes/payroll';
import type { BreadcrumbItem, PayrollUpload, paginatedResponse } from '@/types';
import type { User } from '@/types/auth';
import { getPayRollColumns } from './components/columns-payrolls';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Capital Humano', href: '/rrhh' },
    { title: 'Nomina', href: index().url },
];

interface PayRollsProps extends PageProps {
    users: User;
    stats: {
        period: string;
        usersWithFiles: string;
        usersWithoutFiles: string;
        totalUser: string;
        coverage: string;
    };
    flash: {
        success?: string;
        error?: string;
    };
}

export default function PayRolls() {
    const { users, stats } = usePage<PayRollsProps>().props;

    const columns = useMemo(() => getPayRollColumns(), []);

    const table = useReactTable({
        data: users.data ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nomina" />
            <div className="grid grid-cols-4 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
                <Card className="@container/card">
                    <CardHeader>
                        <CardDescription>Completados</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {stats.usersWithFiles}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="@container/card">
                    <CardHeader>
                        <CardDescription>Faltantes</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {stats.usersWithoutFiles}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="@container/card">
                    <CardHeader>
                        <CardDescription>Total</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {stats.totalUsers}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="@container/card">
                    <CardDescription>Promedio</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {stats.coverage} %
                    </CardTitle>
                </Card>
            </div>
            <RrhhLayout>
                <TableGeneric table={table} />
            </RrhhLayout>
        </AppLayout>
    );
}
