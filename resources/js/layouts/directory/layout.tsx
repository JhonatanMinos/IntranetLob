import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import { FormUser } from '@/pages/directory/form-user';
import { index as shops } from '@/routes/shops';
import { index as users } from '@/routes/users';
import type { NavItem, SimpleModel, Store } from '@/types';

const barNavItems: NavItem[] = [
  {
    title: 'Usuarios',
    href: users().url,
    icon: null,
  },
  {
    title: 'Tiendas',
    href: shops().url,
    icon: null,
  },
];

interface DirectoryLayoutProps {
  children: ReactNode;
  aside?: ReactNode;
  departments?: SimpleModel[];
  stores?: Store[];
  company?: SimpleModel[];
}

export default function DirectoryLayout({
  children,
  aside,
  departments,
  stores,
  company,
}: DirectoryLayoutProps) {
  const { isCurrentUrl } = useCurrentUrl();
  const activeItem = barNavItems.find((item) => isCurrentUrl(item.href));
  const [open, setOpen] = useState(false);

  if (typeof window === 'undefined') return null;

  return (
    <div className="flex h-full flex-col space-y-6 px-4 py-6">
      <div className="border-b">
        <nav className="-mb-px flex justify-between gap-6">
          <div>
            {barNavItems.map((barNavItem) => {
              const active = isCurrentUrl(barNavItem.href);
              return (
                <Link
                  key={barNavItem.href}
                  href={barNavItem.href}
                  className={cn(
                    'border-b-2 px-1 pb-2 text-sm font-medium whitespace-nowrap transition-colors',
                    active
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:border-muted hover:text-foreground'
                  )}
                >
                  {barNavItem.title}
                </Link>
              );
            })}
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="shrink-0 bg-blue-50 text-blue-700 hover:bg-blue-500 hover:text-blue-100 dark:bg-blue-950 dark:text-blue-300"
                onClick={() => setOpen(true)}
              >
                <Plus />
                {activeItem?.title === 'Usuarios' ? 'Agregar usuario' : 'Agregar tienda'}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {activeItem?.title === 'Usuarios' ? 'Nuevo Usuario' : 'Nueva Tienda'}
            </TooltipContent>
          </Tooltip>
        </nav>
      </div>

      <div
        className={cn(
          'w-full flex-1 overflow-auto',
          aside ? 'grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]' : 'mx-auto w-full max-w-5xl'
        )}
      >
        <main>{children}</main>
        {aside && <aside>{aside}</aside>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              {activeItem?.title === 'Usuarios' ? 'Nuevo Usuario' : 'Nueva Tienda'}
            </DialogTitle>
          </DialogHeader>
          {activeItem?.title === 'Usuarios' && (
            <FormUser departments={departments} stores={stores} company={company} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
