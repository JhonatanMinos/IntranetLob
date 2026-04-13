<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Services\UserService;
use App\Services\DepartmentService;
use App\Services\StoreService;
use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Resources\UserResource;

class UserController extends Controller
{
    public function __construct(
        private UserService $userService,
        private DepartmentService $departmentService,
        private StoreService $storeService,
    ) {
        //
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', User::class);

        $searchInput = $request->search;
        $users = $this->userService->searchUsers($searchInput);


        return Inertia::render('directory/users', [
            'data' => UserResource::collection($users),
            'departments' => $this->departmentService->getAllDepartments(),
            'stores' => $this->storeService->getAllStores(),
            'company' => Company::all(),
            'can' => [
                'create' => $request->user()->can('create', User::class),
            ],
        ]);
    }

    public function corpo(Request $request)
    {
        $this->authorize('viewAny', User::class);

        $searchInput = $request->search;
        $users = $this->userService->searchUsers($searchInput);

        return Inertia::render('directory/corporate', [
            'data' => UserResource::collection($users),
            'departments' => $this->departmentService->getAllDepartments(),
            'stores' => $this->storeService->getAllStores(),
            'company' => Company::all(),
            'can' => [
                'create' => $request->user()->can('create', User::class),
            ],
        ]);
    }

    public function create()
    {
        $this->authorize('create', User::class);
        //
    }

    public function store(StoreUserRequest $request)
    {
        $this->authorize('create', User::class);

        $this->userService->createUser($request->validated());

        return redirect()->route('users.index')->with('success', 'Se creo con exito la tienda');
    }

    public function show()
    {
        //
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $this->authorize('update', $user);

        $this->userService->updateUser($user, $request->validated());

        return back()->with('success', 'Usuario actualizado');
    }

    public function assign(Request $request, User $user)
    {
        $this->authorize('update', $user);

        $roleId = (int) $request->role_id;
        $this->userService->assignRole($user, $roleId);

        return back()->with('success', 'Rol asignado');
    }

    public function destroy(User $user)
    {
        $this->authorize('delete', $user);

        $this->userService->deleteUser($user);

        return redirect()->route('users.index')->with('success', 'usuario eliminado');
    }
}
