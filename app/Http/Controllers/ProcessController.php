<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProcessRequest;
use App\Services\ProcessService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProcessController extends Controller
{
    public function __construct(private ProcessService $ProcessService)
    {
        //
    }

    public function index()
    {
        $this->authorize('view-processes');
        $basePath = storage_path('app/public/sistemas-de-calidad');

        $folders = $this->ProcessService->buildTree($basePath);

        return Inertia::render('processes', [
            'folders' => $folders,
            'canManage' => auth()->user()->can('manage-processes'),
        ]);
    }

    public function store(StoreProcessRequest $request)
    {
        $this->authorize('manage-processes');
        $data = $request->validated();
        $data['path'] = $this->documentPath($data['path']);

        $fullPath = $data['path'].'/'.$data['name'];

        if (! Storage::disk('public')->exists($fullPath)) {
            abort_unless(Storage::disk('public')->makeDirectory($fullPath), 500, 'No se pudo crear la carpeta.');
        }

        return back()->with('success', 'Carpeta creada correctamente.');
    }

    public function upload(Request $request)
    {
        $this->authorize('manage-processes');
        $request->validate([
            'file' => 'required|file|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,txt,jpg,jpeg,png|max:10240',
            'path' => 'required|string',
        ]);

        $path = $request->file('file')->store($this->documentPath($request->path), 'public');

        abort_if(! $path, 500, 'No se pudo guardar el archivo.');

        return back();
    }

    public function delete(Request $request)
    {
        $this->authorize('manage-processes');
        $request->validate([
            'path' => 'required|string',
            'type' => 'required|in:file,folder',
        ]);

        $path = $this->documentPath($request->path, false);
        if ($request->type === 'file') {
            Storage::disk('public')->delete($path);
        } else {
            Storage::disk('public')->deleteDirectory($path);
        }

        return back();
    }

    private function documentPath(string $path, bool $allowRoot = true): string
    {
        $path = trim($path, '/');
        $segments = explode('/', $path);
        abort_unless($segments[0] === 'sistemas-de-calidad' && ! in_array('..', $segments, true)
            && ! in_array('.', $segments, true) && ! str_contains($path, '\\') && ! str_contains($path, "\0"), 422, 'Ruta no permitida.');
        abort_if(! $allowRoot && $path === 'sistemas-de-calidad', 422, 'No se puede eliminar la carpeta principal.');
        // Ningún segmento puede apuntar a un enlace fuera de la carpeta documental.
        $disk = Storage::disk('public');
        $current = '';
        foreach ($segments as $segment) {
            $current = $current === '' ? $segment : $current.'/'.$segment;
            abort_if(is_link($disk->path($current)), 422, 'Ruta no permitida.');
        }

        return $path;
    }
}
