import { Head } from '@inertiajs/react';
import {
    Mail,
    MapPin,
    Pencil,
    Phone,
    Store as StoreIcon,
    Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import DirectoryLayout from '@/layouts/directory/layout';
import { OpenStreetMapLazy } from '@/pages/directory/openStreetMapsLazy';
import { index as shops } from '@/routes/shops';
import type { BreadcrumbItem, PaginationLink, Store } from '@/types';
import PaginationGeneric from '@/components/pagination';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';

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

interface ShopsDirectoryProps {
    data: PaginatedResponse<Store>;
    can: {
        create: boolean;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Directorio', href: '/directory' },
    {
        title: 'Tiendas',
        href: shops().url,
    },
];

export default function ShopsDirectory({ data, can }: ShopsDirectoryProps) {
    console.log(data);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tiendas" />
            <DirectoryLayout
                aside={
                    <Card className="h-[965px] overflow-hidden">
                        <CardHeader>
                            <CardTitle>Maps</CardTitle>
                        </CardHeader>
                        <div className="h-full">
                            {
                                <OpenStreetMapLazy
                                    locations={data?.data
                                        ?.filter(
                                            (store) =>
                                                store.lat != null &&
                                                store.lng != null,
                                        )
                                        .map((store) => ({
                                            lat: store.lat!,
                                            lng: store.lng!,
                                            label: `${store.name} · ${store.neighborhood}`,
                                        }))}
                                />
                            }
                        </div>
                    </Card>
                }
                pagination={<PaginationGeneric links={data.meta.links} />}
                can={can}
            >
                {data?.data?.map((shop) => (
                    <Card key={shop.id} className="m-2 p-6">
                        <div className="flex items-center gap-6">
                            <Avatar className="h-16 w-16 items-center justify-center rounded-full bg-muted">
                                <AvatarFallback>
                                    <StoreIcon />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-1 flex-col justify-between">
                                <CardHeader className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-500 dark:text-white">
                                            {shop.code} - {shop.name}
                                        </CardTitle>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge>{shop.brandName}</Badge>
                                        <Button variant="ghost">
                                            <Pencil />
                                        </Button>
                                        {shop.can.delete && (
                                            <Button variant="ghost">
                                                <Trash2 />
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-row items-center justify-center gap-2">
                                        <MapPin /> {shop.address},
                                        {shop.neighborhood},{shop.state}
                                    </div>
                                    <div className="flex flex-row items-center justify-between gap-1">
                                        <span className="flex items-center gap-2">
                                            <Phone className="h-4 w-4" />
                                            {shop.phone}
                                        </span>

                                        <span className="flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            {shop.email}
                                        </span>
                                    </div>
                                </CardContent>
                            </div>
                        </div>
                    </Card>
                ))}
            </DirectoryLayout>
        </AppLayout>
    );
}
