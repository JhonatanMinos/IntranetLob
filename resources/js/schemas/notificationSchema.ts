import { z } from 'zod';

export const notificationSchema = z.object({
    title: z.string().min(1, 'El titulo es obligatorio'),
    subject: z.string().optional(),
    content: z.string().min(1, 'El contenido es obligatorio'),
    imagenPath: z.union([z.instanceof(File), z.string(), z.null()]).optional(),
    priority: z
        .string()
        .refine(
            (val) => ['normal', 'importante', 'urgente'].includes(val),
            'Selecciona una prioridad',
        ),
    type: z
        .string()
        .refine(
            (val) =>
                ['adn', 'beneficios', 'colaboradores', 'aviso'].includes(val),
            'Selecciona un tipo',
        ),
    published_at: z.string().min(1, 'La fecha de publicacion es obligatorio'),
});
