import { Link, router } from '@inertiajs/react';
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  ChevronRight,
  FileUser,
  Flag,
  FolderTree,
  GripVertical,
  Settings2,
  Store,
  UserCog,
  Workflow,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { index as departmentsRoute } from '@/routes/departament';
import { index as employeeFilesRoute } from '@/routes/employeeFiles';
import { index as eventsRoute } from '@/routes/events';
import { index as marketplaceRoute } from '@/routes/marketplace';
import { index as notificationsRoute } from '@/routes/notifications';
import { index as processesRoute } from '@/routes/processes';
import { index as usersRoute } from '@/routes/users';

export type ShortcutId =
  | 'directory'
  | 'processes'
  | 'events'
  | 'notifications'
  | 'employee-files'
  | 'rrhh'
  | 'marketplace';

type Shortcut = {
  id: ShortcutId;
  title: string;
  description: string;
  href: string;
  permission: string;
  icon: typeof FolderTree;
};

const shortcuts: Shortcut[] = [
  {
    id: 'directory',
    title: 'Directorio',
    description: 'Consulta colaboradores y tiendas',
    href: usersRoute().url,
    permission: 'view Directory',
    icon: FolderTree,
  },
  {
    id: 'processes',
    title: 'Procesos',
    description: 'Documentos del sistema de calidad',
    href: processesRoute().url,
    permission: 'view Process',
    icon: Workflow,
  },
  {
    id: 'events',
    title: 'Calendario',
    description: 'Eventos y fechas corporativas',
    href: eventsRoute().url,
    permission: 'view Event',
    icon: CalendarDays,
  },
  {
    id: 'notifications',
    title: 'Avisos',
    description: 'Novedades y comunicados internos',
    href: notificationsRoute().url,
    permission: 'view Notification',
    icon: Flag,
  },
  {
    id: 'employee-files',
    title: 'Expedientes',
    description: 'Documentación de colaboradores',
    href: employeeFilesRoute().url,
    permission: 'view Files',
    icon: FileUser,
  },
  {
    id: 'rrhh',
    title: 'Capital Humano',
    description: 'Departamentos y administración',
    href: departmentsRoute().url,
    permission: 'view RRHH',
    icon: UserCog,
  },
  {
    id: 'marketplace',
    title: 'Marketplace',
    description: 'Compra, venta e intercambio',
    href: marketplaceRoute().url,
    permission: 'view MarketPlace',
    icon: Store,
  },
];

interface QuickAccessProps {
  permissions: string[];
  savedShortcuts: ShortcutId[] | null;
}

export function QuickAccess({ permissions, savedShortcuts }: QuickAccessProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState<ShortcutId | null>(null);

  const available = useMemo(
    () => shortcuts.filter((shortcut) => permissions.includes(shortcut.permission)),
    [permissions]
  );
  const availableIds = useMemo(() => new Set(available.map(({ id }) => id)), [available]);
  const defaults = useMemo(
    () =>
      (['directory', 'processes', 'events'] as ShortcutId[]).filter((id) => availableIds.has(id)),
    [availableIds]
  );
  const selectedIds = (savedShortcuts ?? defaults).filter((id) => availableIds.has(id));
  const [draft, setDraft] = useState<ShortcutId[]>(selectedIds);

  const selected = selectedIds
    .map((id) => available.find((shortcut) => shortcut.id === id))
    .filter((shortcut): shortcut is Shortcut => Boolean(shortcut));

  const openCustomizer = () => {
    setDraft(selectedIds);
    setOpen(true);
  };

  const toggleShortcut = (id: ShortcutId, enabled: boolean) => {
    setDraft((current) =>
      enabled ? [...current, id] : current.filter((shortcutId) => shortcutId !== id)
    );
  };

  const moveShortcut = (id: ShortcutId, direction: -1 | 1) => {
    setDraft((current) => {
      const index = current.indexOf(id);
      const destination = index + direction;

      if (index < 0 || destination < 0 || destination >= current.length) {
        return current;
      }

      const reordered = [...current];
      [reordered[index], reordered[destination]] = [reordered[destination], reordered[index]];
      return reordered;
    });
  };

  const dropShortcut = (destination: ShortcutId) => {
    if (!dragging || dragging === destination) {
      return;
    }

    setDraft((current) => {
      const reordered = current.filter((id) => id !== dragging);
      const destinationIndex = reordered.indexOf(destination);
      reordered.splice(destinationIndex, 0, dragging);
      return reordered;
    });
    setDragging(null);
  };

  const save = () => {
    setSaving(true);
    router.patch(
      '/dashboard/shortcuts',
      { shortcuts: draft },
      {
        preserveScroll: true,
        onSuccess: () => {
          setOpen(false);
          toast.success('Accesos directos actualizados');
        },
        onError: () => toast.error('No se pudieron guardar los accesos directos'),
        onFinish: () => setSaving(false),
      }
    );
  };

  return (
    <section aria-labelledby="quick-access-title">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 id="quick-access-title" className="text-sm font-semibold">
            Accesos directos
          </h2>
          <p className="text-xs text-muted-foreground">Tus herramientas más utilizadas</p>
        </div>
        <Button variant="ghost" size="sm" onClick={openCustomizer}>
          <Settings2 /> Personalizar
        </Button>
      </div>

      {selected.length > 0 ? (
        <nav className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Accesos directos">
          {selected.map((shortcut) => {
            const Icon = shortcut.icon;
            return (
              <Link
                key={shortcut.id}
                href={shortcut.href}
                className="group flex min-w-0 items-center gap-3 rounded-xl border bg-card p-4 shadow-xs transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{shortcut.title}</span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {shortcut.description}
                  </span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            );
          })}
        </nav>
      ) : (
        <button
          type="button"
          onClick={openCustomizer}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed p-6 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground"
        >
          <Settings2 className="size-4" /> Agrega tus accesos directos
        </button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Personalizar accesos directos</DialogTitle>
            <DialogDescription>
              Elige las herramientas que quieres ver y ordénalas según tu forma de trabajo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="grid gap-2 sm:grid-cols-2">
              {available.map((shortcut) => {
                const Icon = shortcut.icon;
                const checked = draft.includes(shortcut.id);
                return (
                  <div
                    key={shortcut.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50 has-[[data-state=checked]]:border-primary/40 has-[[data-state=checked]]:bg-primary/5"
                  >
                    <Checkbox
                      id={`shortcut-${shortcut.id}`}
                      checked={checked}
                      onCheckedChange={(value) => toggleShortcut(shortcut.id, value === true)}
                    />
                    <Icon className="size-4 text-primary" />
                    <label
                      htmlFor={`shortcut-${shortcut.id}`}
                      className="flex-1 cursor-pointer text-sm font-medium"
                    >
                      {shortcut.title}
                    </label>
                  </div>
                );
              })}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-medium">Orden de aparición</h3>
                <span className="text-xs text-muted-foreground">{draft.length} seleccionados</span>
              </div>
              <ul className="space-y-2">
                {draft.map((id, index) => {
                  const shortcut = available.find((item) => item.id === id);
                  if (!shortcut) return null;
                  const Icon = shortcut.icon;

                  return (
                    <li
                      key={id}
                      draggable
                      onDragStart={() => setDragging(id)}
                      onDragEnd={() => setDragging(null)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => dropShortcut(id)}
                      className="flex items-center gap-2 rounded-lg border bg-background p-2"
                    >
                      <GripVertical className="size-4 cursor-grab text-muted-foreground" />
                      <span className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">
                        {shortcut.title}
                      </span>
                      <Button
                        type="button"
                        size="icon-xs"
                        variant="ghost"
                        disabled={index === 0}
                        onClick={() => moveShortcut(id, -1)}
                        aria-label={`Subir ${shortcut.title}`}
                      >
                        <ArrowUp />
                      </Button>
                      <Button
                        type="button"
                        size="icon-xs"
                        variant="ghost"
                        disabled={index === draft.length - 1}
                        onClick={() => moveShortcut(id, 1)}
                        aria-label={`Bajar ${shortcut.title}`}
                      >
                        <ArrowDown />
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
