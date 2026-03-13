import { SquarePen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface EmployeeColumnsProps {
    onEdit: (item: EmployeeFileItem) => void;
}

export function getEmployeeColumns({ onEdit }: EmployeeColumnsProps) {
    return [
        {
            accessorFn: (row) => row.user.name,
            id: 'name',
            header: 'colaborador',
        },
        {
            accessorFn: (row) => row.user.position,
            id: 'position',
            header: 'Puesto',
        },
        {
            id: 'documents',
            header: 'Progreso',
            cell: ({ row }) => {
                const documents = Object.values(row.original.documents ?? {});
                const completed = documents.filter(
                    (doc: any) => doc.status === 'approved',
                ).length;
                const total = documents.length;

                const percent = Math.round((completed / total) * 100);

                return (
                    <Field className="w-full max-w-sm">
                        <FieldLabel className="progress-upload">
                            <Progress value={percent} id="progress-upload" />
                            <span className="ml-auto">{percent} %</span>
                        </FieldLabel>
                    </Field>
                );
            },
        },
        {
            accessorKey: 'update',
            header: 'Fecha de actualizacion',
            cell: ({ row }) => {
                const dateValue = row.getValue('update');
                return (
                    <div>
                        {format(new Date(dateValue as string), 'dd-MM-yyyy', {
                            locale: es,
                        })}
                    </div>
                );
            },
        },
        {
            header: '',
            id: 'actions',
            cell: ({ row }) => {
                const employeeFiles = row.original;
                return (
                    <div>
                        <Button
                            size="icon"
                            onClick={() => onEdit?.(employeeFiles)}
                            variant="ghost"
                        >
                            <SquarePen />
                        </Button>
                    </div>
                );
            },
        },
    ];
}
