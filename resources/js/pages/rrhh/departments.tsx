import { Head, router, usePage } from '@inertiajs/react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo } from 'react';
import PaginationGeneric from '@/components/pagination';
import TableGeneric from '@/components/table';
import { useFlash } from '@/hooks/use-flash';
import AppLayout from '@/layouts/app-layout';
import RrhhLayout from '@/layouts/rrhh/layout';
import { index as departament, destroy } from '@/routes/departament';
import type {
    BreadcrumbItem,
    Department,
    PageProps,
    PaginatedResponse,
} from '@/types';
import { getDeparmentColumns } from './components/columns-deparments';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Capital Humano', href: '/rrhh' },
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
