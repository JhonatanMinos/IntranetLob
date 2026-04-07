import { z } from 'zod';

export const payrollUploadSchema = z
    .object({
        zip_file: z
            .instanceof(File, { message: 'El archivo ZIP es requerido.' })
            .refine(
                (file) =>
                    file.type === 'application/zip' ||
                    file.name.endsWith('.zip'),
                {
                    message: 'Solo se permiten archivos .zip.',
                },
            )
            .refine((file) => file.size <= 50 * 1024 * 1024, {
                message: 'El archivo no debe superar 50MB.',
            }),

        period_start: z.coerce.date({
            message: 'La fecha de inicio es requerida.',
        }),

        period_end: z.coerce.date({
            message: 'La fecha de fin es requerida.',
        }),

        period_type: z.enum(['semanal', 'quincenal', 'mensual'], {
            message: 'El tipo de periodo no es válido.',
        }),
    })
    .refine((data) => data.period_end >= data.period_start, {
        message: 'La fecha de fin debe ser posterior al inicio.',
        path: ['period_end'],
    });
