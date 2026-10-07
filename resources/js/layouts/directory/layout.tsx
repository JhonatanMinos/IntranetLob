import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import { FormStore } from '@/pages/directory/form-store';
import { FormUser } from '@/pages/directory/form-user';
import { index as shops } from '@/routes/shops';
import { corpo, index as users } from '@/routes/users';
import type { NavItem, SimpleModel, Store } from '@/types';

const barNavItems: NavItem[] = [
  {
    title: 'Vendedores',
    href: users().url,
    icon: null,
    can: '',
  },
  {
    title: 'Corporativo LOB',
    href: corpo().url,
    icon: null,
    can: '',
  },
  {
    title: 'Tiendas',
    href: shops().url,
    icon: null,
    can: '',
  },
];

interface DirectoryLayoutProps {
  children: ReactNode;
  aside?: ReactNode;
  pagination?: ReactNode;
  departments?: SimpleModel[];
  stores?: Store[];
  company?: SimpleModel[];
  can: {
    create: boolean;
  };
}

export default function DirectoryLayout({
  children,
  aside,
  pagination,
  departments,
  stores,
  company,
  can,
}: DirectoryLayoutProps) {
  const { isCurrentUrl } = useCurrentUrl();
  const activeItem = barNavItems.find((item) => isCurrentUrl(item.href));
  const [open, setOpen] = useState(false);

  if (typeof window === 'undefined') return null;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-6 sm:px-6">
      <PageHeader
        title="Directorio"
        description="Encuentra colaboradores, áreas y tiendas de la organización."
        eyebrow="Personas"
        actions={
          can.create ? (
            <Button className="shrink-0" onClick={() => setOpen(true)}>
              <Plus />
              {activeItem?.title === 'Vendedores' || activeItem?.title === 'Corporativo LOB'
                ? 'Agregar usuario'
                : 'Agregar tienda'}
            </Button>
          ) : undefined
        }
      >
        <nav className="mt-4 overflow-x-auto" aria-label="Secciones del directorio">
          <div className="inline-flex gap-1 rounded-lg bg-muted p-1">
            {barNavItems.map((barNavItem) => {
              const active = isCurrentUrl(barNavItem.href);
              return (
                <Link
                  key={barNavItem.title}
                  href={barNavItem.href}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                    active
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {barNavItem.title}
                </Link>
              );
            })}
          </div>
        </nav>
      </PageHeader>

      <div
        className={cn(
          'min-h-0 w-full pt-5',
          aside
            ? 'grid grid-cols-1 gap-6 lg:h-[calc(100dvh-13rem)] lg:grid-cols-[minmax(20rem,1fr)_minmax(0,2fr)] lg:overflow-hidden'
            : 'mx-auto flex w-full max-w-5xl flex-col'
        )}
      >
        {/* MAIN */}
        <main className="flex min-h-0 flex-col lg:h-full lg:overflow-hidden">
          <div className="min-h-0 flex-1 lg:overflow-y-auto lg:pr-2">{children}</div>

          {pagination && <div className="sticky bottom-0 bg-background py-2">{pagination}</div>}
        </main>
        {/* ASIDE */}
        {aside && (
          <aside className="z-10 min-h-0 border-l pl-4 lg:sticky lg:top-0 lg:h-full lg:overflow-hidden">
            {aside}
          </aside>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              {activeItem?.title === 'Vendedores' || activeItem?.title === 'Corporativo LOB'
                ? 'Nuevo Usuario'
                : 'Nueva Tienda'}
            </DialogTitle>
          </DialogHeader>
          {(activeItem?.title === 'Vendedores' || activeItem?.title === 'Corporativo LOB') && (
            <FormUser
              departments={departments ?? []}
              stores={stores ?? []}
              company={company ?? []}
            />
          )}
          {activeItem?.title === 'Tiendas' && <FormStore onSuccess={() => setOpen(false)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
