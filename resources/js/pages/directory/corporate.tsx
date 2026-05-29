import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import PaginationGeneric from '@/components/pagination';
import { useDeleteUser } from '@/hooks/use-delete-user';
import AppLayout from '@/layouts/app-layout';
import DirectoryLayout from '@/layouts/directory/layout';
import { corpo } from '@/routes/users';
import type {
    BreadcrumbItem,
    PaginatedResponse,
    SharedData,
    SimpleModel,
    Store,
    User,
} from '@/types';
import { EditUserDialog } from './components/edit-user-dialog';
import { UserCard } from './components/user-card';

interface UsersDirectoryProps extends SharedData {
    data: PaginatedResponse<User>;
    departments: SimpleModel[];
    stores: Store[];
    company: SimpleModel[];
    can: {
        create: boolean;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Directorio', href: '/directory' },
    { title: 'Corporativo', href: corpo().url },
];

export default function Corporate() {
    const { data, departments, stores, company, can } =
        usePage<UsersDirectoryProps>().props;
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const handleDelete = useDeleteUser();

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedUser(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Corporativo" />
            <DirectoryLayout
                departments={departments}
                stores={stores}
                company={company}
                pagination={
                    <PaginationGeneric meta={data.meta} links={data.links} />
                }
                can={can}
            >
                <div className="grid grid-cols-1 gap-4 p-5">
                    {data.data.map((corporate) => (
                        <UserCard
                            key={corporate.id}
                            user={corporate}
                            onEdit={handleEdit}
                            onDelete={() => handleDelete(corporate.id)}
                        />
                    ))}
                </div>
            </DirectoryLayout>
            <EditUserDialog
                user={selectedUser}
                open={open}
                onClose={handleClose}
                departments={departments}
                stores={stores}
                company={company}
            />
        </AppLayout>
    );
}
