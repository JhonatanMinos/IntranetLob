import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useInitials } from '@/hooks/use-initials';
import type { User } from '@/types';
import {
    Building2,
    Calendar,
    Mail,
    Pencil,
    Smartphone,
    Trash2,
} from 'lucide-react';

interface UserCardProps {
    user: User;
    onEdit: (user: User) => void;
    onDelete: () => void;
}

export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
    const getInitials = useInitials();
    return (
        <Card className="mb-4 p-6">
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
                                {user.department?.name || 'Sin departamento'}
                                <Building2 className="h-4 w-4" />
                                <span className="font-semibold">
                                    {user.company?.name || 'Sin compañía'}.
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
                                        onClick={() => onEdit(user)}
                                    >
                                        <Pencil />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Editar usuario</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => onDelete(user.id)}
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
                                <span className="ml-1">{user.birthday}</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span className="ml-1">{user.dateEntry}</span>
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

                                {user?.stores ? (
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
    );
}
