<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProcessRequest;
use App\Http\Requests\UpdateProcessRequest;
use App\Models\Process;
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
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $basePath = storage_path('app/public/sistemas-de-calidad');

        $folders = $this->ProcessService->buildTree($basePath);
        return Inertia::render('processes', [
            'folders' => $folders,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProcessRequest $request)
    {
        $data = $request->validated();

        $fullPath = $data['path'] . '/' . $data['name'];

        if (!Storage::disk('public')->exists($fullPath)) {
            Storage::disk('public')->makeDirectory($fullPath);
        }
        return back()->with('success', 'Carpeta creada correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Process $process)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Process $process)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProcessRequest $request)
    {
        //
    }

    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:2048',
            'path' => 'required|string',
        ]);

        $path = $request->file('file')->store($request->path, 'public');

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        //
    }

    public function delete(Request $request)
    {
        $request->validate([
            'path' => 'required|string',
            'type' => 'required|in:file,folder',
        ]);

        if ($request->type === 'file') {
            Storage::disk('public')->delete($request->path);
        } else {
            Storage::disk('public')->deleteDirectory($request->path);
        }

        return back();
    }
}
