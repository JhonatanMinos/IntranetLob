<?php

/**
 * @OA\OpenApi(
 *     @OA\Info(
 *         version="1.0.0",
 *         title="IntranetLOB API",
 *         description="API RESTful completa para IntranetLOB - Plataforma empresarial integral",
 *         contact=@OA\Contact(
 *             name="Equipo de Desarrollo",
 *             email="api-support@intranetlob.local"
 *         ),
 *         license=@OA\License(
 *             name="MIT",
 *             url="https://opensource.org/licenses/MIT"
 *         )
 *     ),
 *     servers={
 *         @OA\Server(url="http://localhost:8000", description="Local Development"),
 *         @OA\Server(url="https://intranetlob.local", description="Production")
 *     }
 * )
 */

/**
 * @OA\SecurityScheme(
 *     type="http",
 *     scheme="bearer",
 *     securityScheme="bearerAuth",
 *     description="Bearer token para autenticación API"
 * )
 */

/**
 * @OA\SecurityScheme(
 *     type="apiKey",
 *     in="cookie",
 *     name="laravel_session",
 *     securityScheme="session",
 *     description="Session-based authentication (para Inertia.js)"
 * )
 */

// ============================================================
// SCHEMAS (DTOs)
// ============================================================

/**
 * @OA\Schema(
 *     schema="User",
 *     type="object",
 *     title="User",
 *     description="Data Transfer Object de Usuario",
 *     @OA\Property(property="id", type="integer", description="ID único"),
 *     @OA\Property(property="name", type="string", description="Nombre completo"),
 *     @OA\Property(property="email", type="string", format="email", description="Email único"),
 *     @OA\Property(property="employeeNumber", type="string", nullable=true, description="Número de empleado"),
 *     @OA\Property(property="position", type="string", nullable=true, description="Puesto/Cargo"),
 *     @OA\Property(property="phone", type="string", nullable=true, description="Teléfono"),
 *     @OA\Property(property="birthday", type="string", format="date", nullable=true, description="Cumpleaños (Y-m-d)"),
 *     @OA\Property(property="dateEntry", type="string", format="date", nullable=true, description="Fecha de ingreso (Y-m-d)"),
 *     @OA\Property(property="departmentId", type="integer", nullable=true, description="ID del departamento"),
 *     @OA\Property(property="departmentName", type="string", nullable=true, description="Nombre del departamento"),
 *     @OA\Property(property="companyId", type="integer", nullable=true, description="ID de la empresa"),
 *     @OA\Property(property="companyName", type="string", nullable=true, description="Nombre de la empresa"),
 *     @OA\Property(property="storeId", type="integer", nullable=true, description="ID de la tienda"),
 *     @OA\Property(property="storeName", type="string", nullable=true, description="Nombre de la tienda"),
 *     @OA\Property(property="roles", type="array", @OA\Items(type="string"), nullable=true, description="Array de roles"),
 *     @OA\Property(property="emailVerifiedAt", type="string", format="date-time", nullable=true, description="Fecha de verificación de email"),
 *     @OA\Property(property="createdAt", type="string", format="date-time", description="Fecha de creación"),
 *     @OA\Property(property="updatedAt", type="string", format="date-time", description="Fecha de actualización")
 * )
 */

/**
 * @OA\Schema(
 *     schema="Store",
 *     type="object",
 *     title="Store",
 *     description="Data Transfer Object de Tienda",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="name", type="string"),
 *     @OA\Property(property="code", type="string"),
 *     @OA\Property(property="type", type="string"),
 *     @OA\Property(property="address", type="string"),
 *     @OA\Property(property="neighborhood", type="string"),
 *     @OA\Property(property="city", type="string"),
 *     @OA\Property(property="postalCode", type="string"),
 *     @OA\Property(property="state", type="string"),
 *     @OA\Property(property="brandId", type="integer", nullable=true),
 *     @OA\Property(property="brandName", type="string", nullable=true),
 *     @OA\Property(property="phone", type="string", nullable=true),
 *     @OA\Property(property="email", type="string", format="email", nullable=true),
 *     @OA\Property(property="lat", type="number", format="float", nullable=true, description="Latitud"),
 *     @OA\Property(property="lng", type="number", format="float", nullable=true, description="Longitud"),
 *     @OA\Property(property="createdAt", type="string", format="date-time"),
 *     @OA\Property(property="updatedAt", type="string", format="date-time")
 * )
 */

/**
 * @OA\Schema(
 *     schema="Notification",
 *     type="object",
 *     title="Notification",
 *     description="Data Transfer Object de Notificación",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="title", type="string"),
 *     @OA\Property(property="subject", type="string"),
 *     @OA\Property(property="content", type="string"),
 *     @OA\Property(property="imagenPath", type="string", nullable=true),
 *     @OA\Property(property="priority", type="string", enum={"normal", "importante", "urgente"}),
 *     @OA\Property(property="type", type="string", enum={"aviso", "noticia", "articulo", "mensaje"}),
 *     @OA\Property(property="createdBy", type="integer"),
 *     @OA\Property(property="creatorName", type="string", nullable=true),
 *     @OA\Property(property="publishedAt", type="string", format="date-time", nullable=true),
 *     @OA\Property(property="createdAt", type="string", format="date-time"),
 *     @OA\Property(property="updatedAt", type="string", format="date-time")
 * )
 */

/**
 * @OA\Schema(
 *     schema="Event",
 *     type="object",
 *     title="Event",
 *     description="Data Transfer Object de Evento",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="title", type="string"),
 *     @OA\Property(property="type", type="string", enum={"cumpleanos", "festivo", "campaña", "lanzamiento", "evento"}),
 *     @OA\Property(property="startDate", type="string", format="date", description="Fecha inicio (Y-m-d)"),
 *     @OA\Property(property="endDate", type="string", format="date", nullable=true, description="Fecha fin (Y-m-d)"),
 *     @OA\Property(property="allDay", type="boolean"),
 *     @OA\Property(property="createdAt", type="string", format="date-time"),
 *     @OA\Property(property="updatedAt", type="string", format="date-time")
 * )
 */

/**
 * @OA\Schema(
 *     schema="Department",
 *     type="object",
 *     title="Department",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="name", type="string"),
 *     @OA\Property(property="description", type="string", nullable=true),
 *     @OA\Property(property="createdAt", type="string", format="date-time"),
 *     @OA\Property(property="updatedAt", type="string", format="date-time")
 * )
 */

/**
 * @OA\Schema(
 *     schema="Brand",
 *     type="object",
 *     title="Brand",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="name", type="string"),
 *     @OA\Property(property="slug", type="string"),
 *     @OA\Property(property="description", type="string", nullable=true),
 *     @OA\Property(property="createdAt", type="string", format="date-time"),
 *     @OA\Property(property="updatedAt", type="string", format="date-time")
 * )
 */

/**
 * @OA\Schema(
 *     schema="Company",
 *     type="object",
 *     title="Company",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="name", type="string"),
 *     @OA\Property(property="createdAt", type="string", format="date-time"),
 *     @OA\Property(property="updatedAt", type="string", format="date-time")
 * )
 */

/**
 * @OA\Schema(
 *     schema="Pagination",
 *     type="object",
 *     title="Pagination",
 *     @OA\Property(property="current_page", type="integer"),
 *     @OA\Property(property="from", type="integer"),
 *     @OA\Property(property="last_page", type="integer"),
 *     @OA\Property(property="per_page", type="integer"),
 *     @OA\Property(property="to", type="integer"),
 *     @OA\Property(property="total", type="integer")
 * )
 */

/**
 * @OA\Schema(
 *     schema="Error",
 *     type="object",
 *     title="Error",
 *     @OA\Property(property="message", type="string"),
 *     @OA\Property(property="code", type="integer"),
 *     @OA\Property(property="errors", type="object", additionalProperties=@OA\Items(type="array", @OA\Items(type="string")))
 * )
 */

// ============================================================
// AUTHENTICATION ENDPOINTS
// ============================================================

/**
 * @OA\Post(
 *     path="/login",
 *     tags={"Authentication"},
 *     summary="Login de usuario",
 *     description="Realiza login con email y contraseña. Requiere sesión o retorna token.",
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"email", "password"},
 *             @OA\Property(property="email", type="string", format="email", example="user@example.com"),
 *             @OA\Property(property="password", type="string", format="password", example="password123"),
 *             @OA\Property(property="remember", type="boolean", example=false)
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Login exitoso",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Login successful"),
 *             @OA\Property(property="user", ref="#/components/schemas/User"),
 *             @OA\Property(property="token", type="string", nullable=true, description="Bearer token (si se requiere)")
 *         )
 *     ),
 *     @OA\Response(response=401, description="Credenciales inválidas")
 * )
 */

/**
 * @OA\Post(
 *     path="/logout",
 *     tags={"Authentication"},
 *     summary="Logout de usuario",
 *     security={{"session": {}}},
 *     @OA\Response(response=200, description="Logout exitoso")
 * )
 */

// ============================================================
// USERS ENDPOINTS
// ============================================================

/**
 * @OA\Get(
 *     path="/api/users",
 *     tags={"Users"},
 *     summary="Listar usuarios",
 *     description="Obtiene lista paginada de usuarios con búsqueda opcional",
 *     security={{"bearerAuth": {}, "session": {}}},
 *     @OA\Parameter(
 *         name="search",
 *         in="query",
 *         description="Buscar por nombre, email o número de empleado",
 *         required=false,
 *         @OA\Schema(type="string")
 *     ),
 *     @OA\Parameter(
 *         name="page",
 *         in="query",
 *         description="Número de página",
 *         required=false,
 *         @OA\Schema(type="integer", default=1)
 *     ),
 *     @OA\Parameter(
 *         name="per_page",
 *         in="query",
 *         description="Items por página",
 *         required=false,
 *         @OA\Schema(type="integer", default=10)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Lista de usuarios",
 *         @OA\JsonContent(
 *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/User")),
 *             @OA\Property(property="meta", ref="#/components/schemas/Pagination"),
 *             @OA\Property(property="links", type="object")
 *         )
 *     ),
 *     @OA\Response(response=401, description="No autenticado")
 * )
 */

/**
 * @OA\Get(
 *     path="/api/users/{id}",
 *     tags={"Users"},
 *     summary="Obtener usuario por ID",
 *     security={{"bearerAuth": {}, "session": {}}},
 *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\Response(
 *         response=200,
 *         description="Datos del usuario",
 *         @OA\JsonContent(@OA\Property(property="data", ref="#/components/schemas/User"))
 *     ),
 *     @OA\Response(response=404, description="Usuario no encontrado")
 * )
 */

/**
 * @OA\Post(
 *     path="/api/users",
 *     tags={"Users"},
 *     summary="Crear nuevo usuario",
 *     security={{"bearerAuth": {}, "session": {}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"name", "email", "password", "department_id"},
 *             @OA\Property(property="name", type="string"),
 *             @OA\Property(property="email", type="string", format="email"),
 *             @OA\Property(property="password", type="string", format="password"),
 *             @OA\Property(property="password_confirmation", type="string", format="password"),
 *             @OA\Property(property="employeeNumber", type="string", nullable=true),
 *             @OA\Property(property="position", type="string", nullable=true),
 *             @OA\Property(property="department_id", type="integer"),
 *             @OA\Property(property="company_id", type="integer", nullable=true),
 *             @OA\Property(property="store_id", type="integer", nullable=true)
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Usuario creado",
 *         @OA\JsonContent(
 *             @OA\Property(property="data", ref="#/components/schemas/User"),
 *             @OA\Property(property="message", type="string")
 *         )
 *     ),
 *     @OA\Response(response=422, description="Validación falló")
 * )
 */

/**
 * @OA\Put(
 *     path="/api/users/{id}",
 *     tags={"Users"},
 *     summary="Actualizar usuario",
 *     security={{"bearerAuth": {}, "session": {}}},
 *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="name", type="string", nullable=true),
 *             @OA\Property(property="email", type="string", format="email", nullable=true),
 *             @OA\Property(property="position", type="string", nullable=true),
 *             @OA\Property(property="phone", type="string", nullable=true),
 *             @OA\Property(property="department_id", type="integer", nullable=true),
 *             @OA\Property(property="company_id", type="integer", nullable=true),
 *             @OA\Property(property="store_id", type="integer", nullable=true)
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Usuario actualizado",
 *         @OA\JsonContent(
 *             @OA\Property(property="data", ref="#/components/schemas/User"),
 *             @OA\Property(property="message", type="string")
 *         )
 *     )
 * )
 */

/**
 * @OA\Delete(
 *     path="/api/users/{id}",
 *     tags={"Users"},
 *     summary="Eliminar usuario",
 *     security={{"bearerAuth": {}, "session": {}}},
 *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\Response(response=200, description="Usuario eliminado"),
 *     @OA\Response(response=403, description="Sin permisos")
 * )
 */

/**
 * @OA\Post(
 *     path="/api/users/{id}/assign-role",
 *     tags={"Users"},
 *     summary="Asignar rol a usuario",
 *     security={{"bearerAuth": {}, "session": {}}},
 *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="role_id", type="string", example="rh")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Rol asignado",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string"),
 *             @OA\Property(property="roles", type="array", @OA\Items(type="string"))
 *         )
 *     )
 * )
 */

// ============================================================
// STORES ENDPOINTS
// ============================================================

/**
 * @OA\Get(
 *     path="/api/stores",
 *     tags={"Stores"},
 *     summary="Listar tiendas",
 *     security={{"bearerAuth": {}, "session": {}}},
 *     @OA\Parameter(name="search", in="query", @OA\Schema(type="string")),
 *     @OA\Parameter(name="brand_id", in="query", @OA\Schema(type="integer")),
 *     @OA\Parameter(name="city", in="query", @OA\Schema(type="string")),
 *     @OA\Parameter(name="page", in="query", @OA\Schema(type="integer")),
 *     @OA\Response(
 *         response=200,
 *         description="Lista de tiendas",
 *         @OA\JsonContent(
 *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Store")),
 *             @OA\Property(property="meta", ref="#/components/schemas/Pagination")
 *         )
 *     )
 * )
 */

/**
 * @OA\Post(
 *     path="/api/stores",
 *     tags={"Stores"},
 *     summary="Crear tienda",
 *     security={{"bearerAuth": {}, "session": {}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"name", "code", "city"},
 *             @OA\Property(property="name", type="string"),
 *             @OA\Property(property="code", type="string"),
 *             @OA\Property(property="type", type="string"),
 *             @OA\Property(property="address", type="string"),
 *             @OA\Property(property="city", type="string"),
 *             @OA\Property(property="brand_id", type="integer", nullable=true),
 *             @OA\Property(property="lat", type="number", format="float", nullable=true),
 *             @OA\Property(property="lng", type="number", format="float", nullable=true)
 *         )
 *     ),
 *     @OA\Response(response=201, description="Tienda creada")
 * )
 */

// ============================================================
// NOTIFICATIONS ENDPOINTS
// ============================================================

/**
 * @OA\Get(
 *     path="/api/notifications",
 *     tags={"Notifications"},
 *     summary="Listar notificaciones",
 *     security={{"bearerAuth": {}, "session": {}}},
 *     @OA\Parameter(name="type", in="query", @OA\Schema(type="string", enum={"aviso", "noticia", "articulo", "mensaje"})),
 *     @OA\Parameter(name="priority", in="query", @OA\Schema(type="string", enum={"normal", "importante", "urgente"})),
 *     @OA\Parameter(name="page", in="query", @OA\Schema(type="integer")),
 *     @OA\Response(
 *         response=200,
 *         description="Lista de notificaciones",
 *         @OA\JsonContent(
 *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Notification")),
 *             @OA\Property(property="meta", ref="#/components/schemas/Pagination")
 *         )
 *     )
 * )
 */

/**
 * @OA\Post(
 *     path="/api/notifications",
 *     tags={"Notifications"},
 *     summary="Crear notificación",
 *     security={{"bearerAuth": {}, "session": {}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"title", "content", "type", "priority"},
 *             @OA\Property(property="title", type="string"),
 *             @OA\Property(property="subject", type="string", nullable=true),
 *             @OA\Property(property="content", type="string"),
 *             @OA\Property(property="type", type="string", enum={"aviso", "noticia", "articulo", "mensaje"}),
 *             @OA\Property(property="priority", type="string", enum={"normal", "importante", "urgente"})
 *         )
 *     ),
 *     @OA\Response(response=201, description="Notificación creada")
 * )
 */

/**
 * @OA\Post(
 *     path="/api/notifications/{id}/publish",
 *     tags={"Notifications"},
 *     summary="Publicar notificación",
 *     security={{"bearerAuth": {}, "session": {}}},
 *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\Response(response=200, description="Notificación publicada")
 * )
 */

// ============================================================
// EVENTS ENDPOINTS
// ============================================================

/**
 * @OA\Get(
 *     path="/api/events",
 *     tags={"Events"},
 *     summary="Listar eventos",
 *     security={{"bearerAuth": {}, "session": {}}},
 *     @OA\Parameter(name="year", in="query", @OA\Schema(type="integer"), description="Dinámico, no hardcodeado"),
 *     @OA\Parameter(name="month", in="query", @OA\Schema(type="integer", minimum=1, maximum=12)),
 *     @OA\Parameter(name="type", in="query", @OA\Schema(type="string")),
 *     @OA\Response(
 *         response=200,
 *         description="Lista de eventos",
 *         @OA\JsonContent(
 *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Event")),
 *             @OA\Property(property="meta", ref="#/components/schemas/Pagination")
 *         )
 *     )
 * )
 */

/**
 * @OA\Post(
 *     path="/api/events",
 *     tags={"Events"},
 *     summary="Crear evento",
 *     security={{"bearerAuth": {}, "session": {}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"title", "type", "startDate"},
 *             @OA\Property(property="title", type="string"),
 *             @OA\Property(property="type", type="string", enum={"cumpleanos", "festivo", "campaña", "lanzamiento", "evento"}),
 *             @OA\Property(property="startDate", type="string", format="date"),
 *             @OA\Property(property="endDate", type="string", format="date", nullable=true),
 *             @OA\Property(property="allDay", type="boolean")
 *         )
 *     ),
 *     @OA\Response(response=201, description="Evento creado")
 * )
 */

// ============================================================
// DEPARTMENTS ENDPOINTS
// ============================================================

/**
 * @OA\Get(
 *     path="/api/departments",
 *     tags={"Departments"},
 *     summary="Listar departamentos",
 *     security={{"bearerAuth": {}, "session": {}}},
 *     @OA\Response(
 *         response=200,
 *         description="Lista de departamentos",
 *         @OA\JsonContent(
 *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Department"))
 *         )
 *     )
 * )
 */

/**
 * @OA\Post(
 *     path="/api/departments",
 *     tags={"Departments"},
 *     summary="Crear departamento",
 *     security={{"bearerAuth": {}, "session": {}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"name"},
 *             @OA\Property(property="name", type="string"),
 *             @OA\Property(property="description", type="string", nullable=true)
 *         )
 *     ),
 *     @OA\Response(response=201, description="Departamento creado")
 * )
 */
