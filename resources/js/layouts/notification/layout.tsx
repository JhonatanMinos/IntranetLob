import { router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { create } from '@/routes/notifications';
import { ReactNode } from 'react';

interface NotificationLayoutProps {
    children: ReactNode;
}

export default function NotificationLayout({
    children,
}: NotificationLayoutProps) {
    return (
        <div className="flex h-full flex-col space-y-6 px-3 py-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                        Listado de Avisos
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        Gestiona y organiza todos los anuncios y notificaciones
                        del sistema de forma centralizada.
                    </p>
                </div>
                <Button onClick={() => router.get(create().url)}>
                    <Plus /> Crear Aviso
                </Button>
            </div>
            <main>{children}</main>
        </div>
    );
}
