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

        return back();
    }

    public function destroy(Permission $permission)
    {
        $permission->delete();

        return back();
    }
}
