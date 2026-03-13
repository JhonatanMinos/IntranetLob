import PaginationGeneric from '@/components/pagination';
import AppLayout from '@/layouts/app-layout';
import DirectoryLayout from '@/layouts/directory/layout';
import { corpo } from '@/routes/users';
import type {
    BreadcrumbItem,
    PaginatedResponse,
    SimpleModel,
    Store,
    User,
} from '@/types';
import { Head, usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

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
                <div className="grid grid-cols-1 gap-4 p-5"></div>
            </DirectoryLayout>
        </AppLayout>
    );
}
