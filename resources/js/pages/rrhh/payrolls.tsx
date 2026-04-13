import { Head, router, usePage } from '@inertiajs/react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo } from 'react';
import { toast } from 'sonner';
import PaginationGeneric from '@/components/pagination';
import TableGeneric from '@/components/table';
import AppLayout from '@/layouts/app-layout';
import RrhhLayout from '@/layouts/rrhh/layout';
import { destroy, index, retry } from '@/routes/payroll';
import type { BreadcrumbItem, PayrollUpload, paginatedResponse } from '@/types';
import { getPayRollColumns } from './components/columns-payrolls';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Capital Humano', href: '/rrhh' },
    { title: 'Nomina', href: index().url },
];

interface PayRollsProps {
    uploads: paginatedResponse<PayrollUpload>;
    flash: {
        success?: string;
        error?: string;
    };
}

export default function PayRolls() {
    const { uploads } = usePage<PayRollsProps>().props;

    const handleDelete = (payroll: PayrollUpload) => {
        if (
            confirm(
                `¿Estás seguro de que deseas eliminar esta Nomina "${payroll.zip_original_name}"?`,
            )
        ) {
            router.delete(destroy(payroll.id).url, {
                onSuccess: () => {
                    toast.success('Nomina elimanda correctamente', {
                        position: 'bottom-right',
                    });
                },
                onError: () => {
                    toast.error('Error al elimnar la nomina', {
                        position: 'bottom-right',
                    });
                },
            });
        }
    };

    const handleRefresh = (payroll: PayrollUpload) => {
        router.post(retry(payroll.id).url, {
            onSuccess: () => {
                toast.success('Se refresco la carga de los archivos', {
                    position: 'bottom-right',
                });
            },
        });
    };

    const columns = useMemo(
        () =>
            getPayRollColumns({
                onDelete: handleDelete,
                onRefresh: handleRefresh,
            }),
        [],
    );

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
                <PaginationGeneric links={uploads.links} meta={uploads.meta} />
            </RrhhLayout>
        </AppLayout>
    );
}
