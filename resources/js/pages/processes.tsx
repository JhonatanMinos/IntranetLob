import AppLayout from '@/layouts/app-layout';
import { index as processes } from '@/routes/processes';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ChevronRight, FileText, FileSpreadsheet, File } from 'lucide-react';
import { Input } from '@/components/ui/input';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Processes',
        href: processes().url,
    },
];

interface FolderNode {
    label: string;
    children?: FolderNode[];
    file?: string;
    ext?: string;
    size?: string;
    modified?: string;
    url?: string;
}

interface Props {
    folders: FolderNode[];
}

function getItemsAtPath(tree: FolderNode[], path: number[]): FolderNode[] {
    let current = tree;
    for (const index of path) {
        const node = current[index];
        if (!node?.children || !Array.isArray(node.children)) return [];
        current = node.children;
    }
    return current;
}

function FileIcon({ ext }: { ext?: string }) {
    const base = 'h-4 w-4 shrink-0';
    if (ext === 'pdf') return <FileText className={cn(base, 'text-red-400')} />;
    if (['xlsx', 'xls'].includes(ext ?? ''))
        return <FileSpreadsheet className={cn(base, 'text-green-400')} />;
    return <File className={cn(base, 'text-blue-400')} />;
}

export default function Processes({ folders }: Props) {
    console.log(folders);
    const [path, setPath] = useState<number[]>([]);

    const levels: FolderNode[][] = [];
    for (let i = 0; i <= path.length; i++) {
        levels.push(getItemsAtPath(folders, path.slice(0, i)));
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Procesos" />
            <div className="h-screem flex flex-col overflow-hidden font-sans">
                <div className="flex gap-2 overflow-x-auto p-4">
                    {levels.map((items, levelIndex) => {
                        const parentIndex = path[levelIndex - 1];
                        const parentItems = levels[levelIndex - 1];
                        const parentLabel =
                            levelIndex === 0
                                ? 'Gestion de Calidad'
                                : (parentItems?.[parentIndex]?.label ?? '—');

                        return (
                            <Card
                                key={levelIndex}
                                className="w-64 shrink-0 self-start bg-sidebar p-2"
                            >
                                <div className="border-gray/10 mb-2 border-b px-2 pb-2 dark:border-white/30">
                                    <p className="truncate text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                        {parentLabel}
                                    </p>
                                </div>

                                {items?.map((item, itemIndex) => {
                                    const itemIsFile = !!item.file;
                                    const isSelected =
                                        path[levelIndex] === itemIndex;
                                    return (
                                        <>
                                            {itemIsFile ? (
                                                <a
                                                    key={item.label}
                                                    href={item.url}
                                                    download={item.label}
                                                    className={cn(
                                                        'flex items-center justify-between gap-2 rounded-md p-2 transition-colors hover:bg-muted',
                                                    )}
                                                >
                                                    <FileIcon ext={item.ext} />

                                                    <div className="min-w-0 flex-1">
                                                        <span className="block truncate text-sm">
                                                            {item.label}
                                                        </span>

                                                        <span className="block text-[10px] text-muted-foreground">
                                                            {item.ext?.toUpperCase()}{' '}
                                                            · {item.size}
                                                        </span>
                                                    </div>
                                                </a>
                                            ) : (
                                                <button
                                                    key={item.label}
                                                    type="button"
                                                    onClick={() => {
                                                        setPath([
                                                            ...path.slice(
                                                                0,
                                                                levelIndex,
                                                            ),
                                                            itemIndex,
                                                        ]);
                                                    }}
                                                    className={cn(
                                                        'flex w-full items-center justify-between gap-2 rounded-md p-2 text-left transition-colors hover:bg-muted',
                                                        isSelected &&
                                                            'border-gray border-l-4 bg-muted font-medium dark:border-white',
                                                    )}
                                                >
                                                    <div className="min-w-0 flex-1">
                                                        <span className="block truncate text-sm">
                                                            {item.label}
                                                        </span>
                                                    </div>

                                                    <ChevronRight
                                                        className={cn(
                                                            'h-4 w-4 shrink-0 text-muted-foreground',
                                                            isSelected &&
                                                                'text-white',
                                                        )}
                                                    />
                                                </button>
                                            )}
                                        </>
                                    );
                                })}
                            </Card>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
