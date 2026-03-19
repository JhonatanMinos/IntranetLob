import { NavItem } from '@/types';
import {
    index as department,
    store as storeDepartment,
} from '@/routes/departament';
import { index as company, store as storeCompany } from '@/routes/company';
import { ReactNode, useEffect, useState } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { Link, router } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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

const barNavItems: NavItem[] = [
    {
        title: 'Departamentos',
        href: department().url,
        icon: null,
        can: '',
    },
    {
        title: 'Companias',
        href: company().url,
        icon: null,
        can: '',
    },
];

const itemConfig: Record<
    string,
    { title: string; label: string; placeholder: string }
> = {
    Departamentos: {
        title: 'Agregar departamento',
        label: 'Nombre del departamento',
        placeholder: 'Ej. Recursos Humanos',
    },
    Companias: {
        title: 'Agregar empresa',
        label: 'Nombre de la empresa',
        placeholder: 'Ej. LOB',
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
                    },
                );
                return; // evitamos el setOpen/setName de abajo en el caso async
            case 'Companias':
                router.post(
                    storeCompany().url,
                    { name },
                    {
                        onSuccess: () => {
                            setName('');
                            setOpen(false);
                            router.reload({ only: ['data'] });
                        },
                    },
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
        <div className="flex h-full flex-col space-y-6 overflow-y-auto px-3 py-5">
            <div className="md:items-between flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                        Capital Humano
                    </h2>
                    <nav className="flex justify-between gap-4">
                        <div className="flex gap-2 rounded-xl bg-muted p-1">
                            {barNavItems.map((barNavItem) => {
                                const active = isCurrentUrl(barNavItem.href);
                                return (
                                    <Link
                                        key={barNavItem.href}
                                        href={barNavItem.href}
                                        className={cn(
                                            'rounded-md border p-1 text-sm font-medium whitespace-nowrap transition-colors',
                                            active
                                                ? 'border-ring text-primary'
                                                : 'border-transparent text-muted-foreground hover:border-muted hover:text-foreground',
                                        )}
                                    >
                                        {barNavItem.title}
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>
                </div>
                <Button className="shrink-0" onClick={() => setOpen(true)}>
                    <Plus size={16} />
                    {config?.title ?? 'Agregar'}
                </Button>
            </div>
            <main>{children}</main>
            <Toaster richColors />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{config?.title}</DialogTitle>
                        <DialogDescription>
                            Ingresa el nombre para continuar.
                        </DialogDescription>
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
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
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
