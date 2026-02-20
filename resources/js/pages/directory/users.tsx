import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import DirectoryLayout from '@/layouts/directory/layout';
import { index as users } from '@/routes/users';
import type { BreadcrumbItem, SimpleModel, Store, User } from '@/types';
import PaginationGeneric from '@/components/pagination';
import { UserCard } from './components/user-card';
import { useDeleteUser } from '@/hooks/use-delete-user';
import { EditUserDialog } from './components/edit-user-dialog';

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: PaginationLink[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: PaginationLink[]; // Laravel suele duplicar los links aquí en meta
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

interface UsersDirectoryProps {
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
  { title: 'Usuarios', href: users().url },
];

export default function Users({ data, departments, stores, company, can }: UsersDirectoryProps) {
  console.log(can);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const handleDelete = useDeleteUser();

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null); // limpiamos selección al cerrar
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Usuarios" />
      <DirectoryLayout
        departments={departments}
        stores={stores}
        company={company}
        pagination={<PaginationGeneric links={data.meta.links} />}
        can={can}
      >
        <div className="grid grid-cols-1 gap-4 p-5">
          {data.data.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={handleEdit}
              onDelete={() => handleDelete(user.id)}
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
