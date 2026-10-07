import type { PageProps } from '@inertiajs/core';
import { Head, usePage } from '@inertiajs/react';
import { ChevronRight, File, FileSpreadsheet, FileText, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { createFolder, deleteItem, getItemsAtPath } from '@/lib/processHelper';
import { cn } from '@/lib/utils';
import { index as processes } from '@/routes/processes';
import type { BreadcrumbItem, FolderNode } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Processes',
    href: processes().url,
  },
];

export function FileIcon({ ext }: { ext?: string }) {
  const base = 'h-4 w-4 shrink-0';
  if (ext === 'pdf') return <FileText className={cn(base, 'text-red-400')} />;
  if (['xlsx', 'xls'].includes(ext ?? ''))
    return <FileSpreadsheet className={cn(base, 'text-green-400')} />;
  return <File className={cn(base, 'text-blue-400')} />;
}

interface Props extends PageProps {
  folders: FolderNode[];
  canManage: boolean;
}

export default function Processes() {
  const { folders, canManage } = usePage<Props>().props;
  const [path, setPath] = useState<number[]>([]);
  const [deletingItem, setDeletingItem] = useState<{
    path: string;
    type: 'file' | 'folder';
    label: string;
  } | null>(null);

  const levels = useMemo(() => {
    const result: FolderNode[][] = [];
    for (let i = 0; i <= path.length; i++) {
      result.push(getItemsAtPath(folders, path.slice(0, i)));
    }
    return result;
  }, [folders, path]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Procesos" />
      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-col gap-5 px-4 py-6 font-sans sm:px-6">
        <PageHeader
          title="Procesos"
          description="Navega por los documentos y procedimientos de gestión de calidad."
          eyebrow="Trabajo"
        />
        <div className="flex gap-2 overflow-x-auto p-4">
          {levels.map((items, levelIndex) => {
            const parentIndex = path[levelIndex - 1];
            const parentItems = levels[levelIndex - 1];
            const parentLabel =
              levelIndex === 0 ? 'Gestion de Calidad' : (parentItems?.[parentIndex]?.label ?? '—');
            return (
              <Card key={parentLabel} className="w-64 shrink-0 self-start bg-sidebar p-2">
                <div className="border-gray/10 mb-2 border-b px-2 pb-2 dark:border-white/30">
                  <p className="truncate text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    {parentLabel}
                  </p>
                </div>

                {items?.map((item, itemIndex) => {
                  const itemIsFile = !!item.file;
                  const isSelected = path[levelIndex] === itemIndex;
                  return (
                    <div key={item.label}>
                      {itemIsFile ? (
                        <a
                          key={item.label}
                          href={item.url}
                          download={item.label}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            'flex items-center justify-between gap-2 rounded-md p-2 transition-colors hover:bg-muted'
                          )}
                        >
                          <FileIcon ext={item.ext} />

                          <div className="min-w-0 flex-1">
                            <span className="block truncate text-sm">{item.label}</span>

                            <span className="block text-[10px] text-muted-foreground">
                              {item.ext?.toUpperCase()}· {item.size}
                            </span>
                          </div>
                          {canManage && (
                            <Button
                              size="icon"
                              variant="ghost"
                              aria-label={`Eliminar ${item.label}`}
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                setDeletingItem({
                                  path: item.path,
                                  type: 'file',
                                  label: item.label,
                                });
                              }}
                            >
                              <Trash2 />
                            </Button>
                          )}
                        </a>
                      ) : (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => {
                            setPath([...path.slice(0, levelIndex), itemIndex]);
                          }}
                          className={cn(
                            'flex w-full items-center justify-between gap-2 rounded-md p-2 text-left transition-colors hover:bg-muted',
                            isSelected &&
                              'border-gray border-l-4 bg-muted font-medium dark:border-white'
                          )}
                        >
                          <div className="min-w-0 flex-1">
                            <span className="block truncate text-sm">{item.label}</span>
                          </div>

                          <ChevronRight
                            className={cn(
                              'h-4 w-4 shrink-0 text-muted-foreground',
                              isSelected && 'text-white'
                            )}
                          />
                        </button>
                      )}
                    </div>
                  );
                })}
                {canManage && (
                  <Button
                    size="lg"
                    variant="ghost"
                    aria-label={`Crear carpeta en ${parentLabel}`}
                    onClick={() =>
                      createFolder(
                        levelIndex === 0
                          ? 'sistemas-de-calidad'
                          : (parentItems?.[parentIndex]?.path ?? 'sistemas-de-calidad')
                      )
                    }
                  >
                    <Plus />
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      </div>
      <ConfirmDialog
        open={Boolean(deletingItem)}
        onOpenChange={(open) => !open && setDeletingItem(null)}
        title={`Eliminar “${deletingItem?.label ?? ''}”`}
        description="El archivo desaparecerá de Procesos. Esta acción no se puede deshacer."
        onConfirm={() => {
          if (!deletingItem) return;
          deleteItem(deletingItem.path, deletingItem.type);
          setDeletingItem(null);
        }}
      />
    </AppLayout>
  );
}
