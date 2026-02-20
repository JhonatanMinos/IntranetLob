import type { ColumnDef } from '@tanstack/react-table';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import TableGeneric from '@/components/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Role, User } from '@/types';

interface UsersTableProps {
    data: User[];
    roles: Role[];
    handleChange: (userId: string, roleId: string) => void;
}

export function TableUser({ data, roles, handleChange }: UsersTableProps) {
    const columns: ColumnDef<User>[] = [
        {
            header: 'ID',
            accessorKey: 'id',
        },
        {
            header: 'Nombre',
            accessorKey: 'name',
        },
        {
            header: 'Puesto',
            accessorKey: 'position',
        },
        {
            header: 'Correo',
            accessorKey: 'email',
        },
        {
            header: '',
            id: 'actions',
            cell: ({ row }) => {
                const currentRoleId = row.original.roles?.[0]?.id?.toString();
                return (
                    <div className="flex justify-center gap-2">
                        <Select
                            className="w-full rounded px-3 py-2"
                            defaultValue={currentRoleId} // opcional si el usuario ya tiene rol
                            onValueChange={(value) => {
                                handleChange(row.original.id, value);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((rol) => (
                                    <SelectItem
                                        key={rol.id}
                                        value={rol.id.toString()}
                                    >
                                        {rol.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
    return <TableGeneric table={table} />;
}
