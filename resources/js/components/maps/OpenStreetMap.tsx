import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * FIX de íconos de Leaflet (obligatorio en Vite)
 * Esto se ejecuta una sola vez
 */
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

type Location = {
  lat: number;
  lng: number;
  label?: string;
};

/**
 * Componente base de OpenStreetMap
 * ⚠️ Este archivo NO debe importarse directamente
 * Usa siempre OpenStreetMapLazy
 */
export default function OpenStreetMap({ locations }: { locations: Location[] }) {
  const center: [number, number] =
    locations.length > 0 ? [locations[0].lat, locations[0].lng] : [0, 0];

  return (
    <MapContainer center={center} zoom={5} scrollWheelZoom={false} className="h-full w-full">
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((loc, i) => (
        <Marker key={i} position={[loc.lat, loc.lng]}>
          {loc.label && <Popup>{loc.label}</Popup>}
        </Marker>
      ))}{' '}
    </MapContainer>
  );
}
