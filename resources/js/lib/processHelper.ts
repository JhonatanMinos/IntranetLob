import { router } from '@inertiajs/react';
import { store } from '@/routes/processes';
import type { FolderNode } from '@/types';

export function getCurrentFolder(
    tree: FolderNode[],
    path: number[],
): FolderNode | null {
    let current: FolderNode | null = null;
    let items = tree;

    for (const index of path) {
        current = items[index];
        if (!current) return null; // No existe
        if (!current.children) return current; // Si no hay children, es final
        items = current.children;
    }

    return current;
}

export function getItemsAtPath(
    tree: FolderNode[],
    path: number[],
): FolderNode[] {
    let current = tree;
    for (const index of path) {
        const node = current[index];
        if (!node?.children) return [];
        current = node.children;
    }
    return current;
}

export function createFolder(path: string) {
    const name = prompt('nombre de la carpeta');
    if (!name) return;

    router.post(store().url, { path, name });
}

export function uploadFile(path: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);

    router.post('/upload', formData);
}

export function deleteItem(path: string, type: 'file' | 'folder') {
    if (!confirm('¿Eliminar este elemento?')) return;

    router.delete('/delete', {
        data: { path, type },
    });
}
