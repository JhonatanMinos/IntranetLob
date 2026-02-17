export type * from './auth';
export type * from './navigation';
export type * from './ui';

import type { Auth } from './auth';

export type SharedData = {
  name: string;
  auth: Auth;
  sidebarOpen: boolean;
  [key: string]: unknown;
};

export interface User {
  name?: string;
  email?: string;
  password?: string;
  employeeNumber?: string;
  position?: string;
  birthday?: string; // puedes cambiar a Date si lo manejas como objeto Date
  dateEntry?: string; // puedes cambiar a Date si lo manejas como objeto Date
  phone?: string;
}

export interface Company {
  name?: string;
  code?: string;
  brand?: string;
  type?: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  postal_code?: string;
  state?: string;
  phone?: string;
  email?: string;
  lat?: number;
  lng?: number;
}

export interface SimpleModel {
  name?: string;
}

export interface Role {
  id: string;
  name: string;
}
