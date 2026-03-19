import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Progress } from '@/components/ui/progress';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Department } from '@/types';
import { SquarePen, Trash2Icon } from 'lucide-react';

interface DeparmentProps {
    userAll: number;
    onDelete: (item: Department) => void;
}
export function getDeparmentColumns({ userAll, onDelete }) {
    return [
        {
            cell: ({ row }) => (
                <div className="font-semibold">{row.original.name}</div>
            ),
            id: 'name',
            header: 'Departamentos',
        },
        {
            id: 'users',
            header: 'Total de empleados',
            cell: ({ row }) => {
                const total = row.original.users.length;
                const percent = Math.round((total / userAll) * 100);
                return (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Field className="w-full max-w-sm">
                                <FieldLabel className="progress-upload">
                                    <Progress
                                        value={percent}
                                        id="progress-upload"
                                    />
                                    <span className="ml-auto">{percent} %</span>
                                </FieldLabel>
                            </Field>
                        </TooltipTrigger>
                        <TooltipContent>
                            Usuarios del departmento {total}
                        </TooltipContent>
                    </Tooltip>
                );
            },
        },
        {
            header: '',
            id: 'actions',
            cell: ({ row }) => {
                const department = row.original;
                return (
                    <div className="flex flex-row gap-4">
                        <Button size="icon" variant="outline">
                            <SquarePen />
                        </Button>
                        <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => onDelete?.(department)}
                        >
                            <Trash2Icon />
                        </Button>
                    </div>
                );
            },
        },
    ];
}
