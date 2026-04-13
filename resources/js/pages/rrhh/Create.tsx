import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import {
    CloudUpload,
    FolderArchive,
    FolderUp,
    Loader2,
    Rocket,
} from 'lucide-react';
import { useState } from 'react';
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
import { create, index, store } from '@/routes/payroll';
import { payrollUploadSchema } from '@/schemas/payrollSchema';
import type { BreadcrumbItem } from '@/types';

export default function CreatePayRoll() {
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        const formData = new FormData();

        formData.append('zip_file', data.zip_file);
        formData.append('period_start', data.period_start.toISOString());
        formData.append('period_end', data.period_end.toISOString());
        formData.append('period_type', data.period_type);

        console.log(data);
        router.post(store().url, formData, {
            forceFormData: true, // 🔥 necesario para archivos
            onError: (errors) => {
                Object.entries(errors).forEach(([field, message]) => {
                    form.setError(field as keyof PayrollUploadForm, {
                        message,
                    });
                });
            },
            onFinish: () => setIsSubmitting(false),
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
                            className="mx-auto max-w-6xl space-y-9 p-4 sm:p-6"
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
                                                            onDrop={(e) => {
                                                                e.preventDefault();
                                                                const file =
                                                                    e
                                                                        .dataTransfer
                                                                        .files?.[0];
                                                                if (
                                                                    file?.name.endsWith(
                                                                        '.zip',
                                                                    )
                                                                )
                                                                    onChange(
                                                                        file,
                                                                    );
                                                            }}
                                                        >
                                                            <label
                                                                htmlFor="dropzone-file"
                                                                className={`flex h-44 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all ${value ? 'border-blue-500 bg-blue-50/10' : 'border-muted-foreground/25 bg-sidebar hover:bg-muted/50'} `}
                                                            >
                                                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                                                    {value ? (
                                                                        <>
                                                                            <FolderArchive className="h-14 w-14 text-blue-500" />
                                                                            <p className="text-sm font-medium text-foreground">
                                                                                {
                                                                                    value.name
                                                                                }
                                                                            </p>
                                                                            <p className="text-xs text-muted-foreground">
                                                                                {(
                                                                                    value.size /
                                                                                    1024 /
                                                                                    1024
                                                                                ).toFixed(
                                                                                    2,
                                                                                )}
                                                                                MB
                                                                            </p>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <FolderArchive className="h-14 w-14 text-muted-foreground" />
                                                                            <p className="text-sm text-muted-foreground">
                                                                                <span className="font-semibold text-foreground">
                                                                                    Seleccione
                                                                                    un
                                                                                    archivo
                                                                                    ZIP.
                                                                                </span>
                                                                                <br />
                                                                                Arrastre
                                                                                y
                                                                                suelta
                                                                                el
                                                                                archivo
                                                                                de
                                                                                nominas
                                                                                compatado
                                                                                aqui
                                                                            </p>
                                                                            <br />
                                                                            <p className="text-xs text-muted-foreground">
                                                                                Solo
                                                                                .zip
                                                                                —
                                                                                Máx.
                                                                                50MB
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
                                                        <FormMessage />
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
                <div className="inset-shadow-xl shrink-0 border-t">
                    <div className="mx-auto flex w-full max-w-7xl items-center justify-between p-4">
                        <div className="text-md flex items-center gap-4">
                            <FolderArchive className="h-6 w-6" />
                            <span className="text-foreground">
                                Subir archivo
                            </span>
                        </div>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            form="CreatePayRoll"
                        >
                            {isSubmitting ? 'Subiendo...' : 'Subir archivo'}
                            {isSubmitting ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <FolderUp />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
