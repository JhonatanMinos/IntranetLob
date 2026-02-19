# Arquitectura de Servicios y DTOs

Este proyecto implementa una arquitectura de capas con Services y DTOs (Data Transfer Objects) para mejorar la mantenibilidad, escalabilidad y sincronización entre PHP y TypeScript.

## 📋 Estructura

```
app/
├── DTOs/                    # Data Transfer Objects
│   ├── UserDTO.php
│   ├── StoreDTO.php
│   ├── EventDTO.php
│   ├── NotificationDTO.php
│   ├── DepartmentDTO.php
│   ├── BrandDTO.php
│   └── CompanyDTO.php
├── Services/               # Business Logic Layer
│   ├── UserService.php
│   ├── StoreService.php
│   ├── EventService.php
│   ├── NotificationService.php
│   ├── DepartmentService.php
│   └── ...
└── Http/Controllers/       # Thin Controllers
    ├── UserController.php
    ├── StoreController.php
    └── ...

resources/js/
└── types/index.ts          # TypeScript Types (Synchronized)
```

## 🎯 DTOs (Data Transfer Objects)

Los DTOs transforman datos de modelos Eloquent a objetos tipados, garantizando una estructura consistente.

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
```

### Propiedades Importantes

- **Fechas**: Formato ISO 8601 para `createdAt`, `updatedAt`
- **Relaciones**: Incluyen datos denormalizados (ej: `departmentName` además de `departmentId`)
- **Nullables**: Propiedades opcionales como `phone`, `description`

## 🔧 Services

Los Services encapsulan la lógica de negocio y ofrecen métodos reutilizables.

### Ejemplo: UserService

```php
// En un controlador
public function __construct(private UserService $userService) {}

public function index(Request $request)
{
    // Buscar usuarios
    $users = $this->userService->searchUsers($request->search);

    // Obtener uno específico como DTO
    $userDTO = $this->userService->getUserById($userId);

    // Crear usuario
    $userDTO = $this->userService->createUser($request->validated());

    // Actualizar usuario
    $userDTO = $this->userService->updateUser($user, $data);

    // Asignar rolle
    $this->userService->assignRole($user, $roleId);

    // Eliminar usuario
    $this->userService->deleteUser($user);
}
```

### Services Disponibles

| Service                 | Métodos                                                                                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **UserService**         | searchUsers, getAllUsers, getUserById, createUser, updateUser, deleteUser, assignRole                                                          |
| **NotificationService** | searchNotifications, getAllNotifications, getNotificationById, createNotification, updateNotification, publishNotification, deleteNotification |
| **EventService**        | searchEventsByYear, getCurrentMonthEvents, getEventsByDateRange, getEventById, createEvent, updateEvent, deleteEvent                           |
| **StoreService**        | searchStores, getAllStores, getStoreById, getStoresByBrand, getStoresByCity, createStore, updateStore, deleteStore                             |
| **DepartmentService**   | getAllDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment                                                     |

## 📱 Tipos TypeScript Sincronizados

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

## 🔗 Migraciones y Índices

Se han agregado índices en la migración `2026_02_19_000001_add_indexes_for_performance.php` para:

- Búsquedas por nombre, email, título
- Relaciones (departmentId, companyId, storeId)
- Ordenamiento y filtrado por fechas

## 📚 Referencias

- [DTOs en PHP](https://en.wikipedia.org/wiki/Data_transfer_object)
- [Service Layer Pattern](https://en.wikipedia.org/wiki/Service_locator_pattern)
- [Laravel Policies](https://laravel.com/docs/authorization#creating-policies)
- [Inertia.js Type Safety](https://inertiajs.com/typescript)
