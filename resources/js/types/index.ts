export type * from './auth';
export type * from './navigation';
export type * from './ui';

import type { Auth } from './auth';

/**
 * Datos compartidos a través de Inertia.js en todas las páginas
 */
export type SharedData = {
  name: string;
  auth: Auth;
  permissions?: string[];
  sidebarOpen: boolean;
  [key: string]: unknown;
};

/**
 * Datos del usuario autenticado
 */
export interface User {
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
  can: {
    update: boolean;
    delete: boolean;
  };
}

/**
 * Datos de sucursal/tienda
 */
export interface Store {
  id: number;
  name: string;
  code: string;
  type: string;
  address: string;
  neighborhood: string;
  city: string;
  postalCode: string;
  state: string;
  brandId?: number | null;
  brandName?: string | null;
  phone?: string | null;
  email?: string | null;
  lat?: number | null;
  lng?: number | null;
  createdAt?: string | null; // ISO 8601
  updatedAt?: string | null; // ISO 8601
  deletedAt?: string | null; // ISO 8601
}

/**
 * Datos de departamento
 */
export interface Department {
  id: number;
  name: string;
  description?: string | null;
  createdAt?: string | null; // ISO 8601
  updatedAt?: string | null; // ISO 8601
  deletedAt?: string | null; // ISO 8601
}

/**
 * Datos de marca
 */
export interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  createdAt?: string | null; // ISO 8601
  updatedAt?: string | null; // ISO 8601
  deletedAt?: string | null; // ISO 8601
}

/**
 * Datos de empresa
 */
export interface Company {
  id: number;
  name: string;
  createdAt?: string | null; // ISO 8601
  updatedAt?: string | null; // ISO 8601
  deletedAt?: string | null; // ISO 8601
}

/**
 * Notificación o comunicación a usuarios
 */
export interface Notification {
  id: number;
  title: string;
  subject: string;
  content: string;
  imagenPath: string;
  priority: 'normal' | 'importante' | 'urgente';
  type: 'aviso' | 'noticia' | 'articulo' | 'mensaje';
  createdBy: number;
  creatorName?: string | null;
  publishedAt?: string | null; // ISO 8601
  createdAt?: string | null; // ISO 8601
  updatedAt?: string | null; // ISO 8601
  deletedAt?: string | null; // ISO 8601
}

/**
 * Evento del calendario
 */
export interface Event {
  id: number;
  title: string;
  type: 'cumpleanos' | 'festivo' | 'campania' | 'lanzamiento' | 'evento';
  startDate: string; // Y-m-d format
  endDate?: string | null; // Y-m-d format
  allDay: boolean;
  createdAt?: string | null; // ISO 8601
  updatedAt?: string | null; // ISO 8601
  deletedAt?: string | null; // ISO 8601
}

/**
 * Tipos comunes compartidos
 */

/**
 * Modelo simple con id y nombre
 */
export interface SimpleModel {
  id?: number;
  name: string;
}

/**
 * Permisos de acceso en la aplicación
 */
export interface Permission {
  id: number;
  name: string;
  guardName: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Roles y permisos asignados a usuarios
 */
export interface Role {
  id: number;
  name: string;
  guardName: string;
  createdAt: string;
  updatedAt: string;
  permissions?: Permission[];
}

/**
 * Enlace de paginación en respuestas
 */
export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

/**
 * Respuesta paginada genérica del servidor
 */
export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}
