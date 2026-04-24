# 📚 Documentación API - IntranetLOB

**Versión:** 1.0.0  
**Última actualización:** Abril 23, 2026  
**Spec OpenAPI:** 3.0.0

---

## 📖 Tabla de Contenidos

- [Introducción](#-introducción)
- [Autenticación](#-autenticación)
- [Endpoints](#-endpoints)
- [Errores](#-errores)
- [Rate Limiting](#-rate-limiting)
- [Swagger UI](#-swagger-ui)
- [Ejemplos](#-ejemplos)

---

## 🚀 Introducción

IntranetLOB proporciona una **API RESTful completa** para todas sus operaciones. La API está documentada con **OpenAPI 3.0** y puede ser explorada a través de **Swagger UI**.

### Base URL

```
http://localhost:8000/api
```

### Características

- ✅ Respuestas **JSON consistentes**
- ✅ **DTOs tipados** en backend y TypeScript
- ✅ **Paginación** automática
- ✅ **Filtrado** y búsqueda
- ✅ **Autorización** granular con roles
- ✅ **Validación** de entrada

---

## 🔐 Autenticación

### Métodos Soportados

1. **Session-based** (Para Inertia.js)
2. **Bearer Token** (Para clientes API)
3. **Two-Factor Authentication** (2FA)

### Session-Based (Recomendado para Frontend)

```bash
# 1. Login
POST /login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

# Respuesta
HTTP/1.1 200 OK
Set-Cookie: XSRF-TOKEN=...; laravel_session=...

# 2. Las cookies se envían automáticamente en siguientes requests
GET /api/users
# Cookie: laravel_session=...
```

### Bearer Token (Para clientes API/Postman)

```bash
# 1. Obtener token (requiere endpoint personalizado)
POST /api/auth/token
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

# Respuesta
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

# 2. Usar token en siguientes requests
GET /api/users
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

### Two-Factor Authentication (2FA)

```bash
# Si el usuario tiene 2FA habilitado:
POST /login
{
  "email": "user@example.com",
  "password": "password123"
}

# Respuesta 401 (requiere 2FA)
{
  "message": "Two-factor authentication required",
  "code": 401
}

# Completar 2FA
POST /two-factor-challenge
{
  "code": "123456"
}
```

---

## 🔌 Endpoints

### Authentication

#### Login

```http
POST /login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Respuesta (200 OK):**

```json
{
    "message": "Login successful",
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "user@example.com",
        "roles": ["user"]
    }
}
```

#### Logout

```http
POST /logout
```

---

### Users (Directorio)

#### List Users (with search)

```http
GET /api/users?search=john&page=1
Authorization: Bearer {token}
```

**Parámetros Query:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `search` | string | Buscar por nombre, email o empleado |
| `page` | integer | Número de página (default: 1) |
| `per_page` | integer | Items por página (default: 10) |

**Respuesta (200 OK):**

```json
{
    "data": [
        {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "employeeNumber": "EMP001",
            "position": "Developer",
            "phone": "555-1234",
            "birthday": "1995-06-15",
            "dateEntry": "2023-01-15",
            "departmentId": 1,
            "departmentName": "Engineering",
            "companyId": 1,
            "companyName": "ACME Corp",
            "storeId": 1,
            "storeName": "HQ",
            "roles": ["user"],
            "createdAt": "2026-01-15T10:00:00Z",
            "updatedAt": "2026-04-20T15:30:00Z"
        }
    ],
    "links": {
        "first": "http://localhost:8000/api/users?page=1",
        "last": "http://localhost:8000/api/users?page=5",
        "prev": null,
        "next": "http://localhost:8000/api/users?page=2"
    },
    "meta": {
        "current_page": 1,
        "from": 1,
        "last_page": 5,
        "path": "http://localhost:8000/api/users",
        "per_page": 10,
        "to": 10,
        "total": 45
    }
}
```

#### Get Single User

```http
GET /api/users/{id}
Authorization: Bearer {token}
```

**Respuesta (200 OK):**

```json
{
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    ...
  }
}
```

#### Create User

```http
POST /api/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "SecurePass123!",
  "password_confirmation": "SecurePass123!",
  "employeeNumber": "EMP002",
  "position": "Designer",
  "phone": "555-5678",
  "birthday": "1998-03-20",
  "dateEntry": "2026-01-01",
  "department_id": 1,
  "company_id": 1,
  "store_id": 1
}
```

**Respuesta (201 Created):**

```json
{
  "data": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    ...
  },
  "message": "User created successfully"
}
```

#### Update User

```http
PUT /api/users/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane Smith Updated",
  "position": "Senior Designer",
  "phone": "555-9999"
}
```

**Respuesta (200 OK):**

```json
{
  "data": {
    "id": 2,
    "name": "Jane Smith Updated",
    ...
  },
  "message": "User updated successfully"
}
```

#### Delete User

```http
DELETE /api/users/{id}
Authorization: Bearer {token}
```

**Respuesta (200 OK):**

```json
{
    "message": "User deleted successfully"
}
```

#### Assign Role to User

```http
POST /api/users/{id}/assign-role
Authorization: Bearer {token}
Content-Type: application/json

{
  "role_id": "rh"
}
```

**Respuesta (200 OK):**

```json
{
    "message": "Role assigned successfully",
    "roles": ["user", "rh"]
}
```

---

### Stores (Tiendas)

#### List Stores

```http
GET /api/stores?search=&brand_id=&city=&page=1
Authorization: Bearer {token}
```

**Parámetros Query:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `search` | string | Buscar por nombre o código |
| `brand_id` | integer | Filtrar por marca |
| `city` | string | Filtrar por ciudad |

**Respuesta (200 OK):**

```json
{
  "data": [
    {
      "id": 1,
      "name": "HQ Store",
      "code": "STR001",
      "type": "Headquarters",
      "address": "123 Main St",
      "neighborhood": "Downtown",
      "city": "New York",
      "postalCode": "10001",
      "state": "NY",
      "brandId": 1,
      "brandName": "ACME",
      "phone": "555-0001",
      "email": "store@example.com",
      "lat": 40.7128,
      "lng": -74.0060,
      "createdAt": "2026-01-15T10:00:00Z",
      "updatedAt": "2026-04-20T15:30:00Z"
    }
  ],
  "meta": { ... }
}
```

#### Create Store

```http
POST /api/stores
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "New Store",
  "code": "STR002",
  "type": "Retail",
  "address": "456 Oak Ave",
  "neighborhood": "Midtown",
  "city": "New York",
  "postalCode": "10002",
  "state": "NY",
  "brand_id": 1,
  "phone": "555-0002",
  "email": "newstore@example.com",
  "lat": 40.7580,
  "lng": -73.9855
}
```

---

### Notifications (Notificaciones)

#### List Notifications

```http
GET /api/notifications?type=aviso&priority=urgente&page=1
Authorization: Bearer {token}
```

**Parámetros Query:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `type` | string | Filtrar por tipo (aviso, noticia, articulo, mensaje) |
| `priority` | string | Filtrar por prioridad (normal, importante, urgente) |
| `published` | boolean | Solo publicadas (true) |

**Respuesta (200 OK):**

```json
{
  "data": [
    {
      "id": 1,
      "title": "System Update",
      "subject": "Important maintenance",
      "content": "Please read carefully...",
      "imagenPath": "/storage/notifications/image.jpg",
      "priority": "urgente",
      "type": "aviso",
      "createdBy": 1,
      "creatorName": "Admin",
      "publishedAt": "2026-04-20T10:00:00Z",
      "createdAt": "2026-04-19T15:00:00Z",
      "updatedAt": "2026-04-20T10:00:00Z"
    }
  ],
  "meta": { ... }
}
```

#### Create Notification

```http
POST /api/notifications
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "title": "New Feature Release",
  "subject": "Version 2.0 is here",
  "content": "New features include...",
  "type": "noticia",
  "priority": "importante",
  "image": <file>
}
```

#### Publish Notification

```http
POST /api/notifications/{id}/publish
Authorization: Bearer {token}
```

**Respuesta (200 OK):**

```json
{
    "message": "Notification published",
    "publishedAt": "2026-04-23T10:00:00Z"
}
```

---

### Events (Calendario)

#### List Events by Year

```http
GET /api/events?year=2026&month=4&page=1
Authorization: Bearer {token}
```

**Parámetros Query:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `year` | integer | Año (dinámico, no hardcoded) |
| `month` | integer | Mes (1-12) |
| `type` | string | Filtrar por tipo |

**Respuesta (200 OK):**

```json
{
  "data": [
    {
      "id": 1,
      "title": "Team Birthday",
      "type": "cumpleanos",
      "startDate": "2026-04-25",
      "endDate": null,
      "allDay": true,
      "createdAt": "2026-01-15T10:00:00Z",
      "updatedAt": "2026-04-20T15:30:00Z"
    }
  ],
  "meta": { ... }
}
```

#### Create Event

```http
POST /api/events
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Company Holiday",
  "type": "festivo",
  "startDate": "2026-12-25",
  "endDate": "2026-12-26",
  "allDay": true
}
```

---

### Departments

#### List Departments

```http
GET /api/departments
Authorization: Bearer {token}
```

**Respuesta (200 OK):**

```json
{
    "data": [
        {
            "id": 1,
            "name": "Engineering",
            "description": "Software development team",
            "createdAt": "2026-01-15T10:00:00Z",
            "updatedAt": "2026-04-20T15:30:00Z"
        }
    ]
}
```

---

### Employee Files (Expedientes)

#### Get My Employee File

```http
GET /api/employee-files/me
Authorization: Bearer {token}
```

**Respuesta (200 OK):**

```json
{
    "data": {
        "id": 1,
        "userId": 1,
        "documents": {
            "curp": {
                "path": "/storage/employee-files/curp.pdf",
                "status": "approved",
                "note": "Valid document"
            },
            "rfc": {
                "path": null,
                "status": "pending",
                "note": null
            }
        },
        "createdAt": "2026-01-15T10:00:00Z",
        "updatedAt": "2026-04-20T15:30:00Z"
    }
}
```

#### Upload Document

```http
PUT /api/employee-files/me/document
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "type": "curp",
  "file": <file>
}
```

---

### Payroll (Nóminas)

#### List Payroll Files

```http
GET /api/payroll?status=processed&period=2026-04
Authorization: Bearer {token}
```

**Respuesta (200 OK):**

```json
{
  "data": [
    {
      "id": 1,
      "userId": 1,
      "userName": "John Doe",
      "filePath": "/storage/payroll/file.zip",
      "originalName": "payroll_202604.zip",
      "status": "processed",
      "createdAt": "2026-04-01T10:00:00Z"
    }
  ],
  "meta": { ... }
}
```

#### Upload Payroll File

```http
POST /api/payroll
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "user_id": 1,
  "file": <zip_file>
}
```

#### Get Payroll Status

```http
GET /api/payroll/{id}/status
Authorization: Bearer {token}
```

**Respuesta (200 OK):**

```json
{
    "status": "processing",
    "progress": 75,
    "message": "Extracting files..."
}
```

---

## ❌ Errores

Todos los errores siguen este formato:

```json
{
    "message": "Error description",
    "code": 400,
    "errors": {
        "email": ["Email already exists"],
        "password": ["Password must be at least 8 characters"]
    }
}
```

### Códigos de Error Comunes

| Código  | Significado          | Ejemplo                     |
| ------- | -------------------- | --------------------------- |
| **400** | Bad Request          | Validación falló            |
| **401** | Unauthorized         | No autenticado              |
| **403** | Forbidden            | Sin permisos                |
| **404** | Not Found            | Recurso no existe           |
| **409** | Conflict             | Email/código duplicado      |
| **422** | Unprocessable Entity | Validación de negocio falló |
| **500** | Server Error         | Error interno               |

### Ejemplo: Validación Falló (422)

```json
{
    "message": "The given data was invalid.",
    "errors": {
        "email": [
            "The email field is required.",
            "The email must be a valid email address."
        ],
        "password": ["The password must be at least 8 characters."]
    }
}
```

---

## 🚦 Rate Limiting

Las siguientes rutas tienen rate limiting:

| Ruta                     | Límite     | Ventana  |
| ------------------------ | ---------- | -------- |
| `POST /login`            | 5 intentos | 1 minuto |
| `POST /password/reset`   | 3 intentos | 1 hora   |
| `PUT /settings/password` | 6 intentos | 1 minuto |

**Respuesta (429 Too Many Requests):**

```json
{
    "message": "Too many attempts. Please try again in 60 seconds.",
    "retryAfter": 60
}
```

---

## 🎨 Swagger UI

### Acceder a Swagger UI

```
http://localhost:8000/api/documentation
```

### Características en Swagger UI

✅ Explorar todos los endpoints  
✅ Ver esquemas de request/response  
✅ Probar endpoints directamente  
✅ Autenticarse con Bearer Token  
✅ Ver códigos de respuesta  
✅ Descargar OpenAPI spec

### Usar Swagger UI

1. Navega a `http://localhost:8000/api/documentation`
2. Click en el botón "Authorize" (🔒)
3. Ingresa tu Bearer Token
4. Prueba cualquier endpoint

---

## 📝 Ejemplos

### JavaScript/Fetch

```javascript
// Login
const response = await fetch('http://localhost:8000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
        email: 'user@example.com',
        password: 'password123',
    }),
});

// Get Users
const users = await fetch('http://localhost:8000/api/users', {
    headers: { Authorization: 'Bearer TOKEN' },
});
const data = await users.json();
```

### cURL

```bash
# Login
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get Users with Bearer Token
curl -X GET http://localhost:8000/api/users \
  -H "Authorization: Bearer eyJ0eXAi..."

# Create User
curl -X POST http://localhost:8000/api/users \
  -H "Authorization: Bearer eyJ0eXAi..." \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Jane Doe",
    "email":"jane@example.com",
    "password":"SecurePass123!",
    "department_id":1
  }'
```

### Python

```python
import requests

# Login
response = requests.post('http://localhost:8000/login', json={
    'email': 'user@example.com',
    'password': 'password123'
})

# Get Users
headers = {'Authorization': f'Bearer {token}'}
users = requests.get('http://localhost:8000/api/users', headers=headers)
print(users.json())

# Create User
data = {
    'name': 'Jane Doe',
    'email': 'jane@example.com',
    'password': 'SecurePass123!',
    'department_id': 1
}
users = requests.post('http://localhost:8000/api/users',
                      headers=headers, json=data)
```

### Postman

1. Importar collection desde `http://localhost:8000/api/documentation/swagger.json`
2. Variables de entorno:
    ```json
    {
        "base_url": "http://localhost:8000",
        "token": "your_bearer_token"
    }
    ```
3. Pre-request script para auth automática:
    ```javascript
    // Ejecuta login automáticamente
    if (!pm.environment.get('token')) {
      pm.sendRequest({...}, (err, response) => {
        pm.environment.set('token', response.json().token);
      });
    }
    ```

---

## 🔄 Versionado de API

**Versión actual:** v1.0.0

Para futuras versiones:

- `GET /api/v2/users` - Nueva versión
- Backward compatibility mantenida
- Deprecated endpoints marcados con warning

---

## 📞 Soporte

Para reportar issues o sugerencias sobre la API:

- **Email:** api-support@intranetlob.local
- **GitHub Issues:** [aquí](https://github.com/tu-repo/issues)

---

**Última actualización:** Abril 23, 2026  
**Mantenido por:** Equipo de Desarrollo
