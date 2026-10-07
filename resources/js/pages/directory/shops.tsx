import { Head } from '@inertiajs/react';
import { AvatarFallback } from '@radix-ui/react-avatar';
import {
  Mail,
  Map as MapIcon,
  MapPin,
  Pencil,
  Phone,
  Store as StoreIcon,
  Trash2,
} from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import PaginationGeneric from '@/components/pagination';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import AppLayout from '@/layouts/app-layout';
import DirectoryLayout from '@/layouts/directory/layout';
import { cn } from '@/lib/utils';
import { OpenStreetMapLazy } from '@/pages/directory/openStreetMapsLazy';
import { index as shops } from '@/routes/shops';
import type { BreadcrumbItem, PaginatedResponse, Store } from '@/types';

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
        <Button variant="ghost" size="icon" aria-label={`Editar ${shop.name}`}>
          <Pencil />
        </Button>
      )}
      {shop.can.delete && (
        <Button variant="ghost" size="icon" aria-label={`Eliminar ${shop.name}`}>
          <Trash2 />
        </Button>
      )}
    </div>
  );
}

interface ShopCardProps {
  shop: Store;
  active: boolean;
  highlighted: boolean;
  cardRef: (element: HTMLDivElement | null) => void;
  onHighlight: (id: number | null) => void;
  onShowMap: (id: number) => void;
}

function ShopCard({ shop, active, highlighted, cardRef, onHighlight, onShowMap }: ShopCardProps) {
  const hasLocation = shop.lat != null && shop.lng != null;
  return (
    <Card
      ref={cardRef}
      className={cn(
        'm-2 p-4 transition-[border-color,box-shadow,background-color] sm:p-6',
        active && 'border-primary bg-primary/5 ring-2 ring-primary/20',
        highlighted && !active && 'border-primary/60 bg-accent/50'
      )}
      onMouseEnter={() => onHighlight(shop.id)}
      onMouseLeave={() => onHighlight(null)}
      onFocusCapture={() => onHighlight(shop.id)}
      onBlurCapture={() => onHighlight(null)}
    >
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
        <ShopAvatar />
        <div className="flex flex-1 flex-col justify-between">
          <CardHeader className="p-0">
            <div>
              <CardTitle className="flex flex-wrap items-center gap-3 text-xl font-semibold text-foreground">
                {shop.code} - {shop.name}
              </CardTitle>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <ShopAction shop={shop} />
                {hasLocation ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => onShowMap(shop.id)}
                  >
                    <MapPin /> Ver en mapa
                  </Button>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    Sin ubicación
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="mt-4 space-y-3 p-0 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <MapPin className="size-4 shrink-0" />
              <span>
                {shop.address}, {shop.neighborhood}, {shop.city}, {shop.state}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {shop.phone ? (
                  <a href={`tel:${shop.phone}`} className="hover:underline">
                    {shop.phone}
                  </a>
                ) : (
                  'Sin teléfono'
                )}
              </span>

              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {shop.email ? (
                  <a href={`mailto:${shop.email}`} className="truncate hover:underline">
                    {shop.email}
                  </a>
                ) : (
                  'Sin correo'
                )}
              </span>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}

interface ShopsMapProps {
  locations: Array<{
    id: number;
    lat: number;
    lng: number;
    label: string;
    description: string;
  }>;
  selectedId: number | null;
  hoveredId: number | null;
  onSelect: (id: number) => void;
  onHover: (id: number | null) => void;
  className?: string;
}

function ShopsMap({
  locations,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
  className,
}: ShopsMapProps) {
  return (
    <Card className={cn('h-[28rem] overflow-hidden p-0 lg:h-full', className)}>
      <div className="h-full">
        <OpenStreetMapLazy
          locations={locations}
          selectedId={selectedId}
          hoveredId={hoveredId}
          onLocationSelect={onSelect}
          onLocationHover={onHover}
        />
      </div>
    </Card>
  );
}

export default function ShopsDirectory({ data, can }: ShopsDirectoryProps) {
  const stores = data?.data ?? [];
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const [hoveredStoreId, setHoveredStoreId] = useState<number | null>(null);
  const [mobileMapOpen, setMobileMapOpen] = useState(false);
  const cardRefs = useRef(new globalThis.Map<number, HTMLDivElement>());
  const locations = useMemo(
    () =>
      stores
        .filter((store) => store.lat != null && store.lng != null)
        .map((store) => ({
          id: store.id,
          lat: store.lat!,
          lng: store.lng!,
          label: `${store.code} · ${store.name}`,
          description: `${store.address}, ${store.neighborhood}, ${store.city}`,
        })),
    [stores]
  );

  const handleMarkerSelect = (id: number) => {
    setSelectedStoreId(id);
    setMobileMapOpen(false);
    window.setTimeout(() => {
      cardRefs.current.get(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  };

  const handleShowMap = (id: number) => {
    setSelectedStoreId(id);
    if (window.matchMedia('(max-width: 1023px)').matches) setMobileMapOpen(true);
  };

  const map = (
    <ShopsMap
      locations={locations}
      selectedId={selectedStoreId}
      hoveredId={hoveredStoreId}
      onSelect={handleMarkerSelect}
      onHover={setHoveredStoreId}
    />
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tiendas" />
      <DirectoryLayout
        aside={map}
        pagination={<PaginationGeneric meta={data.meta} links={data.links} />}
        can={can}
      >
        <div className="sticky top-0 z-20 bg-background/95 p-2 backdrop-blur lg:hidden">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setMobileMapOpen(true)}
            disabled={locations.length === 0}
          >
            <MapIcon /> Ver mapa · {locations.length}{' '}
            {locations.length === 1 ? 'tienda' : 'tiendas'}
          </Button>
        </div>
        {stores.map((shop) => (
          <ShopCard
            key={shop.id}
            shop={shop}
            active={selectedStoreId === shop.id}
            highlighted={hoveredStoreId === shop.id}
            cardRef={(element) => {
              if (element) cardRefs.current.set(shop.id, element);
              else cardRefs.current.delete(shop.id);
            }}
            onHighlight={setHoveredStoreId}
            onShowMap={handleShowMap}
          />
        ))}
        <Sheet open={mobileMapOpen} onOpenChange={setMobileMapOpen}>
          <SheetContent side="bottom" className="h-[92dvh] gap-0 rounded-t-xl p-0">
            <SheetHeader>
              <SheetTitle>Mapa de tiendas</SheetTitle>
              <SheetDescription>
                Selecciona un marcador para volver a la tienda correspondiente.
              </SheetDescription>
            </SheetHeader>
            <div className="min-h-0 flex-1 px-4 pb-4">
              <ShopsMap
                locations={locations}
                selectedId={selectedStoreId}
                hoveredId={hoveredStoreId}
                onSelect={handleMarkerSelect}
                onHover={setHoveredStoreId}
                className="h-full"
              />
            </div>
          </SheetContent>
        </Sheet>
      </DirectoryLayout>
    </AppLayout>
  );
}
