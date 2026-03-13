import StatusBadge from './StatusBadge';
import type { Document, DocumentStatus } from '../types/employee-files';
import EmployeeFileController, {
    download,
} from '@/actions/App/Http/Controllers/EmployeeFileController';
import {
    Select,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectContent,
    SelectValue,
    SelectGroup,
} from '@/components/ui/select';
import { FileText } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function DocumentRowStatus({
    docKey,
    label,
    description,
    doc,
    employeeFile,
}: {
    docKey: string;
    label: string;
    description: string;
    doc: Document;
    employeeFile: number;
}) {
    const fileName = doc.path ? doc.path.split('/').pop() : null;
    const handleStatusChange = (key: string, status: DocumentStatus) => {
        router.put(
            EmployeeFileController.updateStatus({
                employeeFile: employeeFile,
            }).url,
            { type: key, status: status },
            { preserveScroll: true },
        );
    };

    return (
        <div
            key={docKey}
            className="flex items-center justify-between gap-4 p-6"
        >
            <div className="min-w-0 flex-1">
                <p className="font-semibold">{label}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
                <p className="text-xs text-muted-foreground">{doc.note}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
                {doc.path && (
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
            </div>
            <StatusBadge status={doc.status} />
            <div>
                <Select
                    defaultValue={doc.status ?? ''}
                    onValueChange={(value) => handleStatusChange(docKey, value)}
                    className="w-50 rounded-md border bg-background px-2 py-1 text-xs"
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona un status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Status</SelectLabel>
                            <SelectItem value="pending">Pendiente</SelectItem>
                            <SelectItem value="approved">Aprobado</SelectItem>
                            <SelectItem value="rejected">Rechazado</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
