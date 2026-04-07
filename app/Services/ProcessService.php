<?php

namespace App\Services;

use App\Models\Process;
use Illuminate\Http\Request;

class ProcessService
{
    public function buildTree(string $path)
    {
        if (!is_dir($path)) {
            return [];
        }

        $items = [];

        foreach (scandir($path) as $entry) {
            if ($entry === '.' || $entry === '..') {
                continue;
            }
            $fullPath = $path . DIRECTORY_SEPARATOR . $entry;
            $label    = $this->formatLabel($entry);

            if (is_dir($fullPath)) {
                $items[] = [
                    'label'    => $label,
                    'path'      => $fullPath,
                    'children' => $this->buildTree($fullPath),
                ];
            } else {
                $items[] = [
                    'label'     => $label,
                    'path'      => $fullPath,
                    'file'      => $entry,
                    'ext'       => pathinfo($entry, PATHINFO_EXTENSION),
                    'size'      => $this->formatSize(filesize($fullPath)),
                    'modified'  => date('Y-m-d H:i', filemtime($fullPath)),
                    'url'       => asset('storage/sistemas-de-calidad/'
                                    . $this->relativePath($fullPath)),
                ];
            }
        }
        return $items;
    }

    private function relativePath(string $fullPath): string
    {
        $base = storage_path('app/public/sistemas-de-calidad') . DIRECTORY_SEPARATOR;
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
            return round($bytes / 1_048_576, 1) . ' MB';
        }
        if ($bytes >= 1_024) {
            return round($bytes / 1_024, 1) . ' KB';
        }
        return $bytes . ' B';
    }
}
