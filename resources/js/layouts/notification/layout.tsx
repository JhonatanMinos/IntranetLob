import { router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import type { ReactNode } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { create } from '@/routes/notifications';

interface NotificationLayoutProps {
  children: ReactNode;
}

export default function NotificationLayout({ children }: NotificationLayoutProps) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col space-y-6 px-4 py-6 sm:px-6">
      <PageHeader
        title="Avisos"
        description="Gestiona y organiza los anuncios y comunicaciones internas."
        eyebrow="Comunicación"
        actions={
          <Button onClick={() => router.get(create().url)}>
            <Plus /> Crear Aviso
          </Button>
        }
      />
      <main>{children}</main>
    </div>
  );
}
