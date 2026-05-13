# Guía de Migración: Controllers Legacy → Services + DTOs + Repositories

Esta guía muestra cómo refactorizar un Controller existente para usar la nueva arquitectura moderna de Services, DTOs, Repositories y Autorización.

**Última actualización:** Abril 2026
**Versión actual del proyecto:** 100% refactorizado a Services + DTOs

## 🎯 Visión General

El proyecto ya está completamente refactorizado. Esta guía es para:

1. Mantener nuevas características consistentes con el patrón
2. Refactorizar legado pendiente
3. Entender el flujo de datos

### Patrón Actual

```
Request/FormRequest
    ↓
Controller (thin, solo coordinación)
    ↓
Service (inyectado, toda la lógica)
    ↓
Repository (acceso a datos)
    ↓
Model (Eloquent ORM)
    ↓
DTO (transformación de datos)
    ↓
Inertia::render() / JSON Response
    ↓
TypeScript Types
```

## paso 1: Analizar el Código Legacy

Identifica qué necesita refactorizarse:

```php
// ❌ LEGACY - Mezclado todo en el Controller
class OldUserController extends Controller
{
    public function index()
    {
        // Lógica de negocio directamente aquí
        $users = User::with('department', 'company', 'store')
            ->where('active', true)
            ->orderBy('name')
            ->paginate(10);

        return view('users.index', ['users' => $users]);
    }

    public function store(Request $request)
    {
        // Validación inline
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
        ]);

        // Creación directa
        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);

        // Sin DTO, retorna modelo crudo
        return back()->with('success', 'Created');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return back();
    }
}
```

## Paso 2: Crear/Actualizar el Service

Extraer **toda** la lógica de negocio:

```php
<?php
namespace App\Services;

use App\DTOs\UserDTO;
use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

class UserService
{
    // Inyectar Repository para acceso a datos
    public function __construct(private UserRepository $userRepository) {}

    /**
     * Búsqueda con paginación y filtros
     */
    public function searchUsers(?string $search = null): LengthAwarePaginator
    {
        return $this->userRepository->search($search);
    }

    /**
     * Obtener todos los usuarios (con caché)
     */
    public function getAllUsers()
    {
        return CacheService::rememberQuery('users_with_relations', function () {
            return $this->userRepository->all();
        });
    }

    /**
     * Obtener un usuario como DTO
     */
    public function getUserById(int $userId): ?UserDTO
    {
        $user = $this->userRepository->find($userId);
        return $user ? UserDTO::fromModel($user) : null;
    }

    /**
     * Crear nuevo usuario
     */
    public function createUser(array $data): UserDTO
    {
        // Validación de negocio (si no está en FormRequest)
        if (User::where('email', $data['email'])->exists()) {
            throw new \Exception('Email ya existe');
        }

        // Procesar datos
        $data['password'] = Hash::make($data['password']);

        // Crear via repository
        $user = $this->userRepository->create($data);
        $user->load('department', 'company', 'store');

        // Retornar DTO
        return UserDTO::fromModel($user);
    }

    /**
     * Actualizar usuario
     */
    public function updateUser(User $user, array $data): UserDTO
    {
        // No actualizar contraseña si está vacío
        if (empty($data['password'] ?? null)) {
            unset($data['password']);
        } else {
            $data['password'] = Hash::make($data['password']);
        }

        // Actualizar via repository
        $user = $this->userRepository->update($user, $data);
        $user->load('department', 'company', 'store');

        // Invalidar caché
        CacheService::forgetPattern('users_*');

        return UserDTO::fromModel($user);
    }

    /**
     * Eliminar usuario
     */
    public function deleteUser(User $user): bool
    {
        $result = $this->userRepository->delete($user);

        // Invalidar caché
        CacheService::forgetPattern('users_*');

        return $result;
    }

    /**
     * Asignar rol a usuario
     */
    public function assignRole(User $user, string $roleId): void
    {
        $user->assignRole($roleId);
        CacheService::forgetPattern('users_*');
    }
}
```

## Paso 3: Crear/Implementar el Repository

```php
<?php
namespace App\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserRepository implements RepositoryInterface
{
    public function __construct(private User $model) {}

    /**
     * Obtener todos con relaciones
     */
    public function all(): Collection
    {
        return $this->model
            ->with('department', 'company', 'store')
            ->get();
    }

    /**
     * Buscar por ID
     */
    public function find(int $id): ?User
    {
        return $this->model
            ->with('department', 'company', 'store')
            ->find($id);
    }

    /**
     * Búsqueda con paginación
     */
    public function search(?string $search = null): LengthAwarePaginator
    {
        return $this->model
            ->with('department', 'company', 'store')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('employeeNumber', 'like', "%{$search}%")
                      ->orWhereHas('department', fn($d) =>
                          $d->where('name', 'like', "%{$search}%")
                      );
                });
            })
            ->orderBy('department_id')
            ->paginate(10);
    }

    /**
     * Crear registro
     */
    public function create(array $data): User
    {
        return $this->model->create($data);
    }

    /**
     * Actualizar registro
     */
    public function update($model, array $data): User
    {
        $model->update($data);
        return $model;
    }

    /**
     * Eliminar registro
     */
    public function delete($model): bool
    {
        return $model->delete();
    }
}
```

## Paso 4: Crear/Actualizar el DTO

```php
<?php
namespace App\DTOs;

class UserDTO
{
    public function __construct(
        public int $id,
        public string $name,
        public string $email,
        public ?string $employeeNumber = null,
        public ?string $position = null,
        public ?string $phone = null,
        public ?string $birthday = null,
        public ?string $dateEntry = null,
        public ?int $departmentId = null,
        public ?string $departmentName = null,
        public ?int $companyId = null,
        public ?string $companyName = null,
        public ?int $storeId = null,
        public ?string $storeName = null,
        public ?array $roles = null,
        public ?string $createdAt = null,
        public ?string $updatedAt = null,
    ) {}

    public static function fromModel($user): self
    {
        return new self(
            id: $user->id,
            name: $user->name,
            email: $user->email,
            employeeNumber: $user->employeeNumber,
            position: $user->position,
            phone: $user->phone,
            birthday: $user->birthday?->format('Y-m-d'),
            dateEntry: $user->dateEntry?->format('Y-m-d'),
            departmentId: $user->department_id,
            departmentName: $user->department?->name,
            companyId: $user->company_id,
            companyName: $user->company?->name,
            storeId: $user->store_id,
            storeName: $user->store?->name,
            roles: $user->roles?->pluck('name')->toArray(),
            createdAt: $user->created_at?->toIso8601String(),
            updatedAt: $user->updated_at?->toIso8601String(),
        );
    }

    public function toArray(): array
    {
        return array_filter(get_object_vars($this), fn($val) => $val !== null);
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

---

## 📊 Estado Actual de Implementación (Abril 2026)

### ✅ 100% Refactorizado

**Services implementados:** 10

- UserService, StoreService, EventService, NotificationService, DepartmentService
- BrandService, CompanyService, EmployeeFileService, ProcessService, CacheService

**DTOs implementados:** 7

- UserDTO, StoreDTO, EventDTO, NotificationDTO, DepartmentDTO, BrandDTO, CompanyDTO

**Controllers refactorizados:** 17

- UserController, StoreController, EventController, NotificationController
- DepartmentController, BrandController, CompanyController, DashboardController
- ProcessController, EmployeeFileController, PayRollController
- RoleController, PermissionController, IdentityContentController
- Settings/\* (ProfileController, PasswordController, TwoFactorAuthenticationController)

**Repositories implementados:** 1+

- UserRepository (extensible a otros modelos)

**TypeScript Types sincronizados:** ✅

- `resources/js/types/index.ts` actualizado con todos los DTOs

### 🚀 Nuevas características agregadas (2026)

1. **CacheService** - Gestión centralizada de Redis caché
2. **ProcessService** - Manejo de procesos y árbol de directorios
3. **EmployeeFileService** - Expedientes digitales con documentos tipados
4. **PayRollController** - Sistema de nóminas con procesamiento de ZIP
5. **SystemNotification** - Notificaciones polimórficas del sistema
6. **Autenticación 2FA** - Two-Factor Authentication
7. **Roles y Permisos** - Spatie Permission integrado
8. **Dashboard** - Información personalizada con eventos y noticias

### 🔧 Tecnologías Utilizadas

- **Backend:** Laravel 11, PHP 8.2
- **Frontend:** Inertia.js, React/Vue, Vite
- **BD:** MySQL con migraciones versionadas
- **Caching:** Redis via CacheService
- **Autenticación:** Laravel Fortify + 2FA
- **Autorización:** Spatie Permission + Policies
- **Tipos:** TypeScript sincronizado con DTOs

### 📈 Ventajas de la Arquitectura Actual

✅ **Escalabilidad:** Fácil agregar nuevas features
✅ **Testabilidad:** Services isolados y inyectable
✅ **Mantenibilidad:** Código limpio y organizado
✅ **Reutilización:** Services reutilizables entre controllers
✅ **Tipado fuerte:** DTO + TypeScript = error detection temprano
✅ **Performance:** Caché automático para queries frecuentes
✅ **Seguridad:** Policies de autorización integradas

---

**Documentación actualizada:** Abril 22, 2026  
**Próxima revisión:** Cuando se agreguen nuevas features
