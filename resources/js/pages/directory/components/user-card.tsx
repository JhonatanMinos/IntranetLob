import { Calendar, Ellipsis, Mail, Network, Pencil, Smartphone, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useInitials } from '@/hooks/use-initials';
import type { User } from '@/types';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: () => void;
}

export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  const getInitials = useInitials();
  const [confirmOpen, setConfirmOpen] = useState(false);
  return (
    <Card className="mb-4 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
        <Avatar className="size-14 shrink-0 rounded-full sm:size-16">
          {user.avatarPath && <AvatarImage src={`/storage/${user.avatarPath}`} alt={user.name} />}
          <AvatarFallback className="text-xl font-semibold">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <CardHeader className="flex flex-row items-start justify-between gap-3 p-0">
            <div className="min-w-0">
              <CardTitle className="flex flex-wrap items-center gap-2 text-lg font-semibold text-foreground sm:text-xl">
                {user.name}
                <Badge variant="secondary">Nº {user.employeeNumber}</Badge>
              </CardTitle>
              <CardDescription className="mt-1 flex items-center gap-2 text-sm font-medium">
                <Network className="size-4 text-primary" aria-hidden="true" />
                {user.departmentName || 'Sin departamento'}
              </CardDescription>
            </div>
            {(user.can?.update || user.can?.delete) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label={`Acciones para ${user.name}`}>
                    <Ellipsis />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {user.can?.update && (
                    <DropdownMenuItem onSelect={() => onEdit(user)}>
                      <Pencil /> Editar
                    </DropdownMenuItem>
                  )}
                  {user.can?.delete && (
                    <DropdownMenuItem variant="destructive" onSelect={() => setConfirmOpen(true)}>
                      <Trash2 /> Eliminar
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </CardHeader>
          <CardContent className="mt-4 space-y-4 border-t px-0 pt-4 text-sm text-muted-foreground">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
                  className="truncate underline-offset-4 hover:text-foreground hover:underline"
                >
                  {user.email}
                </a>
              </div>

              <div className="flex items-center gap-1">
                <Smartphone className="h-4 w-4" />
                <span>{user.phone}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              {user.position && <Badge variant="outline">{user.position}</Badge>}
              {user.storeId && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-normal uppercase">Tiendas:</span>
                  <Badge variant="secondary">{user.storeName}</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </div>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Eliminar a ${user.name}`}
        description="El usuario dejará de aparecer en el directorio. Esta acción no se puede deshacer."
        onConfirm={onDelete}
      />
    </Card>
  );
}
