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

/**
 * @OA\Tag(
 *     name="Usuarios",
 *     description="Gestión de usuarios, directorio corporativo y asignación de roles"
 * )
 */
class UserController extends Controller
{
    public function __construct(
        private UserService $userService,
        private DepartmentService $departmentService,
        private StoreService $storeService,
    ) {
        //
    }

    /**
     * @OA\Get(
     *     path="/directory/users",
     *     operationId="indexUsers",
     *     tags={"Usuarios"},
     *     summary="Listar todos los usuarios",
     *     description="Obtiene una lista paginada de usuarios con opciones de búsqueda",
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         description="Término de búsqueda por nombre o email",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Lista de usuarios obtenida exitosamente",
     *         @OA\JsonContent(
     *             type="object",
     *             properties={
     *                 @OA\Property(property="data", type="array", items={"$ref":"#/components/schemas/User"}),
     *                 @OA\Property(property="departments", type="array", items={"$ref":"#/components/schemas/Department"}),
     *                 @OA\Property(property="stores", type="array", items={"$ref":"#/components/schemas/Store"}),
     *                 @OA\Property(property="company", type="array", items={"$ref":"#/components/schemas/Company"})
     *             }
     *         )
     *     ),
     *     @OA\Response(response=401, description="No autenticado"),
     *     security={{"api_key":{}}}
     * )
     */
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

    /**
     * @OA\Get(
     *     path="/directory/corporate",
     *     operationId="corporateUsers",
     *     tags={"Usuarios"},
     *     summary="Directorio corporativo",
     *     description="Obtiene el directorio completo de usuarios corporativos",
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         description="Término de búsqueda",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(response=200, description="Directorio corporativo"),
     *     @OA\Response(response=401, description="No autenticado"),
     *     security={{"api_key":{}}}
     * )
     */
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

    /**
     * @OA\Post(
     *     path="/directory/users",
     *     operationId="storeUser",
     *     tags={"Usuarios"},
     *     summary="Crear nuevo usuario",
     *     description="Crea un nuevo usuario en el sistema",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/CreateUserRequest")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Usuario creado exitosamente",
     *         @OA\JsonContent(ref="#/components/schemas/User")
     *     ),
     *     @OA\Response(response=401, description="No autenticado"),
     *     @OA\Response(response=403, description="No autorizado"),
     *     @OA\Response(response=422, description="Validación fallida"),
     *     security={{"api_key":{}}}
     * )
     */
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

    /**
     * @OA\Put(
     *     path="/directory/users/{user}",
     *     operationId="updateUser",
     *     tags={"Usuarios"},
     *     summary="Actualizar usuario",
     *     description="Actualiza los datos de un usuario existente",
     *     @OA\Parameter(
     *         name="user",
     *         in="path",
     *         description="ID del usuario",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/UpdateUserRequest")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Usuario actualizado exitosamente",
     *         @OA\JsonContent(ref="#/components/schemas/User")
     *     ),
     *     @OA\Response(response=401, description="No autenticado"),
     *     @OA\Response(response=403, description="No autorizado"),
     *     @OA\Response(response=404, description="Usuario no encontrado"),
     *     security={{"api_key":{}}}
     * )
     */
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
