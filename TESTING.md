# 🧪 Testing - IntranetLOB

**Estado:** Abril 2026 - Tests completos para API y servicios  
**Framework:** Pest PHP + PHPUnit  
**Cobertura:** API endpoints, Servicios, Autenticación

---

## 📋 Tabla de Contenidos

- [Ejecutar Tests](#-ejecutar-tests)
- [Estructura de Tests](#-estructura-de-tests)
- [Tests de API](#-tests-de-api)
- [Tests de Servicios](#-tests-de-servicios)
- [Helpers y Utilidades](#-helpers-y-utilidades)
- [Configuración](#-configuración)

---

## 🚀 Ejecutar Tests

### Todos los tests

```bash
php artisan test
```

### Tests de API únicamente

```bash
php artisan test --filter Api
```

### Tests específicos

```bash
# Tests de usuarios
php artisan test tests/Feature/Api/UserApiTest.php

# Tests de tiendas
php artisan test tests/Feature/Api/StoreApiTest.php

# Tests de notificaciones
php artisan test tests/Feature/Api/NotificationApiTest.php
```

### Usando el script personalizado

```bash
# Ejecutar todos los tests organizados
./run-tests.sh

# Ejecutar solo tests de API
./run-tests.sh Api
```

### Con coverage (si tienes pcov o xdebug)

```bash
php artisan test --coverage
```

---

## 📁 Estructura de Tests

```
tests/
├── Feature/
│   ├── Api/
│   │   ├── UserApiTest.php          # Tests CRUD usuarios
│   │   ├── StoreApiTest.php         # Tests CRUD tiendas
│   │   ├── NotificationApiTest.php  # Tests notificaciones
│   │   ├── EventApiTest.php         # Tests eventos
│   │   └── DepartmentApiTest.php    # Tests departamentos
│   ├── Auth/                        # Tests de autenticación
│   ├── DashboardTest.php           # Tests del dashboard
│   ├── Settings/                   # Tests de configuraciones
│   └── UserServiceTest.php         # Tests del servicio de usuarios
├── Unit/
│   └── ExampleTest.php
├── Pest.php                        # Configuración global de Pest
└── TestCase.php                    # Clase base de tests
```

---

## 🔌 Tests de API

### Cobertura de Endpoints

| Módulo            | Endpoints   | Tests                        |
| ----------------- | ----------- | ---------------------------- |
| **Users**         | 6 endpoints | ✅ CRUD + búsqueda + roles   |
| **Stores**        | 2 endpoints | ✅ CRUD + filtros            |
| **Notifications** | 3 endpoints | ✅ CRUD + publicar + filtros |
| **Events**        | 2 endpoints | ✅ CRUD + filtros por fecha  |
| **Departments**   | 2 endpoints | ✅ CRUD básico               |

### Ejemplos de Tests

#### Test de creación de usuario

```php
it('can create user', function () {
    $user = User::factory()->create();
    $this->actingAs($user, 'sanctum');

    $userData = [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'department_id' => 1
    ];

    $response = $this->postJson('/api/users', $userData);

    $response->assertStatus(201)
             ->assertJsonStructure([
                 'data' => ['id', 'name', 'email'],
                 'message'
             ]);
});
```

#### Test de búsqueda

```php
it('can search users', function () {
    // Crear datos de prueba
    User::factory()->create(['name' => 'John Smith']);
    User::factory()->create(['name' => 'Jane Doe']);

    // Buscar
    $response = $this->getJson('/api/users?search=john');

    // Verificar resultado
    $response->assertStatus(200)
             ->assertJsonCount(1, 'data');
});
```

#### Test de validación

```php
it('validates required fields', function () {
    $response = $this->postJson('/api/users', []);

    $response->assertStatus(422)
             ->assertJsonValidationErrors(['name', 'email', 'password']);
});
```

---

## 🔧 Tests de Servicios

### UserService Tests

```php
it('can get user with relationships', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $user->department_id = $department->id;
    $user->save();

    $userService = app(UserService::class);
    $result = $userService->find($user->id);

    expect($result)->toHaveKey('departmentName');
});
```

---

## 🛠️ Helpers y Utilidades

### Funciones Globales (Pest.php)

```php
// Usuario autenticado para tests
actingAsAuthenticatedUser();

// Usuario con rol específico
createUserWithRole('admin');
```

### Traits Utilizados

- `RefreshDatabase`: Base de datos limpia por test
- `WithFaker`: Datos falsos para factories
- `DatabaseMigrations`: Migraciones automáticas

### Factories Disponibles

Todos los modelos tienen factories configuradas:

- `UserFactory`
- `StoreFactory`
- `NotificationFactory`
- `EventFactory`
- `DepartmentFactory`
- `BrandFactory`
- `CompanyFactory`

---

## ⚙️ Configuración

### Archivo Pest.php

```php
pest()->extend(Tests\TestCase::class)
    ->use(Illuminate\Foundation\Testing\RefreshDatabase::class)
    ->in('Feature/Api');
```

### Archivo phpunit.xml

```xml
<phpunit>
    <testsuites>
        <testsuite name="Feature">
            <directory suffix="Test.php">./tests/Feature</directory>
        </testsuite>
        <testsuite name="Unit">
            <directory suffix="Test.php">./tests/Unit</directory>
        </testsuite>
    </testsuites>
</phpunit>
```

### Variables de Entorno para Tests

```env
APP_ENV=testing
DB_CONNECTION=sqlite
DB_DATABASE=:memory:
```

---

## 📊 Reportes y Cobertura

### Generar reporte HTML

```bash
php artisan test --coverage-html=reports/coverage
```

### Reporte de cobertura mínimo

```bash
php artisan test --coverage --min=80
```

### Tests paralelos (requiere paratest)

```bash
paratest --processes=4
```

---

## 🔧 Debugging Tests

### Ver output detallado

```bash
php artisan test --verbose
```

### Ejecutar test específico

```bash
php artisan test --filter="can create user"
```

### Debug con dump

```php
it('debug test', function () {
    $user = User::factory()->create();
    dd($user); // Ver contenido
});
```

---

## 📝 Agregar Nuevos Tests

### Para API endpoints

```bash
php artisan make:test Api/NewModuleApiTest --feature
```

### Para servicios

```bash
php artisan make:test NewServiceTest --feature
```

### Para lógica unitaria

```bash
php artisan make:test NewUnitTest
```

---

## 🚨 Tests que pueden fallar inicialmente

1. **Factories incompletas**: Verificar que todos los campos requeridos estén en las factories
2. **Relaciones faltantes**: Asegurar que las foreign keys existan
3. **Permisos**: Si usas Spatie Permission, asignar roles en los tests
4. **Soft deletes**: Usar `assertSoftDeleted()` para modelos con soft delete

---

## 📈 Mejores Prácticas

- ✅ **Un test por funcionalidad**
- ✅ **Nombres descriptivos**: `it('can create user')`
- ✅ **Arrange, Act, Assert** pattern
- ✅ **Usar factories** para datos de prueba
- ✅ **Verificar base de datos** con `assertDatabaseHas()`
- ✅ **Tests independientes** (no dependen de otros tests)

---

_Última actualización: Abril 2026_
