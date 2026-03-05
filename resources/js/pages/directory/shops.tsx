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
import type { BreadcrumbItem, PaginatedResponse, Store } from '@/types';
import PaginationGeneric from '@/components/pagination';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { stores } from '@/lib/stores';

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

function ShopAvatar() {
    return (
        <Avatar className="h-16 w-16 items-center justify-center rounded-full bg-muted">
            <AvatarFallback>
                <StoreIcon />
            </AvatarFallback>
        </Avatar>
    );
}

function ShopAction({ shop }: { shop: Store }) {
    return (
        <div className="flex items-center gap-2">
            <Badge>{shop.brandName}</Badge>
            {shop.can.update && (
                <Button variant="ghost">
                    <Pencil />
                </Button>
            )}
            {shop.can.delete && (
                <Button variant="ghost">
                    <Trash2 />
                </Button>
            )}
        </div>
    );
}

function ShopCard({ shop }: { shop: Store }) {
    return (
        <Card key={shop.id} className="m-2 p-6">
            <div className="flex items-center gap-6">
                <ShopAvatar />
                <div className="flex flex-1 flex-col justify-between">
                    <CardHeader className="flex items-start justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-500 dark:text-white">
                                {shop.code} - {shop.name}
                            </CardTitle>
                            <ShopAction shop={shop} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-row items-center justify-start gap-2">
                            <MapPin /> {shop.address},{shop.neighborhood},
                            {shop.state}
                        </div>
                        <div className="flex flex-row items-center justify-around gap-1">
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
    );
}

function ShopsMap({ stores }: { stores: Store[] }) {
    const locations = stores
        .filter((s) => s.lat != null && s.lng != null)
        .map((s) => ({
            lat: s.lat!,
            lng: s.lng!,
            label: `${s.name} · ${s.neighborhood}`,
        }));

    return (
        <Card className="h-[calc(100vh-140px)] overflow-hidden">
            <div className="h-full">
                <OpenStreetMapLazy locations={locations} />
            </div>
        </Card>
    );
}

export default function ShopsDirectory({ data, can }: ShopsDirectoryProps) {
    const stores = data?.data ?? [];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tiendas" />
            <DirectoryLayout
                aside={<ShopsMap stores={stores} />}
                pagination={
                    <PaginationGeneric meta={data.meta} links={data.links} />
                }
                can={can}
            >
                {data?.data?.map((shop) => (
                    <ShopCard key={shop.id} shop={shop} />
                ))}
            </DirectoryLayout>
        </AppLayout>
    );
}
