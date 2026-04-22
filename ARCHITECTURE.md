# Arquitectura de Servicios, DTOs y Patrones

Este proyecto implementa una arquitectura de capas moderna con **Services**, **DTOs**, **Repositories** y **Controllers** para mejorar mantenibilidad, escalabilidad y sincronización entre PHP y TypeScript.

## 📋 Estructura General del Proyecto

```
app/
├── DTOs/                        # Data Transfer Objects (7 archivos)
│   ├── UserDTO.php
│   ├── StoreDTO.php
│   ├── EventDTO.php
│   ├── NotificationDTO.php
│   ├── DepartmentDTO.php
│   ├── BrandDTO.php
│   └── CompanyDTO.php
├── Services/                    # Business Logic Layer (10 servicios)
│   ├── UserService.php          # Búsqueda, CRUD de usuarios
│   ├── StoreService.php         # Gestión de tiendas
│   ├── EventService.php         # Manejo de eventos y calendario
│   ├── NotificationService.php  # Sistema de notificaciones
│   ├── DepartmentService.php    # Gestión de departamentos
│   ├── BrandService.php         # Gestión de marcas (con caché)
│   ├── CompanyService.php       # Gestión de empresas
│   ├── EmployeeFileService.php  # Expedientes digitales de empleados
│   ├── ProcessService.php       # Gestión de procesos y archivos
│   └── CacheService.php         # Servicio centralizado de caché
├── Repositories/                # Data Access Layer (Pattern Repository)
│   └── UserRepository.php       # Acceso a datos de usuarios
├── Http/Controllers/            # API Controllers (Thin - 17 en total)
│   ├── UserController.php
│   ├── StoreController.php
│   ├── DashboardController.php
│   ├── EventController.php
│   ├── NotificationController.php
│   ├── ProcessController.php
│   ├── EmployeeFileController.php
│   ├── PayRollController.php
│   ├── BrandController.php
│   ├── CompanyController.php
│   ├── DepartmentController.php
│   ├── RoleController.php
│   ├── PermissionController.php
│   ├── IdentityContentController.php
│   ├── Settings/
│   │   ├── ProfileController.php
│   │   ├── PasswordController.php
│   │   └── TwoFactorAuthenticationController.php
│   └── Controller.php            # Controlador base
├── Models/                      # Entidades de Base de Datos (11 modelos)
│   ├── User.php                 # Usuario con autenticación y roles
│   ├── Store.php                # Tiendas/Sucursales
│   ├── Department.php           # Departamentos
│   ├── Brand.php                # Marcas
│   ├── Company.php              # Empresas
│   ├── Event.php                # Eventos del calendario
│   ├── Notification.php         # Notificaciones publicadas
│   ├── EmployeeFile.php         # Expedientes de empleados
│   ├── Process.php              # Procesos/Documentos
│   ├── PayRollFiles.php         # Archivos de nómina
│   ├── SystemNotification.php   # Notificaciones del sistema
│   └── IdentityContent.php      # Contenido de identidad corporativa
├── Policies/                    # Authorization Policies
├── Jobs/                        # Queued Jobs
│   ├── ExtractPayrollZip.php   # Procesa ZIPs de nómina
│   ├── ScanEmployeeFilesFolder.php
│   └── SendBulkNotifications.php
└── Notifications/              # Laravel Notifications

routes/
├── web.php                      # Rutas principales
├── directory.php               # Rutas de directorio (usuarios, tiendas)
├── rrhh.php                    # Rutas de RRHH (nómina, departamentos)
└── settings.php                # Rutas de configuración y roles

resources/js/
└── types/index.ts              # TypeScript Types (Sincronizados con DTOs)

database/
├── migrations/                 # 20 migraciones incluidas
├── factories/                  # Factories para testing
└── seeders/                    # Seeders iniciales
```

## 🎯 DTOs (Data Transfer Objects)

Los DTOs transforman datos de modelos Eloquent a objetos tipados, garantizando una estructura consistente entre backend y frontend TypeScript.

### Estructura Completa de DTOs

| DTO | Propiedades Principales | Relaciones |
|-----|-------------------------|-----------|
| **UserDTO** | id, name, email, employeeNumber, position, phone, birthday, dateEntry | department, company, store, roles |
| **StoreDTO** | id, name, code, type, address, neighborhood, city, postalCode, state, lat, lng | brand |
| **DepartmentDTO** | id, name, description | — |
| **BrandDTO** | id, name, slug, description | — |
| **CompanyDTO** | id, name | — |
| **NotificationDTO** | id, title, subject, content, priority, type, publishedAt | creator (name) |
| **EventDTO** | id, title, type, startDate, endDate, allDay | — |

### Ejemplo: UserDTO

```php
// Crear desde un modelo
$userDTO = UserDTO::fromModel($user);

// Convertir a array
$array = $userDTO->toArray();

// Acceso a propiedades
echo $userDTO->name;
echo $userDTO->departmentName;
echo $userDTO->roles; // Array de roles
echo $userDTO->createdAt; // ISO 8601 format
```

### Características Clave

- **Fechas**: Formato ISO 8601 para `createdAt`, `updatedAt`, `publishedAt`
- **Relaciones Denormalizadas**: Se incluye nombre junto con ID (ej: `departmentName` + `departmentId`)
- **Nullables**: Propiedades opcionales como `phone`, `description`, `birthday`
- **Tipado**: Sincronizado automáticamente con TypeScript en `resources/js/types/index.ts`
- **Métodos**: `fromModel()`, `toArray()`, conversiones automáticas

## 🔧 Services

Los Services encapsulan toda la lógica de negocio y ofrecen métodos reutilizables a los Controllers. Implementan inyección de dependencias y delegación a Repositories.

### Patrón de Servicio

```php
// Inyección en constructor
public function __construct(
    private UserService $userService,
    private DepartmentService $departmentService,
) {}

// Uso en controlador
public function index(Request $request)
{
    // Búsqueda
    $users = $this->userService->searchUsers($request->search);
    
    // Obtener por ID como DTO
    $userDTO = $this->userService->getUserById($userId);
    
    // CRUD
    $userDTO = $this->userService->createUser($request->validated());
    $userDTO = $this->userService->updateUser($user, $data);
    $this->userService->deleteUser($user);
}
```

### Services Disponibles (10 en Total)

| Service | Métodos Principales |
|---------|-------------------|
| **UserService** | `searchUsers()`, `getAllUsers()`, `getUserById()`, `createUser()`, `updateUser()`, `deleteUser()`, `assignRole()` |
| **StoreService** | `searchStores()`, `getAllStores()`, `getStoreById()`, `getStoresByBrand()`, `getStoresByCity()`, `createStore()`, `updateStore()`, `deleteStore()` |
| **DepartmentService** | `getAllDepartments()`, `getDepartmentById()`, `createDepartment()`, `updateDepartment()`, `deleteDepartment()` |
| **EventService** | `searchEventsByYear()`, `getCurrentMonthEvents()`, `getEventsByDateRange()`, `getEventById()`, `createEvent()`, `updateEvent()`, `deleteEvent()` |
| **NotificationService** | `searchNotifications()`, `getAllNotifications()`, `getNotificationById()`, `createNotification()`, `updateNotification()`, `publishNotification()`, `deleteNotification()`, `getFormData()` |
| **BrandService** | `getAllBrands()`, `getBrandById()`, `createBrand()`, `updateBrand()`, `deleteBrand()` |
| **CompanyService** | CRUD básico de empresas |
| **EmployeeFileService** | `paginate()`, `ensureForUser()`, gestión de documentos por tipo |
| **ProcessService** | `buildTree()` - crea árbol de directorios de procesos, `formatSize()`, `formatLabel()` |
| **CacheService** | `rememberQuery()`, `forgetPattern()`, `getActiveUsers()`, `clearAll()` |

### CacheService - Gestión Centralizada de Caché

```php
// Cachear queries con clave personalizada (TTL 1 hora)
$users = CacheService::rememberQuery('all_users_with_relations', function () {
    return User::with('department', 'company', 'store')->get();
});

// Invalidar por patrón
CacheService::forgetPattern('users_*');

// Obtener usuarios activos (con caché)
$active = CacheService::getActiveUsers();

// Limpiar toda la caché
CacheService::clearAll();
```

## 🧠 Controllers (Thin Controllers)

Los Controllers son **delgados** y **enfocados**, delegando toda la lógica de negocio a Services. Incluyen:
- **Inyección de Dependencias**: Services se inyectan en constructor
- **Autorización**: Políticas via `$this->authorize()`
- **Validación**: FormRequests personalizadas
- **Respuestas**: DTOs y Inertia::render()

### Patrón de Controller

```php
class UserController extends Controller
{
    // Inyección de servicios
    public function __construct(
        private UserService $userService,
        private DepartmentService $departmentService,
        private StoreService $storeService,
    ) {}

    // Lista con búsqueda
    public function index(Request $request)
    {
        $this->authorize('viewAny', User::class);
        $users = $this->userService->searchUsers($request->search);

        return Inertia::render('directory/users', [
            'data' => UserResource::collection($users),
            'departments' => $this->departmentService->getAllDepartments(),
        ]);
    }

    // Crear con validación automática
    public function store(StoreUserRequest $request)
    {
        $this->authorize('create', User::class);
        $userDTO = $this->userService->createUser($request->validated());

        return redirect()->route('users.index')->with('success', 'Created');
    }
}
```

### Controllers Disponibles (17 en Total)

**Directorio:**
- `UserController` - Gestión de usuarios (búsqueda, CRUD, roles)
- `StoreController` - Gestión de tiendas/sucursales
- `IdentityContentController` - Contenido de identidad corporativa

**RRHH:**
- `DepartmentController` - Gestión de departamentos
- `CompanyController` - Gestión de empresas
- `PayRollController` - Carga y procesamiento de nóminas
- `EmployeeFileController` - Expedientes digitales de empleados

**Dashboard y Contenido:**
- `DashboardController` - Dashboard principal con eventos, noticias, cumpleaños
- `EventController` - Calendario de eventos
- `NotificationController` - Sistema de notificaciones

**Calidad y Procesos:**
- `ProcessController` - Gestión de procesos y documentos (árbol de carpetas)

**Administración:**
- `RoleController` - Gestión de roles (solo SA)
- `PermissionController` - Gestión de permisos (solo SA)
- `BrandController` - Gestión de marcas

**Configuración de Usuario:**
- `Settings/ProfileController` - Perfil, foto, datos personales, nóminas
- `Settings/PasswordController` - Cambio de contraseña
- `Settings/TwoFactorAuthenticationController` - Autenticación de 2 factores

## 📦 Repositories (Data Access Pattern)

Implementa el patrón Repository para abstraer acceso a datos. Actualmente implementado para User, extensible a otros modelos.

```php
// app/Repositories/UserRepository.php
class UserRepository implements RepositoryInterface
{
    public function all(): Collection { ... }
    public function find(int $id): ?User { ... }
    public function search(?string $search): LengthAwarePaginator { ... }
    public function create(array $data): User { ... }
    public function update($model, array $data): User { ... }
    public function delete($model): bool { ... }
}
```

**Interfaz Contrato:**
```php
interface RepositoryInterface
{
    public function all();
    public function find(int $id);
    public function search();
    public function create(array $data);
    public function update($model, array $data);
    public function delete($model);
}
```

## 🗄️ Models (Entidades)

### Relaciones Clave

```
User
├── belongsTo: Department, Company, Store
├── hasMany: creatdNotifications, SystemNotifications
└── hasOne: EmployeeFile

Store
└── belongsTo: Brand

Notification
└── belongsTo: User (creator)

Event, Department, Brand, Company, EmployeeFile, Process, PayRollFiles
└── Modelos independientes

SystemNotification
└── Notificación polimórfica
```

### Features del Model User

- **Autenticación**: Email/password + remember tokens
- **Dos Factores**: Two factor authentication tokens
- **Roles y Permisos**: Via Spatie Permission traits (HasRoles)
- **Soft Deletes**: Eliminación lógica
- **Relaciones**: Department, Company, Store, EmployeeFile
- **Notificaciones**: Notifiable, SystemNotifications (polimórficas)

Los tipos TypeScript (`resources/js/types/index.ts`) están sincronizados con los DTOs PHP.

### Ejemplo: User Type

```typescript
interface User {
    id: number;
    name: string;
    email: string;
    employeeNumber?: string | null;
    position?: string | null;
    phone?: string | null;
    birthday?: string | null; // Y-m-d format
    dateEntry?: string | null; // Y-m-d format
    departmentId?: number | null;
    departmentName?: string | null;
    companyId?: number | null;
    companyName?: string | null;
    storeId?: number | null;
    storeName?: string | null;
    roles?: string[] | null;
    emailVerifiedAt?: string | null; // ISO 8601
    createdAt?: string | null; // ISO 8601
    updatedAt?: string | null; // ISO 8601
}
```

### Reglas de Formato

- **Fechas simples**: `Y-m-d` (birthday, dateEntry, startDate)
- **Timestamps**: ISO 8601 (createdAt, updatedAt, publishedAt)
- **camelCase**: Todas las propiedades en camelCase (TypeScript standard)
- **snake_case en BD**: Las columnas siguen snake_case en las migraciones

## 🔄 Flujo de Datos

```
Request
  ↓
Validation (FormRequest)
  ↓
Service (lógica de negocio)
  ↓
DTO (transformación)
  ↓
Inertia/JSON Response
  ↓
TypeScript Types
```

## ✅ Políticas de Autorización

Los controladores usan `$this->authorize()` con las políticas implementadas:

```php
public function update(UpdateUserRequest $request, User $user)
{
    // Verifica la política UserPolicy::update()
    $this->authorize('update', $user);

    $this->userService->updateUser($user, $request->validated());

    return back()->with('success', 'Actualizado');
}
```

### Roles Disponibles

- **sa** (Super Admin): Acceso total
- **rh** (Recursos Humanos): Gestionar usuarios, departamentos
- **gerente**: Gestionar su tienda
- **comunicaciones**: Crear notificaciones

## 🚀 Mejores Prácticas

1. **Inyectar Services en Controladores**

    ```php
    public function __construct(private UserService $userService) {}
    ```

2. **Usar DTOs para respuestas**

    ```php
    return Inertia::render('users', [
        'data' => $userDTO->toArray(),
    ]);
    ```

3. **Delegar lógica a Services**
    - No escribir lógica compleja en controladores
    - Los controladores solo coordinan

4. **Mantener sincronizados DTOs y Types**
    - Si cambias un DTO, actualiza el Type correspondiente
    - Usa camelCase en ambos

5. **Usar constantes de modelos**
    ```php
    Event::TYPE_CUMPLE
    Notification::TYPE_AVISO
    Notification::PRIORITY_URGENTE
    ```

## 📝 Ejemplo Completo

### Controller

```php
public function store(StoreUserRequest $request)
{
    $this->authorize('create', User::class);

    $userDTO = $this->userService->createUser($request->validated());

    return redirect()->route('users.index')
        ->with('success', 'Usuario creado');
}
```

### Service

```php
public function createUser(array $data): UserDTO
{
    $data['password'] = Hash::make($data['password']);
    $user = User::create($data);
    $user->load('department', 'company', 'store');
    return UserDTO::fromModel($user);
}
```

### TypeScript Component

```tsx
const handleSubmit = async (data: Omit<User, 'id'>) => {
    await post('/directory/users', data);
};
```

## 🔗 Migraciones y Base de Datos

Se han implementado **20 migraciones** incluyendo:

### Tablas Core
- `users` - Usuarios con autenticación 2FA
- `departments` - Departamentos empresariales
- `companies` - Empresas
- `brands` - Marcas
- `stores` - Tiendas/Sucursales
- `events` - Eventos del calendario
- `notifications` - Notificaciones publicadas
- `notification_user` - Relación many-to-many

### Tablas Especializadas
- `identity_contents` - Contenido de identidad corporativa
- `employee_files` - Expedientes digitales
- `processes` - Procesos y documentos
- `payroll_files` - Archivos de nómina
- `pay_roll_data` - Datos de nómina
- `system_notifications` - Notificaciones del sistema (polimórficas)

### Tablas de Autenticación y Permisos
- `permissions` - Permisos (Spatie)
- `roles` - Roles (Spatie)
- `role_has_permissions` - Relación roles-permisos
- `model_has_roles` - Relación modelos-roles

### Optimización
- `2026_04_13_000000_add_performance_indexes.php` - Índices para búsquedas y relaciones
- Cache con Redis para queries frecuentes

## 💼 Patrones de Arquitectura

### 1. **Service Layer Pattern**
   - Toda la lógica de negocio en Services
   - Controllers solo coordinan y validan

### 2. **Data Transfer Objects (DTOs)**
   - Transforman modelos Eloquent a estructuras tipadas
   - Sincronizados con TypeScript

### 3. **Repository Pattern**
   - Abstrae acceso a datos
   - Facilita testing y cambios de BD

### 4. **Authorization Policies**
   - Control granular de permisos
   - Integrado con Spatie Permission

### 5. **SOLID Principles**
   - **S**ingle: Cada servicio una responsabilidad
   - **O**pen/Closed: Extensibles sin modificar
   - **L**iskov: Sustitución de tipos
   - **I**nterface: Contratos claros
   - **D**ependency: Inyección de dependencias

## 📚 Referencias

- [DTOs en PHP](https://en.wikipedia.org/wiki/Data_transfer_object)
- [Service Layer Pattern](https://en.wikipedia.org/wiki/Service_locator_pattern)
- [Laravel Policies](https://laravel.com/docs/authorization#creating-policies)
- [Inertia.js Type Safety](https://inertiajs.com/typescript)
- [Spatie Permission](https://spatie.be/docs/laravel-permission)
