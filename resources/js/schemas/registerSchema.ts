import { z } from 'zod';
import { passwordSchema } from '@/schemas/passwordSchema';

export const baseSchema = z.object({
    employeeNumber: z.coerce
        .number()
        .min(1, 'El número de empleado es obligatorio'),
    name: z.string().min(1, 'El nombre es obligatorio'),
    email: z.string().email('Email inválido'),
    password: passwordSchema,
    position: z.string().min(1, 'El puesto es obligatorio'),
    birthday: z.string().min(1, 'La fecha de nacimiento es obligatoria'),
    dateEntry: z.string().min(1, 'La fecha ingreso es obligatorio'),
    phone: z.string().min(3, 'Teléfono inválido'),
    department_id: z.string().min(1, 'Selecciona un departmento'),
    company_id: z.string().min(1, 'Selecciona una compañia'),
    store_id: z.string().optional(),
});

export const createUserSchema = baseSchema.extend({
    password: passwordSchema,
});

export const updateUserSchema = baseSchema.extend({
    password: passwordSchema.optional().or(z.literal('')),
});
