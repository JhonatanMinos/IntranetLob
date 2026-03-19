import { router } from '@inertiajs/react';
import { FileText, Upload } from 'lucide-react';
import { useState, useRef } from 'react';
import StatusBadge from './StatusBadge';
import type { Document, DocumentStatus } from '../types/employee-files';
import EmployeeFileController, {
    download,
} from '@/actions/App/Http/Controllers/EmployeeFileController';

function DocumentRow({
    docKey,
    label,
    description,
    doc,
    userId,
    employeeFile,
}: {
    docKey: string;
    label: string;
    description: string;
    doc: Document;
    userId: number;
    employeeFile: number;
}) {
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        router.put(
            EmployeeFileController.updateDocument({
                employeeFile: employeeFile,
            }).url,
            { type: docKey, document: file },
            {
                preserveScroll: true,
                forceFormData: true,
                onFinish: () => {
                    setUploading(false);
                    if (inputRef.current) inputRef.current.value = '';
                },
            },
        );
    };

    const fileName = doc.path ? doc.path.split('/').pop() : null;

    return (
        <div className="flex items-center justify-between gap-4 p-4">
            {/* Info */}
            <div className="min-w-0 flex-1">
                <p className="font-semibold">{label}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
                {doc.status === 'rejected' && doc.note && (
                    <p className="mt-1 text-xs text-red-500">{doc.note}</p>
                )}
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-3">
                {/* Archivo actual */}
                {fileName && doc.path && (
                    <a
                        href={
                            download({
                                employeeFile: employeeFile,
                                type: docKey,
                            }).url
                        }
                        target="_blank"
                        className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground"
                    >
                        <FileText className="h-3 w-3" />
                        {fileName}
                    </a>
                )}

                {/* Upload trigger — se sube al seleccionar */}
                <label
                    className={`flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs transition ${uploading ? 'cursor-not-allowed opacity-50' : 'hover:bg-muted'}`}
                >
                    <Upload className="h-3 w-3" />
                    {uploading
                        ? 'Subiendo...'
                        : doc.path
                          ? 'Reemplazar'
                          : 'Subir Archivo'}
                    <input
                        ref={inputRef}
                        type="file"
                        name="document"
                        accept=".pdf,.jpg,.docx"
                        className="hidden"
                        disabled={uploading}
                        onChange={handleChange}
                    />
                </label>
                <StatusBadge status={doc.status} />
            </div>
        </div>
    );
}

export default DocumentRow;
