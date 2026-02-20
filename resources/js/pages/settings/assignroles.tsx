import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { TableUser } from '@/pages/settings/table-user';
import { assign } from '@/routes/profile';
import { assign as assignRol } from '@/routes/users';
import type { BreadcrumbItem, Role, User } from '@/types';
import PaginationGeneric from '@/components/pagination';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Assign settings',
        href: assign(),
    },
];

export interface AssignRolesProps {
    users: User[];
    roles: Role[];
}

export default function AssignRoles({ users, roles }: AssignRolesProps) {
    console.log(users);
    const handleRoleChange = async (userId: string, roleId: string) => {
        try {
            router.put(
                assignRol({ user: userId }).url,
                { role_id: Number(roleId) },
                {
                    onSuccess: () => {
                        toast.success('Rol asignado correctamente', {
                            position: 'bottom-right',
                        });
                    },
                    onError: () => {
                        toast.error('Error al asignar rol ', {
                            position: 'bottom-right',
                        });
                    },
                },
            );
        } catch (error) {
            console.error('Error actualizando rol', error);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <SettingsLayout>
                <TableUser
                    data={users.data}
                    roles={roles}
                    handleChange={handleRoleChange}
                />
                <PaginationGeneric links={users.links} />
            </SettingsLayout>
        </AppLayout>
    );
}
