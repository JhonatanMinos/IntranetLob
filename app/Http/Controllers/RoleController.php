<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index()
    {
        return Inertia::render('settings/roles', [
            'roles' => Role::with('permissions')
                               ->orderBy('id')
                ->get(),

            'permissions' => Permission::all(),
        ]);
    }

    public function store(Request $request)
    {
        $role = Role::create([
            'name' => $request->name,
        ]);

        return back();
    }

    public function update(Request $request, Role $role)
    {
        $role->permissions()->sync($request->permissions);

        return back()->with('success', 'Permissions updated');
    }

    public function destroy(Role $role)
    {
        $role->delete();
        return back();
    }
}
