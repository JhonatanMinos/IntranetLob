<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\Company;
use App\Models\Department;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $searchInput = $request->search;

        $users = User::when($searchInput, function ($query, $searchInput) {
            return User::search($searchInput)
                ->query(
                    fn($q) =>
                    $q->with('department', 'company', 'store')
                );
        }, function ($query) {
            return $query->with('department', 'company', 'store');
        })
            ->orderBy('department_id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('directory/users', [
            'users' => $users,
            'departments' => Department::orderBy('name')->get(),
            'stores' => Store::all(),
            'company' => Company::all(),
        ]);
    }

    public function create()
    {
        //
    }

    public function store(StoreUserRequest $request)
    {
        User::create($request->validated());
        return redirect()->route('users.index');
    }

    public function show()
    {
        //
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        //dd($request, $user);
        $user->fill($request->safe()->except('password'));

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return back()->with('success', 'Usuario actualizado');
    }

    public function assign(Request $request, User $user)
    {
        $roleId = (int) $request->role_id;
        $user->syncRoles([$roleId]);
        return redirect()->route('profile.assign')->with('success', 'Rol asignado');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('users.index')->with('success', 'usuario eliminado');
    }
}
