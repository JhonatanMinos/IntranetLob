import { Head } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import DirectoryLayout from '@/layouts/directory/layout';
import { OpenStreetMapLazy } from '@/pages/directory/openStreetMapsLazy';
import { index as shops } from '@/routes/shops';
import type { BreadcrumbItem } from '@/types';

interface Shop {
  id: number;
  name: string;
  brandName: string;
  code: string;
  type: string;
  address: string;
  neighborhood: string;
  city: string;
  postal_code: string;
  state: string;
  phone: string;
  email: string;
  lat?: number;
  lng?: number;
}

interface ShopsDirectoryProps {
  data: Shop[];
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
  console.log(data?.data);
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
                  locations={data?.data?.map((store) => ({
                    lat: store.lat,
                    lng: store.lng,
                    label: `${store.name} · ${store.neighborhood}`,
                  }))}
                />
              }
            </div>
          </Card>
        }
        can={can}
      >
        {data?.data?.map((shop) => (
          <Card key={shop.id} className="m-2">
            <CardHeader className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-0.5">
                  <CardTitle>
                    {shop.code} - {shop.name}
                  </CardTitle>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge>{shop.brandName}</Badge>
                {shop.can.delete && (
                  <Button variant="ghost">
                    <Trash2 />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div>
                {shop.address}, {shop.neighborhood}, {shop.state}
              </div>
              <div>
                {shop.phone}, {shop.email}
              </div>
            </CardContent>
          </Card>
        ))}
      </DirectoryLayout>
    </AppLayout>
  );
}
