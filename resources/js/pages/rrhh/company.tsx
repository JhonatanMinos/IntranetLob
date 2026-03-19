import AppLayout from '@/layouts/app-layout';
import RrhhLayout from '@/layouts/rrhh/layout';
import { index as company, destroy } from '@/routes/company';
import type {
    BreadcrumbItem,
    PaginatedResponse,
    SimpleModel,
    PageProps,
} from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import { getCompanyColumns } from './components/columns-company';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import TableGeneric from '@/components/table';
import PaginationGeneric from '@/components/pagination';
import { useFlash } from '@/hooks/use-flash';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'capital humando', href: '/rrhh' },
    { title: 'Company', href: company().url },
];

interface CompanyProps extends PageProps {
    data: PaginatedResponse<SimpleModel>;
}

export default function Company() {
    const { data } = usePage<CompanyProps>().props;

    const handleDelete = (company: SimpleModel) => {
        router.delete(destroy(company.id), {
            onSuccess: () => {
                router.reload({ only: ['data'] });
            },
        });
    };
    useFlash();

    const columns = useMemo(
        () => getCompanyColumns({ onDelete: handleDelete }),
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
