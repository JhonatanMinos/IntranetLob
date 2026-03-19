import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Building2, Loader2, Shield, ShieldPlus, ShieldUser, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { store as storePermission } from '@/routes/permissions'; // Asumiendo que existe
import { index as rolesRoute, update } from '@/routes/roles';
import type { BreadcrumbItem, Permission, Role } from '@/types';
import { toast } from 'sonner';
import { useFlash } from '@/hooks/use-flash';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Roles settings', href: rolesRoute.url() }];

interface RolesProps {
  roles: Role[];
  permissions: Permission[];
}

export default function Roles({ roles = [], permissions = [] }: RolesProps) {
  const [openPermission, setOpenPermission] = useState(false);
  const [activeRole, setActiveRole] = useState<Role | null>(roles[0] || null);
  const [selected, setSelected] = useState<string[]>(
    activeRole?.permissions?.map((p) => p.id) ?? []
  );

  // Formulario para nuevo permiso
  const { data, setData, post, processing, reset, errors, isSubmitting } = useForm({
    name: '',
  });

  const roleMap: Record<string, { icon: React.ReactNode; label: string }> = {
    sa: { icon: <Shield className="mr-2 h-4 w-4" />, label: 'Super Admin' },
    rh: {
      icon: <Building2 className="mr-2 h-4 w-4" />,
      label: 'Human Capital',
    },
    user: { icon: <User className="mr-2 h-4 w-4" />, label: 'User' },
  };

  // Actualizar selección cuando cambia el rol activo
  useEffect(() => {
    if (activeRole) {
      setSelected(activeRole.permissions?.map((p) => p.id) ?? []);
    }
  }, [activeRole]);

  const togglePermission = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const handleUpdatePermissions = async () => {
    if (!activeRole || isSubmitting) return; // previene doble click

    try {
      await router.put(
        update(activeRole.id).url,
        { permissions: selected },
        {
          preserveScroll: true,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreatePermission = (e: React.FormEvent) => {
    e.preventDefault();
    post(storePermission.url(), {
      onSuccess: () => {
        setOpenPermission(false);
        reset();
      },
    });
  };

  useFlash();

  if (!activeRole) return null;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <SettingsLayout>
        <Head title="Roles & Permissions" />

        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-base font-medium tracking-tight">Roles & Permissions</h2>
            <p className="text-sm text-muted-foreground">
              Manage what each user group can see and do.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <ShieldUser className="mr-2 h-4 w-4" /> Nuevo rol
            </Button>
            <Button size="sm" onClick={() => setOpenPermission(true)}>
              <ShieldPlus className="mr-2 h-4 w-4" /> Nuevo permiso
            </Button>
          </div>
        </header>

        <Tabs
          value={activeRole.id}
          onValueChange={(id) => setActiveRole(roles.find((r) => r.id === id) || null)}
        >
          <TabsList className="mb-4">
            {roles.map((role) => (
              <TabsTrigger key={role.id} value={role.id}>
                {roleMap[role.name]?.icon || <Shield className="mr-2 h-4 w-4" />}
                {roleMap[role.name]?.label || role.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <Card>
            <CardHeader>
              <CardTitle>Permissions for {activeRole.name}</CardTitle>
              <CardDescription>Select the capabilities for this specific role.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-center space-x-3 rounded-md border p-3 transition-colors hover:bg-accent/50"
                  >
                    <Checkbox
                      id={`perm-${permission.id}`}
                      checked={selected.includes(permission.id)}
                      onCheckedChange={() => togglePermission(permission.id)}
                    />
                    <Label
                      htmlFor={`perm-${permission.id}`}
                      className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {permission.name}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="justify-end border-t px-6 py-4">
              <Button disabled={isSubmitting} onClick={handleUpdatePermissions}>
                {isSubmitting ? 'Guardado cambios...' : 'Guardar cambio'}
                {isSubmitting && <Loader2 className="animate-spin" />}
              </Button>
            </CardFooter>
          </Card>
        </Tabs>

        {/* Dialog para Nuevo Permiso */}
        <Dialog open={openPermission} onOpenChange={setOpenPermission}>
          <DialogContent>
            <form onSubmit={handleCreatePermission}>
              <DialogHeader>
                <DialogTitle>Create New Permission</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Permission Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., users.create"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setOpenPermission(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  Create Permission
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </SettingsLayout>
    </AppLayout>
  );
}
