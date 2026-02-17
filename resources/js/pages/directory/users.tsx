import { router, Head, Link } from '@inertiajs/react';
import {
    Calendar,
    Mail,
    Smartphone,
    Trash2,
    Pencil,
    Building2,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from '@/components/ui/pagination';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/sonner';
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from '@/components/ui/tooltip';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import DirectoryLayout from '@/layouts/directory/layout';
import { cn } from '@/lib/utils';
import { FormUser } from '@/pages/directory/form-user';
import { index as users, destroy } from '@/routes/users';
import type { BreadcrumbItem, User, Store, SimpleModel } from '@/types';

interface UsersDirectoryProps {
    users: User[];
    departments: SimpleModel[];
    stores: Store[];
    company: SimpleModel[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Directorio', href: '/directory' },
    {
        title: 'Usuarios',
        href: users().url,
    },
];

export default function Users({
    users,
    departments,
    stores,
    company,
}: UsersDirectoryProps) {
    console.log(departments);
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const getInitials = useInitials();

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar este usuario?')) {
            router.delete(destroy.delete(id), {
                onSuccess: () => {
                    toast.success('Usuario eliminado', {
                        position: 'bottom-right',
                    });
                },
                onError: () => {
                    toast.error('Error al eliminar usuario', {
                        position: 'bottom-right',
                    });
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usuarios" />
            <DirectoryLayout
                departments={departments}
                stores={stores}
                company={company}
            >
                <ScrollArea className="h-[90vh] md:h-[80vh] lg:h-[70vh]">
                    {users.data.map((user, index) => (
                        <Card key={index} className="mb-4 p-6">
                            <div className="flex gap-6">
                                <Avatar className="h-16 w-16 rounded-full">
                                    <AvatarFallback className="text-xl font-semibold">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-1 flex-col justify-between">
                                    <CardHeader className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-600 dark:text-white">
                                                {user.name}
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-gray-700 px-2 py-0.5 text-xs text-gray-300"
                                                >
                                                    Nº {user.employeeNumber}
                                                </Badge>
                                            </CardTitle>
                                            <CardDescription className="mt-0.5 flex items-center gap-3 text-sm font-medium text-indigo-400">
                                                {user.department?.name ||
                                                    'Sin departamento'}
                                                <Building2 className="h-4 w-4" />
                                                <span className="font-semibold">
                                                    {user.company?.name ||
                                                        'Sin compañía'}
                                                    .
                                                </span>
                                            </CardDescription>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                                {user.position}
                                            </Badge>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            setSelectedUser(
                                                                user,
                                                            );
                                                            setOpen(true);
                                                        }}
                                                    >
                                                        <Pencil />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Editar usuario
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        onClick={() =>
                                                            handleDelete(
                                                                user.id,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Eliminar usuario
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </CardHeader>
                                    <Separator className="my-4" />
                                    <CardContent className="mt-4 space-y-3 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                <span className="ml-1">
                                                    {user.birthday}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                <span className="ml-1">
                                                    {user.dateEntry}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <Mail className="h-4 w-4" />
                                                <a
                                                    href={`mailto:${user.email}`}
                                                    className="underline hover:text-indigo-400"
                                                >
                                                    {user.email}
                                                </a>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <Smartphone className="h-4 w-4" />
                                                <span>{user.phone}</span>
                                            </div>
                                        </div>

                                        <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                                            <div className="flex flex-wrap gap-2">
                                                <span className="text-xs font-normal uppercase">
                                                    Tiendas:
                                                </span>

                                                {user.stores &&
                                                user.stores.length > 0 ? (
                                                    user.stores.map((store) => (
                                                        <Badge
                                                            key={store.id}
                                                            variant="outline"
                                                            className="bg-gray-700 px-2 py-0.5 text-gray-300"
                                                        >
                                                            {store.city
                                                                ? `${store.city} - ${store.name}`
                                                                : store.name}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-500">
                                                        Sin tiendas asignadas
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </div>
                            </div>
                        </Card>
                    ))}
                    <Toaster richColors />
                </ScrollArea>
                <Pagination className="mt-4 justify-center">
                    <PaginationContent>
                        {users.links.map((link, index) => (
                            <PaginationItem key={index}>
                                {link.url ? (
                                    <Link
                                        href={link.url}
                                        className={cn(
                                            buttonVariants({
                                                variant: link.active
                                                    ? 'outline'
                                                    : 'ghost',
                                                size: 'icon',
                                            }),
                                        )}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ) : (
                                    <span className="px-3 py-2">...</span>
                                )}
                            </PaginationItem>
                        ))}
                    </PaginationContent>
                </Pagination>
            </DirectoryLayout>
            <Dialog
                open={open}
                onOpenChange={(value) => {
                    setOpen(value);
                    if (!value) setSelectedUser(null);
                }}
            >
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle>Editar Usuario </DialogTitle>
                        <DialogDescription>
                            Actualizar los detalles del perfil del colaborador
                        </DialogDescription>
                    </DialogHeader>
                    <FormUser
                        departments={departments}
                        stores={stores}
                        company={company}
                        user={selectedUser}
                    />
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
