import type { PageProps } from '@inertiajs/core';
import { Head, usePage } from '@inertiajs/react';
import { getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import { useCallback, useMemo } from 'react';
import Heading from '@/components/heading';
import TableGeneric from '@/components/table';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { download } from '@/routes/payroll';
import { payroll } from '@/routes/profile';
import type { BreadcrumbItem, PaginatedResponse } from '@/types';
import { getPayrollColumns } from './components/columns-payroll';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Nóminas',
    href: payroll().url,
  },
];

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

// Corregimos la interfaz para que TS no se queje en usePage
interface PayrollsProps extends PageProps {
  payrolls: PaginatedResponse<PayrollUser>;
}

export default function Payroll() {
  const { payrolls } = usePage<PayrollsProps>().props;

  const handleDownload = useCallback((item: PayrollUser) => {
    const url = download.url(item.id);
    window.open(url, '_blank');
  }, []);

  const columns = useMemo(
    () => getPayrollColumns({ onDownload: handleDownload }),
    [handleDownload]
  );

  const table = useReactTable({
    data: payrolls.data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Nóminas" />
      <h1 className="sr-only">Configuración de nóminas</h1>
      <SettingsLayout>
        <div className="space-y-6">
          <Heading
            variant="small"
            title="Información de nóminas"
            description="Consulta y descarga los recibos de nómina."
          />
          <TableGeneric table={table} />
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
