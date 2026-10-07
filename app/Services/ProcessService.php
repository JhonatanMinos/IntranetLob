<?php

namespace App\Services;

use Illuminate\Support\Str;

class ProcessService
{
    public function buildTree(string $path)
    {
        if (! is_dir($path)) {
            return [];
        }

        $items = [];

        foreach (scandir($path) as $entry) {
            if ($entry === '.' || $entry === '..') {
                continue;
            }
            $fullPath = $path.DIRECTORY_SEPARATOR.$entry;
            if (is_link($fullPath)) {
                continue;
            }
            $label = $this->formatLabel($entry);

            if (is_dir($fullPath)) {
                $items[] = [
                    'label' => $label,
                    'path' => 'sistemas-de-calidad/'.$this->relativePath($fullPath),
                    'children' => $this->buildTree($fullPath),
                ];
            } else {
                $items[] = [
                    'label' => $label,
                    'path' => 'sistemas-de-calidad/'.$this->relativePath($fullPath),
                    'file' => $entry,
                    'ext' => pathinfo($entry, PATHINFO_EXTENSION),
                    'size' => $this->formatSize(filesize($fullPath)),
                    'modified' => date('Y-m-d H:i', filemtime($fullPath)),
                    'url' => asset('storage/sistemas-de-calidad/'
                                    .$this->relativePath($fullPath)),
                ];
            }
        }

        return $items;
    }

    public function searchDocuments(string $query, int $limit = 5): array
    {
        $tree = $this->buildTree(storage_path('app/public/sistemas-de-calidad'));
        $matches = [];
        $needle = Str::lower($query);

        $walk = function (array $items) use (&$walk, &$matches, $needle, $limit): void {
            foreach ($items as $item) {
                if (count($matches) >= $limit) {
                    return;
                }

                if (isset($item['file']) && Str::contains(Str::lower($item['label']), $needle)) {
                    $folder = dirname(str_replace('sistemas-de-calidad/', '', $item['path']));

                    $matches[] = [
                        'id' => 'document-'.sha1($item['path']),
                        'group' => 'Procesos',
                        'type' => 'document',
                        'title' => $item['label'],
                        'subtitle' => $folder === '.' ? 'Documentos' : str_replace(['-', '_'], ' ', $folder),
                        'url' => $item['url'],
                        'external' => true,
                    ];
                }

                if (isset($item['children'])) {
                    $walk($item['children']);
                }
            }
        };

        $walk($tree);

        return $matches;
    }

    private function relativePath(string $fullPath): string
    {
        $base = storage_path('app/public/sistemas-de-calidad').DIRECTORY_SEPARATOR;

        return str_replace($base, '', $fullPath);
    }

    private function formatLabel(string $name): string
    {
        $name = preg_replace('/\[^.]+$/', '', $name);

        return str_replace(['-', '_'], ' ', $name);
    }

    private function formatSize(int $bytes): string
    {
        if ($bytes >= 1_048_576) {
            return round($bytes / 1_048_576, 1).' MB';
        }
        if ($bytes >= 1_024) {
            return round($bytes / 1_024, 1).' KB';
        }

        return $bytes.' B';
    }
}
