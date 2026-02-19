# Guía de Migración: Controllers Legacy → Services + DTOs

Esta guía muestra cómo refactorizar un Controller para usar la nueva arquitectura de Services y DTOs.

## Paso 1: Identificar la Lógica

### Antes (Controller Legacy)

```php
<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        // Lógica de negocio mezclada aquí
        $users = User::with('department', 'company')
            ->get();

        return view('users.index', ['users' => $users]);
    }

    public function store(Request $request)
    {
        // Validación y creación
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
        ]);

        $user = User::create($validated);

        return back()->with('success', 'Created');
    }
}
```

## Paso 2: Crear el Service

Extraer toda la lógica de negocio a un Service:

```php
<?php
namespace App\Services;

use App\DTOs\UserDTO;
use App\Models\User;

class UserService
{
    public function getAllUsers()
    {
        return User::with('department', 'company', 'store')->get();
    }

    public function createUser(array $data): UserDTO
    {
        $data['password'] = Hash::make($data['password']);
        $user = User::create($data);
        $user->load('department', 'company', 'store');
        return UserDTO::fromModel($user);
    }
}
```

## Paso 3: Refactorizar el Controller

```php
<?php
namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;  // ← Usar FormRequest para validación
use App\Services\UserService;             // ← Inyectar el service
use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller
{
    // Constructor con inyección de dependencia
    public function __construct(private UserService $userService) {}

    public function index(Request $request)
    {
        // Autorización
        $this->authorize('viewAny', User::class);

        // Delegrar al service
        $users = $this->userService->getAllUsers();

        return Inertia::render('users.index', [
            'users' => $users,
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        // Autorización
        $this->authorize('create', User::class);

        // Service maneja todo
        $userDTO = $this->userService->createUser($request->validated());

        return redirect()->route('users.index')
            ->with('success', 'Usuario creado');
    }
}
```

## Paso 4: Crear el DTO (si no existe)

```php
<?php
namespace App\DTOs;

class UserDTO
{
    public function __construct(
        public int $id,
        public string $name,
        public string $email,
        public ?string $position = null,
        public ?int $departmentId = null,
        public ?string $departmentName = null,
        // ... más propiedades
    ) {}

    public static function fromModel($user): self
    {
        return new self(
            id: $user->id,
            name: $user->name,
            email: $user->email,
            position: $user->position,
            departmentId: $user->department_id,
            departmentName: $user->department?->name,
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'position' => $this->position,
            'departmentId' => $this->departmentId,
            'departmentName' => $this->departmentName,
        ];
    }
}
```

## Paso 5: Sincronizar TypeScript Types

```typescript
// resources/js/types/index.ts

export interface User {
    id: number;
    name: string;
    email: string;
    position?: string | null;
    departmentId?: number | null;
    departmentName?: string | null;
    createdAt?: string | null; // ISO 8601
    updatedAt?: string | null; // ISO 8601
}
```

## Paso 6: Actualizar el FormRequest

```php
<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Ya que usamos $this->authorize() en el controller,
        // este puede ser más permisivo
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'position' => 'nullable|string',
            'department_id' => 'required|exists:departments,id',
        ];
    }
}
```

## Checklist de Migración

Para cada Controller que migres, verifica:

- [ ] Service creado con métodos reutilizables
- [ ] DTO creado o utilizado para transformación
- [ ] Controller inyecta el Service vía constructor
- [ ] Controller usa `$this->authorize()` para políticas
- [ ] Toda lógica de negocio movida al Service
- [ ] Métodos CRUD delegados al Service
- [ ] TypeScript Types sincronizados con DTO
- [ ] FormRequest utilizado para validación
- [ ] Inertia::render() o respuesta JSON lista

## Patrón General

```php
// ✅ CORRECTO
class ResourceController extends Controller
{
    public function __construct(private ResourceService $service) {}

    public function index()
    {
        $this->authorize('viewAny', Resource::class);
        $resources = $this->service->getAll();
        return Inertia::render('resources.index', compact('resources'));
    }
}

// ❌ INCORRECTO (lógica en controller)
class ResourceController extends Controller
{
    public function index()
    {
        $resources = Resource::with('relations')->get();
        return view('resources.index', compact('resources'));
    }
}
```

## Controllers Pendientes de Refactorización

| Controller                | Service Necesario      | DTO Necesario      | Estado       |
| ------------------------- | ---------------------- | ------------------ | ------------ |
| BrandController           | BrandService           | BrandDTO           | ⏳ Pendiente |
| CompanyController         | CompanyService         | CompanyDTO         | ⏳ Pendiente |
| DepartmentController      | ✅ Existe              | ✅ Existe          | ⏳ Pendiente |
| IdentityContentController | IdentityContentService | IdentityContentDTO | ⏳ Pendiente |

## Ejemplo Real: BrandController

### Paso 1: Crear BrandService

```php
<?php
namespace App\Services;

use App\DTOs\BrandDTO;
use App\Models\Brand;

class BrandService
{
    public function getAllBrands()
    {
        return Brand::orderBy('name')->get();
    }

    public function createBrand(array $data): BrandDTO
    {
        $brand = Brand::create($data);
        return BrandDTO::fromModel($brand);
    }

    public function updateBrand(Brand $brand, array $data): BrandDTO
    {
        $brand->update($data);
        return BrandDTO::fromModel($brand);
    }

    public function deleteBrand(Brand $brand): bool
    {
        return $brand->delete();
    }
}
```

### Paso 2: Refactorizar BrandController

```php
<?php
namespace App\Http\Controllers;

use App\Http\Requests\StoreBrandRequest;
use App\Http\Requests\UpdateBrandRequest;
use App\Models\Brand;
use App\Services\BrandService;
use Inertia\Inertia;

class BrandController extends Controller
{
    public function __construct(private BrandService $service) {}

    public function index()
    {
        $this->authorize('viewAny', Brand::class);
        $brands = $this->service->getAllBrands();
        return Inertia::render('brands.index', compact('brands'));
    }

    public function store(StoreBrandRequest $request)
    {
        $this->authorize('create', Brand::class);
        $brand = $this->service->createBrand($request->validated());
        return redirect()->route('brands.index')
            ->with('success', 'Brand created');
    }

    public function update(UpdateBrandRequest $request, Brand $brand)
    {
        $this->authorize('update', $brand);
        $this->service->updateBrand($brand, $request->validated());
        return back()->with('success', 'Brand updated');
    }

    public function destroy(Brand $brand)
    {
        $this->authorize('delete', $brand);
        $this->service->deleteBrand($brand);
        return redirect()->route('brands.index')
            ->with('success', 'Brand deleted');
    }
}
```

## Tips Útiles

1. **Extrae métodos repetidos al Service**

    ```php
    // Si múltiples controllers hacen esto:
    User::with('department', 'company')->firstOrFail();

    // Créalo en UserService:
    public function getWithRelations(int $id) { ... }
    ```

2. **Usa DTOs para transformaciones complejas**

    ```php
    // Si necesitas decorar modelos
    public function enrichUserDTO(UserDTO $dto): UserDTO
    {
        // Agregar campos calculados
        return $dto;
    }
    ```

3. **Mantén Services stateless**

    ```php
    // ✅ Correcto
    public function createUser(array $data): UserDTO

    // ❌ Incorrecto
    private $user;
    public function setUser(User $user) { ... }
    ```

4. **Usa constantes para valores comunes**

    ```php
    class User extends Model {
        const ROLE_ADMIN = 'admin';
        const ROLE_USER = 'user';
    }

    // En tipos TypeScript
    type UserRole = 'admin' | 'user';
    ```

## Next Steps

1. Copia este patrón para cada Controller pendiente
2. Testa cada Service de forma aislada
3. Verifica que DTOs → TypeScript Types estén sincronizados
4. Ejecuta tests para asegurar que funciona igual que antes
