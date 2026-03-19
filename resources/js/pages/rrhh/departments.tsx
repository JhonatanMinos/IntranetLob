import PaginationGeneric from '@/components/pagination';
import AppLayout from '@/layouts/app-layout';
import RrhhLayout from '@/layouts/rrhh/layout';
import { index as departament } from '@/routes/departament';
import type { BreadcrumbItem, Department, PaginatedResponse } from '@/types';
import { PageProps } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { getDeparmentColumns } from './components/columns-deparments';
import { useMemo } from 'react';
import TableGeneric from '@/components/table';
import { destroy } from '@/routes/departament';
import { useFlash } from '@/hooks/use-flash';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'capital humando', href: '/rrhh' },
    { title: 'Departamentos', href: departament().url },
];

interface DepartmentsProps extends PageProps {
    data: PaginatedResponse<Department>;
    userAll: number;
}

export default function Departments() {
    const { data, userAll } = usePage<DepartmentsProps>().props;
    const handleDelete = (departament: Department) => {
        router.delete(destroy(departament?.id), {
            onSuccess: () => {
                router.reload({ only: ['data'] });
            },
        });
    };

    useFlash();

    const columns = useMemo(
        () => getDeparmentColumns({ userAll, onDelete: handleDelete }),
        [handleDelete],
    );

    const table = useReactTable({
        data: data.data ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Capital Humano" />
            <RrhhLayout>
                <TableGeneric table={table} />
                <PaginationGeneric links={data.links} meta={data.meta} />
            </RrhhLayout>
        </AppLayout>
    );
}
