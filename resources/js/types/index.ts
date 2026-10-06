export type * from './auth';
export type * from './navigation';
export type * from './ui';

import type { Auth } from './auth';

export type { PageProps } from '@inertiajs/core';

/**
 * Datos compartidos a través de Inertia.js en todas las páginas
 */
export type SharedData = {
  name: string;
  flash?: { success?: string; error?: string };
  auth: Auth;
  permissions?: string[];
  sidebarOpen: boolean;
  [key: string]: unknown;
};

/**
 * Datos del usuario autenticado
 */
export interface User {
  avatarPath?: string | null;
  avatar_path?: string | null;
  curp?: string | null;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
  two_factor_enabled?: boolean;
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
  roles?: Role[];
  emailVerifiedAt?: string | null; // ISO 8601
  createdAt?: string | null; // ISO 8601
  updatedAt?: string | null; // ISO 8601
  can?: {
    update: boolean;
    delete: boolean;
  };
}

/**
 * Datos de sucursal/tienda
 */
export interface Store {
  can: { update: boolean; delete: boolean };
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
  users: User[];
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
  type: 'adn' | 'beneficios' | 'colaboradores' | 'aviso';
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
  id: number;
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
export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  links: PaginationLink[];
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: { first: string | null; last: string | null; prev: string | null; next: string | null };
  meta: PaginationMeta;
}

export type EventItem = Event;
export type NotificationItem = Notification;
export interface priority {
  value: string;
  label: string;
  color: string;
  bg?: string;
}
export interface types {
  value: string;
  label: string;
  subtitle?: string;
}
export interface FolderNode {
  label: string;
  path: string;
  file?: string;
  url?: string;
  ext?: string;
  size?: string;
  children?: FolderNode[];
}
export interface DashboardEvent {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  type: Event['type'];
}
