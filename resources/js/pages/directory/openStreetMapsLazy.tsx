import { lazy, Suspense } from 'react';
import type { MapLocation } from '../../components/maps/OpenStreetMap';

const OpenStreetMap = lazy(() => import('../../components/maps/OpenStreetMap'));
interface OpenStreetMapLazyProps {
  locations: MapLocation[];
  selectedId?: number | null;
  hoveredId?: number | null;
  onLocationSelect?: (id: number) => void;
  onLocationHover?: (id: number | null) => void;
}

export function OpenStreetMapLazy(props: OpenStreetMapLazyProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Cargando mapa…
        </div>
      }
    >
      <OpenStreetMap {...props} />
    </Suspense>
  );
}
