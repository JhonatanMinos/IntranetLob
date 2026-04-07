<?php

namespace App\Http\Controllers;

use App\Models\PayRoll;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PayRollController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        //Views all register Nominal in db only range
        $uploads = PayRoll::with(['uploader:id,name', 'files'])
            ->latest()
            ->paginate(15)
            ->through(fn($upload) => [
                'id'              => $upload->id,
                'period_start'    => $upload->period_start->format('d/m/Y'),
                'period_end'      => $upload->period_end->format('d/m/Y'),
                'period_type'     => $upload->period_type,
                'zip_original_name' => $upload->zip_original_name,
                'status'          => $upload->status,
                'progress'        => $upload->progress,
                'total_files'     => $upload->total_files,
                'processed_files' => $upload->processed_files,
                'error_message'   => $upload->error_message,
                'uploader'        => $upload->uploader->name,
                'created_at'      => $upload->created_at->format('d/m/Y H:i'),
            ]);

        return Inertia::render('rrhh/payrolls', [
            'uploads' => $uploads,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // View a drops & drap for zip generer register
        return Inertia::render('rrhh/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //Update more the one file in zip
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //view files relation with user for employeeNumber
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
