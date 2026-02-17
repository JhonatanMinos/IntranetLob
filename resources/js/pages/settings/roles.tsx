import type { ColumnDef } from '@tanstack/react-table';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Building2, Shield, User } from 'lucide-react';
import TableGeneric from '@/components/table';
import { Toggle } from '@/components/ui/toggle';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { roles } from '@/routes/profile';
import type { BreadcrumbItem, Role } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Roles settings', href: roles() }];

interface permission {
  id: string;
  name: string;
}

interface RolesProps {
  roles: Role[];
  permissions: permission[];
}

export default function Roles({ roles }: RolesProps) {
  const data = roles;
  const columns: ColumnDef<Role>[] = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Nombre del rol',
      accessorKey: 'name',
      cell: ({ row }) => {
        const icon =
          row.original.name === 'sa' ? (
            <Shield className="h-4 w-4 text-red-500" />
          ) : row.original.name === 'rh' ? (
            <Building2 className="h-4 w-4 text-blue-500" />
          ) : (
            <User className="h-4 w-4 text-gray-500" />
          );
        return (
          <Toggle aria-label="Toggle bookmark" size="sm" variant="outline">
            {icon}
            <span className="capitalize">{row.original.name}</span>
          </Toggle>
        );
      },
    },
    {
      header: 'Acciones',
      id: 'actions',
    },
  ];

  const table = useReactTable({
    data,
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
