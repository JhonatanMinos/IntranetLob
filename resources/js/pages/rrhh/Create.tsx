import { zodResolver } from '@hookform/resolvers/zod';
import { Head } from '@inertiajs/react';
import { CloudUpload, FolderArchive } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { create, index } from '@/routes/payroll';
import { payrollUploadSchema } from '@/schemas/payrollSchema';
import type { BreadcrumbItem } from '@/types';

export default function CreatePayRoll() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Capital Humano', href: '/rrhh' },
        { title: 'Nomina', href: index().url },
        { title: 'Subir Nomina', href: create().url },
    ];

    const form = useForm({
        resolver: zodResolver(payrollUploadSchema),
        defaultValues: {
            period_start: '',
            period_end: '',
            period_type: '',
            zip_file: undefined,
        },
    });

    const onSubmit = (data: any) => {
        router.post(store().url, data, {
            forceFormData: true, // 🔥 necesario para archivos
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nomina" />
            <div className="flex flex-1 flex-col overflow-hidden">
                <div className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-9 p-4 sm:p-6"
                            id="CreatePayRoll"
                        >
                            <div>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Subir Nominas</CardTitle>
                                        <CardDescription>
                                            Carge los archivos de nomina
                                            prodesados para el periodo actual
                                        </CardDescription>
                                        <CardAction>
                                            <CloudUpload />
                                        </CardAction>
                                    </CardHeader>
                                    <CardContent>
                                        <FormField
                                            control={form.control}
                                            name="zip_file"
                                            render={({
                                                field: {
                                                    value,
                                                    onChange,
                                                    ...fieldProps
                                                },
                                            }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div
                                                            className="relative flex w-full flex-col items-center justify-center pb-4"
                                                            onDragOver={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                            }}
                                                        >
                                                            <label
                                                                htmlFor="dropzone-file"
                                                                className={`flex h-44 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all ${value ? 'border-blue-500 bg-blue-50/10' : 'border-muted-foreground/25 bg-sidebar hover:bg-muted/50'} `}
                                                            >
                                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                    {value ? (
                                                                        <div className="group relative">
                                                                            <img
                                                                                src={
                                                                                    typeof value ===
                                                                                    'string'
                                                                                        ? value
                                                                                        : URL.createObjectURL(
                                                                                              value,
                                                                                          )
                                                                                }
                                                                                className="h-30 w-30 rounded-2xl object-cover shadow-md"
                                                                                alt="Preview"
                                                                            />
                                                                            <div className="mt-2 text-center text-xs text-muted-foreground">
                                                                                {value instanceof
                                                                                File
                                                                                    ? value.name
                                                                                    : 'Imagen actual'}
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <>
                                                                            <div className="mb-3 rounded-full p-4">
                                                                                <FolderArchive className="h-8 w-8" />
                                                                            </div>
                                                                            <p className="mb-2 text-sm text-muted-foreground">
                                                                                <span className="font-semibold text-foreground">
                                                                                    Haz
                                                                                    clic
                                                                                    para
                                                                                    subir
                                                                                </span>
                                                                                <br />
                                                                                o
                                                                                arrastra
                                                                                y
                                                                                suelta
                                                                            </p>
                                                                        </>
                                                                    )}
                                                                </div>

                                                                {/* El input oculto */}
                                                                <Input
                                                                    id="dropzone-file"
                                                                    type="file"
                                                                    accept=".zip,application/zip"
                                                                    className="hidden"
                                                                    onChange={(
                                                                        e,
                                                                    ) => {
                                                                        const file =
                                                                            e
                                                                                .target
                                                                                .files?.[0];
                                                                        if (
                                                                            file
                                                                        )
                                                                            onChange(
                                                                                file,
                                                                            );
                                                                    }}
                                                                    {...fieldProps}
                                                                />
                                                            </label>

                                                            {/* Botón para resetear si hay archivo */}
                                                            {value && (
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="mt-2 h-8 text-xs"
                                                                    onClick={() =>
                                                                        onChange(
                                                                            null,
                                                                        )
                                                                    }
                                                                >
                                                                    Cambiar
                                                                    imagen
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="grid grid-cols-2 gap-3 pb-4">
                                            <FormField
                                                control={form.control}
                                                name="period_start"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Periodo Inicio
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="date"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="period_end"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Periodo Fin
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="date"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="period_type"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Tipo de periodo
                                                    </FormLabel>
                                                    <FormControl>
                                                        <select
                                                            {...field}
                                                            className="w-full rounded-md border p-2"
                                                        >
                                                            <option value="">
                                                                Selecciona
                                                            </option>
                                                            <option value="semanal">
                                                                Semanal
                                                            </option>
                                                            <option value="quincenal">
                                                                Quincenal
                                                            </option>
                                                            <option value="mensual">
                                                                Mensual
                                                            </option>
                                                        </select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </AppLayout>
    );
}
