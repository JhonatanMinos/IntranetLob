import { Head } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import AppLayout from '@/layouts/app-layout';
import DirectoryLayout from '@/layouts/directory/layout';
import { OpenStreetMapLazy } from '@/pages/directory/openStreetMapsLazy';
import { index as shops } from '@/routes/shops';

interface Shop {
  id: number;
  name: string;
  brand: array;
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
  shops: Shop[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Directorio', href: '/directory' },
  {
    title: 'Tiendas',
    href: shops().url,
  },
];

export default function ShopsDirectory({ shops }: ShopsDirectoryProps) {
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
                  locations={shops?.map((store) => ({
                    lat: store.lat,
                    lng: store.lng,
                    label: `${store.name} · ${store.neighborhood}`,
                  }))}
                />
              }
            </div>
          </Card>
        }
      >
        <ScrollArea className="h-[905px]">
          {shops?.map(({ id, name, code, address, neighborhood, state, phone, email, brand }) => (
            <Card key={id} className="m-2">
              <CardHeader className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-0.5">
                    <CardTitle>
                      {code} - {name}
                    </CardTitle>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>{brand?.name}</Badge>
                  <Button variant="ghost">
                    <Trash2 />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div>
                  {address}, {neighborhood}, {state}
                </div>
                <div>
                  {phone}, {email}
                </div>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </DirectoryLayout>
    </AppLayout>
  );
}
