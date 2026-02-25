import { type ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import TableGeneric from '@/components/table';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { permissions } from '@/routes/profile';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'permissions settings', href: permissions() }];

interface Permissions {
  id: string;
  name: string;
}

export default function Permissions({ permissions }: Permissions) {
  const columns: ColumnDef<Permissions>[] = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Permisos',
      accessorKey: 'name',
    },
  ];

  const table = useReactTable({
    data: permissions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <SettingsLayout>
        <TableGeneric table={table} />
      </SettingsLayout>
    </AppLayout>
  );
}
