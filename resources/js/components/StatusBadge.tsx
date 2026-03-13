import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import type { DocumentStatus } from '../types/employee-files';

function StatusBadge({ status }: { status: DocumentStatus }) {
    if (!status) return (
        <Badge variant="destructive" className="flex items-center gap-1 shrink-0">
            <AlertCircle className="h-3 w-3" /> Faltante
        </Badge>
    );
    if (status === 'approved') return (
        <Badge className="flex shrink-0 items-center gap-1 bg-green-500/10 text-green-500">
            <CheckCircle className="h-3 w-3" /> Aprobado
        </Badge>
    );
    if (status === 'pending') return (
        <Badge className="flex shrink-0 items-center gap-1 bg-yellow-500/10 text-yellow-500">
            <Clock className="h-3 w-3" /> Pendiente
        </Badge>
    );
    return (
        <Badge variant="destructive" className="flex shrink-0 items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Rechazado
        </Badge>
    );
}

export default StatusBadge;