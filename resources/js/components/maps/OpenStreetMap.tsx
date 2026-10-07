import L from 'leaflet';
import { LocateFixed } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';

export type MapLocation = {
  id: number;
  lat: number;
  lng: number;
  label?: string;
  description?: string;
};

interface OpenStreetMapProps {
  locations: MapLocation[];
  selectedId?: number | null;
  hoveredId?: number | null;
  onLocationSelect?: (id: number) => void;
  onLocationHover?: (id: number | null) => void;
}

function markerIcon(isSelected: boolean, isHovered: boolean) {
  const active = isSelected || isHovered;
  return L.divIcon({
    className: 'bg-transparent',
    html: `<span class="block rounded-full border-[3px] border-white shadow-lg transition-all ${
      isSelected
        ? 'size-6 bg-primary ring-4 ring-primary/25'
        : active
          ? 'size-5 bg-primary ring-4 ring-primary/20'
          : 'size-4 bg-info'
    }"></span>`,
    iconSize: active ? [24, 24] : [16, 16],
    iconAnchor: active ? [12, 12] : [8, 8],
    popupAnchor: [0, -14],
  });
}

function MapViewport({
  locations,
  selectedId,
  fitRequest,
}: {
  locations: MapLocation[];
  selectedId?: number | null;
  fitRequest: number;
}) {
  const map = useMap();
  const selected = locations.find((location) => location.id === selectedId);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => map.invalidateSize());
    return () => window.cancelAnimationFrame(frame);
  }, [map]);

  useEffect(() => {
    if (!selected) return;
    map.flyTo([selected.lat, selected.lng], 15, { animate: true, duration: 0.6 });
  }, [map, selected]);

  useEffect(() => {
    void fitRequest;
    map.invalidateSize();
    if (locations.length === 0) {
      map.setView([23.6345, -102.5528], 5);
      return;
    }
    if (locations.length === 1) {
      map.setView([locations[0].lat, locations[0].lng], 14);
      return;
    }
    map.fitBounds(
      L.latLngBounds(locations.map((location) => [location.lat, location.lng] as [number, number])),
      { padding: [36, 36], maxZoom: 14 }
    );
  }, [fitRequest, locations, map]);

  return null;
}

/**
 * Componente base de OpenStreetMap
 * ⚠️ Este archivo NO debe importarse directamente
 * Usa siempre OpenStreetMapLazy
 */
export default function OpenStreetMap({
  locations,
  selectedId,
  hoveredId,
  onLocationSelect,
  onLocationHover,
}: OpenStreetMapProps) {
  const [fitRequest, setFitRequest] = useState(0);
  const center = useMemo<[number, number]>(
    () => (locations.length > 0 ? [locations[0].lat, locations[0].lng] : [23.6345, -102.5528]),
    [locations]
  );

  return (
    <div className="relative h-full w-full">
      <MapContainer center={center} zoom={5} scrollWheelZoom className="h-full w-full">
        <MapViewport locations={locations} selectedId={selectedId} fitRequest={fitRequest} />
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            icon={markerIcon(location.id === selectedId, location.id === hoveredId)}
            eventHandlers={{
              click: () => onLocationSelect?.(location.id),
              mouseover: () => onLocationHover?.(location.id),
              mouseout: () => onLocationHover?.(null),
            }}
            zIndexOffset={location.id === selectedId ? 1000 : location.id === hoveredId ? 500 : 0}
          >
            {location.label && (
              <Popup>
                <strong>{location.label}</strong>
                {location.description && <p>{location.description}</p>}
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
      {locations.length > 1 && (
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="absolute top-3 right-3 z-[1000] shadow-md"
          onClick={() => setFitRequest((request) => request + 1)}
          aria-label="Mostrar todas las tiendas"
          title="Mostrar todas las tiendas"
        >
          <LocateFixed />
        </Button>
      )}
      {locations.length === 0 && (
        <div className="pointer-events-none absolute inset-x-4 bottom-4 z-[1000] rounded-lg border bg-background/95 p-3 text-center text-sm text-muted-foreground shadow-sm backdrop-blur">
          No hay tiendas con coordenadas en esta página.
        </div>
      )}
    </div>
  );
}
