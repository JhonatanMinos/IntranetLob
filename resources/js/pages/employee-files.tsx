import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PaginatedResponse, User } from '@/types';
import { Head, router } from '@inertiajs/react';
import { index as files, show } from '@/routes/employeeFiles';
import EmployeeFilesLayout from '@/layouts/employeeFiles/layout';
import TableGeneric from '@/components/table';
import PaginationGeneric from '@/components/pagination';
import { useMemo } from 'react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { getEmployeeColumns } from './EmployeeFiles/columns-employee';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Expedientes',
        href: files().url,
    },
];

export interface Document {
    path: string | null;
    status: DocumentStatus;
    note: string | null;
}

export interface EmployeeFileItem {
    id: number;
    emergency_contact_name: string | null;
    emergency_contact_phone: string | null;
    documents: Record<string, Document>;
    user: User;
}

interface EmployeeProps {
    data: PaginatedResponse<EmployeeFileItem>;
}

export default function EmployeeFiles({ data }: EmployeeProps) {
    const handleEdit = (employeeFiles: EmployeeFileItem) => {
        router.get(show(employeeFiles.id).url);
    };

    const columns = useMemo(
        () =>
            getEmployeeColumns({
                onEdit: handleEdit,
            }),
        [handleEdit],
    );

    const table = useReactTable({
        data: data.data ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Expedientes" />
            <EmployeeFilesLayout>
                <TableGeneric table={table} />
                <PaginationGeneric links={data.links} meta={data.meta} />
            </EmployeeFilesLayout>
        </AppLayout>
    );
}
