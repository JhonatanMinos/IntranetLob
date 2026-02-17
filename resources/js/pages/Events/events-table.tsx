import type { ColumnDef } from '@tanstack/react-table';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Trash, SquarePen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface Event {
    id: string;
    title: string;
    type: 'evento' | 'festivo' | 'lanzamiento';
    start_date: string;
    end_date: string;
}

interface EventsTableProps {
    data: Event[];
    onEdit?: (event: Event) => void;
    onDelete?: (event: Event) => void;
}

export function EventsTable({ data, onEdit, onDelete }: EventsTableProps) {
    const columns: ColumnDef<Event>[] = [
        {
            header: 'ID',
            accessorKey: 'id',
        },
        {
            header: 'Titulo',
            accessorKey: 'title',
        },
        {
            header: 'Fecha',
            accessorKey: 'start_date',
            cell: ({ getValue }) =>
                format(parseISO(getValue<string>()), 'dd MMM yyyy', {
                    locale: es,
                }),
        },
        {
            header: 'Tipo',
            accessorKey: 'type',
            cell: ({ getValue }) => {
                const type = getValue<string>();
                const colors = {
                    evento: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
                    festivo:
                        'bg-green-500/20 text-green-400 border-green-500/30',
                    lanzamiento:
                        'bg-purple-500/20 text-purple-400 border-purple-500/30',
                };
                return (
                    <span
                        className={`rounded-full border px-3 py-1 text-xs ${colors[type]}`}
                    >
                        {type}
                    </span>
                );
            },
        },
        {
            header: '',
            id: 'actions',
            cell: ({ row }) => {
                const event = row.original;
                return (
                    <div className="flex justify-center gap-2">
                        <Button
                            size="icon"
                            onClick={() => onEdit?.(event)}
                            variant="ghost"
                        >
                            <SquarePen />
                        </Button>
                        <Button
                            size="icon"
                            onClick={() => onDelete?.(event)}
                            variant="ghost"
                            className="text-red-400 hover:text-red-500"
                        >
                            <Trash />
                        </Button>
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="overflow-x-auto">
            <Table className="w-full table-auto border">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                            className="transition-colors hover:bg-white/5"
                            key={headerGroup.id}
                        >
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className="px-4 py-2 text-left"
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id} className="py-4">
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext(),
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
