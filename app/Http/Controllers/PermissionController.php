<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    public function store(Request $request)
    {
        Permission::create([
            'name' => $request->name,
        ]);

        return back()->with('success', 'Se creo el permiso');
    }

    public function destroy(Permission $permission)
    {
        $permission->delete();

        return back();
    }
}
