import { Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import { index as company, store as storeCompany } from '@/routes/company';
import { index as department, store as storeDepartment } from '@/routes/departament';
import { index as payroll } from '@/routes/payroll';
import type { NavItem } from '@/types';

const barNavItems: NavItem[] = [
  {
    title: 'Departamentos',
    href: department().url,
    icon: null,
    can: '',
  },
  {
    title: 'Compañías',
    href: company().url,
    icon: null,
    can: '',
  },
  {
    title: 'Nóminas',
    href: payroll().url,
    icon: null,
    can: '',
  },
];

const itemConfig: Record<string, { title: string; label: string; placeholder: string }> = {
  Departamentos: {
    title: 'Agregar departamento',
    label: 'Nombre del departamento',
    placeholder: 'Ej. Recursos Humanos',
  },
  Compañías: {
    title: 'Agregar empresa',
    label: 'Nombre de la empresa',
    placeholder: 'Ej. LOB',
  },
  Nóminas: {
    title: 'Subir nómina',
    label: '',
    placeholder: '',
  },
};

interface RrhhLayoutProps {
  children: ReactNode;
}

export default function RrhhLayout({ children }: RrhhLayoutProps) {
  const { isCurrentUrl } = useCurrentUrl();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const activeItem = barNavItems.find((item) => isCurrentUrl(item.href));
  const config = activeItem ? itemConfig[activeItem.title] : null;
  const isPayRoll = activeItem?.title === 'Nóminas';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !activeItem) return;

    // Bug 2: typo 'Departamentos"' (comilla extra) en el switch original
    switch (activeItem.title) {
      case 'Departamentos':
        router.post(
          storeDepartment().url,
          { name },
          {
            onSuccess: () => {
              setName('');
              setOpen(false);
              router.reload({ only: ['data'] });
            },
          }
        );
        return; // evitamos el setOpen/setName de abajo en el caso async
      case 'Compañías':
        router.post(
          storeCompany().url,
          { name },
          {
            onSuccess: () => {
              setName('');
              setOpen(false);
              router.reload({ only: ['data'] });
            },
          }
        );
        return;
    }
    setName('');
    setOpen(false);
  };

  // Limpiar el input al abrir
  useEffect(() => {
    if (open) setName('');
  }, [open]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col space-y-6 px-4 py-6 sm:px-6">
      <PageHeader
        title="Capital Humano"
        description="Administra departamentos, compañías y nóminas del personal."
        eyebrow="Personas"
        actions={
          !isPayRoll ? (
            <Button className="shrink-0" onClick={() => setOpen(true)}>
              <Plus size={16} />
              {config?.title ?? 'Agregar'}
            </Button>
          ) : undefined
        }
      >
        <nav className="mt-4 overflow-x-auto" aria-label="Secciones de Capital Humano">
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
      <main>{children}</main>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{config?.title}</DialogTitle>
            <DialogDescription>Ingresa el nombre para continuar.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{config?.label} </Label>
              <Input
                id="name"
                name="name"
                placeholder={config?.placeholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={!name.trim()}>
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
