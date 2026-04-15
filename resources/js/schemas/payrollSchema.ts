import { z } from 'zod';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB en bytes
const ACCEPTED_PDF_TYPES = 'application/pdf';

export const payrollUploadSchema = z.object({
    file: z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, {
            message: 'El archivo no debe superar 100MB',
        })
        .refine((file) => file.type === ACCEPTED_PDF_TYPES, {
            message: 'El archivo debe ser PDF',
        })
        .refine((file) => file.name.endsWith('.pdf'), {
            message: 'El archivo debe tener extensión .pdf',
        }),
    user_id: z.string().optional(),
});
