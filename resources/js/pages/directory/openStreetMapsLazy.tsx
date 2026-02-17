import { lazy, Suspense } from 'react';

const OpenStreetMap = lazy(() => import('../../components/maps/OpenStreetMap'));
type Location = {
    lat: number;
    lng: number;
    label?: string;
};

interface OpenStreetMapLazyProps {
    locations: Location[];
}

export function OpenStreetMapLazy({ locations }: OpenStreetMapLazyProps) {
    return (
        <Suspense
            fallback={
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    Cargando mapp...
                </div>
            }
        >
            <OpenStreetMap locations={locations} />
        </Suspense>
    );
}
