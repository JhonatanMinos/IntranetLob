import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Toaster } from '@/components/ui/sonner';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
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
        <div className="flex h-full flex-col px-3 py-5">
            <div className="md:fex-row md:items-between flex flex-col justify-between gap-4 border-b pb-4">
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
                                            : 'border-transparent text-muted-foreground hover:border-muted hover:text-foreground',
                                    )}
                                >
                                    {barNavItem.title}
                                </Link>
                            );
                        })}
                    </div>
                    {can.create && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className="shrink-0"
                                    onClick={() => setOpen(true)}
                                >
                                    <Plus />
                                    {activeItem?.title === 'Usuarios'
                                        ? 'Agregar usuario'
                                        : 'Agregar tienda'}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {activeItem?.title === 'Usuarios'
                                    ? 'Nuevo Usuario'
                                    : 'Nueva Tienda'}
                            </TooltipContent>
                        </Tooltip>
                    )}
                </nav>
            </div>

            <div
                className={cn(
                    'min-h-0 w-full flex-1',
                    aside
                        ? 'grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr]'
                        : 'mx-auto flex w-full max-w-5xl flex-col',
                )}
            >
                {/* MAIN */}
                <main className="flex min-h-0 flex-col">
                    <div className="mb-2 min-h-0 flex-1 overflow-y-auto">
                        {children}
                    </div>

                    {pagination && (
                        <div className="sticky bottom-0 bg-background py-2">
                            {pagination}
                        </div>
                    )}
                </main>
                {/* ASIDE */}
                {aside && (
                    <aside className="min-h-0 overflow-y-auto border-l pl-4">
                        {aside}
                    </aside>
                )}
                <Toaster richColors />
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle>
                            {activeItem?.title === 'Usuarios'
                                ? 'Nuevo Usuario'
                                : 'Nueva Tienda'}
                        </DialogTitle>
                    </DialogHeader>
                    {activeItem?.title === 'Usuarios' && (
                        <FormUser
                            departments={departments}
                            stores={stores}
                            company={company}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
