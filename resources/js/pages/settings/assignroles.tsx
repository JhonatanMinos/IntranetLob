import { Head, router } from '@inertiajs/react';
import { toast } from 'sonner';
import PaginationGeneric from '@/components/pagination';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { TableUser } from '@/pages/settings/table-user';
import { assign } from '@/routes/profile';
import { assign as assignRol } from '@/routes/users';
import type { BreadcrumbItem, PaginatedResponse, Role, User } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Assign settings',
        href: assign().url,
    },
];

export interface AssignRolesProps {
    data: PaginatedResponse<User>;
    roles: Role[];
}

export default function AssignRoles({ data, roles }: AssignRolesProps) {
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
                {
                    preserveState: true,
                    preserveScroll: true,
                },
            );
        } catch (error) {
            console.error('Error actualizando rol', error);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <SettingsLayout>
                <TableUser
                    data={data.data}
                    roles={roles}
                    handleChange={handleRoleChange}
                />
                <div className="sticky bottom-0 bg-background py-2">
                    <PaginationGeneric links={data.links} meta={data.meta} />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
