import { z } from 'zod';

export const baseStoreSchema = z.object({
    name: z.string().min(1, 'El nombre es obligatorio'),
    code: z.string().min(1, 'El código es obligatorio'),
    type: z.string().min(1, 'El tipo es obligatorio'),
    address: z.string().min(1, 'La dirección es obligatoria'),
    neighborhood: z.string().min(1, 'El barrio es obligatorio'),
    city: z.string().min(1, 'La ciudad es obligatoria'),
    postalCode: z.string().min(1, 'El código postal es obligatorio'),
});

export const createStoreSchema = baseStoreSchema;

export const updateStoreSchema = baseStoreSchema;