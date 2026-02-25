export type * from './auth';
export type * from './navigation';
export type * from './ui';

import type { Auth } from './auth';

export type SharedData = {
  name: string;
  auth: Auth;
  permissions?: string[];
  sidebarOpen: boolean;
  [key: string]: unknown;
};

// ===================== User DTO =====================
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

// ===================== Store DTO =====================
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

// ===================== Department DTO =====================
export interface Department {
  id: number;
  name: string;
  description?: string | null;
  createdAt?: string | null; // ISO 8601
  updatedAt?: string | null; // ISO 8601
  deletedAt?: string | null; // ISO 8601
}

// ===================== Brand DTO =====================
export interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  createdAt?: string | null; // ISO 8601
  updatedAt?: string | null; // ISO 8601
  deletedAt?: string | null; // ISO 8601
}

// ===================== Company DTO =====================
export interface Company {
  id: number;
  name: string;
  createdAt?: string | null; // ISO 8601
  updatedAt?: string | null; // ISO 8601
  deletedAt?: string | null; // ISO 8601
}

// ===================== Notification DTO =====================
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

// ===================== Event DTO =====================
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

// ===================== Common Types =====================
export interface SimpleModel {
  id?: number;
  name: string;
}

export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  permissions?: Permission[];
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

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

// Legacy aliases for backwards compatibility
export type NotificationItem = Notification;
export type EventItem = Event;
export type paginatedResponse<T> = PaginatedResponse<T>;
