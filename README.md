# 🏢 IntranetLOB - Intranet Empresarial Inteligente

[![Laravel](https://img.shields.io/badge/Laravel-11-red?logo=laravel)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-8.3-blue?logo=php)](https://www.php.net)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite)](https://vitejs.dev)

Plataforma integral de intranet empresarial desarrollada con **Laravel 11**, **Inertia.js** y **React**, diseñada para centralizar la comunicación, información y gestión de recursos humanos en organizaciones con múltiples tiendas y departamentos.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tech Stack](#-tech-stack)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Documentación](#-documentación)
- [API y Servicios](#-api-y-servicios)
- [Contribución](#-contribución)

---

## 🚀 Características

### 👥 Gestión de Usuarios y Directorio

- ✅ Gestión de usuarios (CRUD completo)
- ✅ Directorio empresarial filterable por departamento/tienda
- ✅ Perfil de usuario con foto y datos personales
- ✅ Asignación de roles y permisos granulares
- ✅ Autenticación con 2FA (Two-Factor Authentication)
- ✅ Expedientes digitales de empleados con documentos tipados

### 📢 Sistema de Notificaciones y Comunicación

- ✅ Centro de notificaciones publicables
- ✅ Tipos de notificación: avisos, noticias, artículos, mensajes
- ✅ Prioridades: normal, importante, urgente
- ✅ Notificaciones del sistema (polimórficas)
- ✅ Marca de lectura/no leído

### 📅 Calendario de Eventos

- ✅ Calendario interactivo de eventos
- ✅ Tipos de eventos: cumpleaños, festivos, campañas, lanzamientos
- ✅ Búsqueda dinámica por año/mes
- ✅ Rango de fechas customizable

### 🏪 Gestión Empresarial

- ✅ Gestión de tiendas/sucursales con geolocalización (lat/lng)
- ✅ Organización por departamentos y empresas
- ✅ Gestión de marcas
- ✅ Información de ubicación completa (dirección, ciudad, código postal, estado)

### 💼 Gestión de RRHH

- ✅ Carga y procesamiento de archivos de nómina (ZIP)
- ✅ Seguimiento de estado de nóminas
- ✅ Historial de pagos por usuario
- ✅ Sistema de re-intentos para procesos fallidos

### 📁 Gestión de Procesos y Documentos

- ✅ Árbol de carpetas de procesos y documentación
- ✅ Carga y gestión de archivos
- ✅ Búsqueda de documentos
- ✅ Previews de archivos

### ⚙️ Configuración y Administración

- ✅ Gestión de roles y permisos (Spatie Permission)
- ✅ Identidad corporativa customizable
- ✅ Configuración de perfil y privacidad
- ✅ Cambio de contraseña seguro
- ✅ Autenticación de dos factores

---

## 🛠️ Tech Stack

### Backend

| Tecnología            | Versión | Propósito                |
| --------------------- | ------- | ------------------------ |
| **Laravel**           | 11      | Framework web full-stack |
| **PHP**               | 8.3     | Lenguaje de programación |
| **MySQL**             | 8.0+    | Base de datos relacional |
| **Redis**             | 7.0+    | Caché y sesiones         |
| **Laravel Fortify**   | —       | Autenticación y 2FA      |
| **Spatie Permission** | —       | Roles y permisos         |

### Frontend

| Tecnología      | Versión | Propósito                     |
| --------------- | ------- | ----------------------------- |
| **React**       | 18      | Librería UI                   |
| **TypeScript**  | 5       | Tipado estático               |
| **Inertia.js**  | —       | Comunicación frontend-backend |
| **Vite**        | 5       | Build tool                    |
| **TailwindCSS** | —       | Estilos CSS                   |

### DevTools

| Herramienta      | Propósito                   |
| ---------------- | --------------------------- |
| **Pest PHP**     | Testing en PHP              |
| **Biome**        | Linting y formatting        |
| **PHPStan**      | Análisis estático de código |
| **Laravel Pint** | PHP style fixer             |

---

## ⚙️ Requisitos

- **PHP** ≥ 8.3
- **Composer** ≥ 2.0
- **Node.js** ≥ 18
- **npm** o **yarn** (para dependencias frontend)
- **MySQL** ≥ 8.0 o compatible
- **Redis** (para caché y sesiones)
- **Git** (para control de versiones)

---

## 📦 Instalación

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/tuorganizacion/intranet-lob.git
cd IntranetLOB
```

### 2️⃣ Instalar dependencias PHP

```bash
composer install
```

### 3️⃣ Instalar dependencias Node.js

```bash
npm install
```

### 4️⃣ Configurar variables de entorno

```bash
cp .env.example .env
php artisan key:generate
```

Edita `.env` con tus credenciales:

```env
APP_NAME="IntranetLOB"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=intranetlob
DB_USERNAME=root
DB_PASSWORD=

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_FROM_ADDRESS=noreply@intranetlob.local
MAIL_FROM_NAME="IntranetLOB"
```

### 5️⃣ Crear base de datos y migrar

```bash
mysql -u root -p -e "CREATE DATABASE intranetlob CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
php artisan migrate
php artisan db:seed
```

### 6️⃣ Generar enlace simbólico para storage

```bash
php artisan storage:link
```

### 7️⃣ Construir assets frontend

```bash
npm run build
```

### 8️⃣ Iniciar servidor de desarrollo

```bash
php artisan serve
# En otra terminal
npm run dev
```

Accede a: **http://localhost:8000**

---

## 📁 Estructura del Proyecto

```
IntranetLOB/
├── app/
│   ├── DTOs/                    # Data Transfer Objects (7)
│   ├── Services/                # Capa de lógica de negocio (10)
│   ├── Repositories/            # Acceso a datos
│   ├── Http/
│   │   ├── Controllers/         # 17 Controllers
│   │   ├── Requests/            # FormRequests de validación
│   │   └── Resources/           # API Resources
│   ├── Models/                  # Entidades (11)
│   ├── Policies/                # Authorization policies
│   ├── Jobs/                    # Queued jobs
│   └── Notifications/           # Clases de notificación
├── database/
│   ├── migrations/              # 20+ migraciones
│   ├── factories/               # Model factories
│   └── seeders/                 # Database seeders
├── resources/
│   ├── js/                      # Componentes React + TypeScript
│   ├── views/                   # Vistas Blade
│   └── css/                     # Estilos globales
├── routes/
│   ├── web.php                  # Rutas principales
│   ├── directory.php            # Rutas - Directorio
│   ├── rrhh.php                 # Rutas - RRHH
│   ├── settings.php             # Rutas - Configuración
│   └── console.php              # Comandos CLI
├── storage/
│   └── app/
│       └── public/              # Archivos públicos (nóminas, documentos)
├── ARCHITECTURE.md              # 📚 Guía de arquitectura
├── MIGRATION_GUIDE.md           # 📚 Guía de refactorización
├── IMPLEMENTATION_SUMMARY.md    # 📚 Resumen de implementación
└── composer.json & package.json # Dependencias
```

---

## 📚 Documentación

| Documento                                                    | Contenido                                                                      |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)**                     | Arquitectura de Services, DTOs, Repositories, Controllers y patrones de diseño |
| **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)**               | Guía paso a paso para refactorizar controllers legacy al patrón Service + DTO  |
| **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** | Resumen ejecutivo de todas las features implementadas                          |

### Leer primero:

1. 👉 **ARCHITECTURE.md** - Entender la estructura
2. 👉 **IMPLEMENTATION_SUMMARY.md** - Ver qué está implementado
3. 👉 **MIGRATION_GUIDE.md** - Cómo extender el proyecto

---

## 🔧 API y Servicios

### Servicios Principales (10)

```php
UserService              // Gestión de usuarios
StoreService            // Tiendas y sucursales
DepartmentService       // Departamentos
EventService            // Calendario de eventos
NotificationService     // Notificaciones
BrandService            // Marcas
CompanyService          // Empresas
EmployeeFileService     // Expedientes digitales
ProcessService          // Procesos y documentos
CacheService            // Caché centralizada
```

### Controllers (17)

**Autenticación:**

- `ProcessController` - Gestión de procesos

**Directorio:**

- `UserController` - Usuarios y directorio corporativo
- `StoreController` - Tiendas/sucursales
- `IdentityContentController` - Identidad corporativa

**RRHH:**

- `DepartmentController` - Departamentos
- `CompanyController` - Empresas
- `PayRollController` - Nóminas
- `EmployeeFileController` - Expedientes

**Contenido:**

- `DashboardController` - Dashboard personalizado
- `EventController` - Calendario
- `NotificationController` - Notificaciones

**Admin:**

- `BrandController` - Marcas
- `RoleController` - Roles (SA only)
- `PermissionController` - Permisos (SA only)

**Configuración de Usuario:**

- `Settings/ProfileController` - Perfil
- `Settings/PasswordController` - Cambio de contraseña
- `Settings/TwoFactorAuthenticationController` - 2FA

### Rutas Principales

```
GET    /dashboard                      # Dashboard
GET    /directory/users               # Listado de usuarios
POST   /directory/users               # Crear usuario
PUT    /directory/users/{user}        # Actualizar usuario
DELETE /directory/users/{user}        # Eliminar usuario

GET    /directory/shops               # Listado de tiendas
POST   /directory/shops               # Crear tienda

GET    /rrhh/departament              # Departamentos
GET    /rrhh/company                  # Empresas
GET    /rrhh/payroll                  # Nóminas
GET    /rrhh/payroll/{id}             # Detalle nómina

GET    /events                        # Calendario
GET    /notifications                 # Notificaciones
GET    /processes                     # Procesos

GET    /settings/profile              # Perfil usuario
PUT    /settings/password             # Cambio contraseña
```

---

## 🔐 Seguridad

### Autenticación

- ✅ Email + Password
- ✅ Two-Factor Authentication (2FA)
- ✅ Remember me tokens

### Autorización

- ✅ Role-based Access Control (RBAC)
- ✅ Spatie Permission integrado
- ✅ Policies por modelo
- ✅ Middleware de roles

### Política de Datos

- ✅ Soft deletes para datos críticos
- ✅ Validación en FormRequests
- ✅ Sanitización de inputs
- ✅ CSRF protection

---

## 🧪 Testing

Ejecutar tests:

```bash
# Tests unitarios
php artisan test

# Con cobertura
php artisan test --coverage

# Tests específicos
php artisan test tests/Feature/UserControllerTest.php
```

---

## 📈 Performance

- ✅ **Caché Redis** para queries frecuentes
- ✅ **Eager loading** de relaciones en Services
- ✅ **Índices de BD** para búsquedas
- ✅ **Paginación** por defecto (10 items)
- ✅ **Compresión** de assets frontend

---

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Estándares de Código

- PHP: PSR-12 (Laravel Pint)
- TypeScript: ESLint + Prettier (via Biome)
- Commits: Conventional Commits

---

## 📝 Licencia

Este proyecto está bajo licencia [MIT](LICENSE).

---

## 📞 Soporte

Para reportar bugs o sugerencias:

- GitHub Issues: [aquí](https://github.com/tu-repo/issues)
- Email: soporte@intranetlob.local

---

## 🙏 Agradecimientos

Construido con amor ❤️ usando:

- [Laravel](https://laravel.com)
- [Inertia.js](https://inertiajs.com/)
- [React](https://react.dev)
- [TailwindCSS](https://tailwindcss.com)

**Versión:** 1.0.0 | **Última actualización:** Abril 2026
