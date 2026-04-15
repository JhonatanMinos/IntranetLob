import { zodResolver } from '@hookform/resolvers/zod';
import type { PageProps } from '@inertiajs/core';
import { Head, router, usePage } from '@inertiajs/react';
import { CloudUpload, File, FileText, FileUp, Loader2, Rocket } from 'lucide-react';
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
import type { BreadcrumbItem, User } from '@/types';

export default function CreatePayRoll() {
  const { user } = usePage<User>().props;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Capital Humano', href: '/rrhh' },
    { title: 'Nomina', href: index().url },
    { title: 'Subir Nomina', href: create(user.id).url },
  ];

  const form = useForm({
    resolver: zodResolver(payrollUploadSchema),
    defaultValues: {
      file: undefined,
      user_id: user.id.toString(),
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('user_id', data.user_id);

      router.post(store().url, formData, {
        onSuccess: () => {
          form.reset();
          setIsSubmitting(false);
          // Inertia redirige automáticamente con el toast de success
        },
        onError: (errors: any) => {
          setIsSubmitting(false);
          // Mostrar errores del servidor
          if (errors.file) {
            form.setError('file', {
              message: errors.file,
            });
          } else if (errors.user_id) {
            form.setError('user_id', {
              message: errors.user_id,
            });
          }
        },
      });
    } catch (error) {
      setIsSubmitting(false);
      console.error(error);
    }
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
              <Input type="hidden" {...form.register('user_id')} value={user.id} />
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Subir Nomina de {user.name}</CardTitle>
                    <CardDescription>
                      Carga el archivo de nomina para el periodo actual
                    </CardDescription>
                    <CardAction>
                      <CloudUpload />
                    </CardAction>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="file"
                      render={({ field: { value, onChange, ...fieldProps } }) => (
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
                                const file = e.dataTransfer.files?.[0];
                                if (file?.name.endsWith('.pdf')) onChange(file);
                              }}
                            >
                              <label
                                htmlFor="dropzone-file"
                                className={`flex h-44 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all ${value ? 'border-blue-500 bg-blue-50/10' : 'border-muted-foreground/25 bg-sidebar hover:bg-muted/50'} `}
                              >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                  {value ? (
                                    <>
                                      <FileText className="h-14 w-14 text-blue-500" />
                                      <p className="text-sm font-medium text-foreground">
                                        {value.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {(value.size / 1024 / 1024).toFixed(2)}
                                        MB
                                      </p>
                                    </>
                                  ) : (
                                    <>
                                      <FileUp className="h-14 w-14 text-muted-foreground" />
                                      <p className="text-sm text-muted-foreground">
                                        <span className="font-semibold text-foreground">
                                          Seleccione un archivo PDF.
                                        </span>
                                        <br />
                                        Arrastre y suelta el archivo de nominas
                                      </p>
                                      <br />
                                      <p className="text-xs text-muted-foreground">
                                        Solo .pdf — Máx. 50MB
                                      </p>
                                    </>
                                  )}
                                </div>

                                {/* El input oculto */}
                                <Input
                                  id="dropzone-file"
                                  type="file"
                                  accept=".pdf ,application/pdf"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) onChange(file);
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
                                  onClick={() => onChange(null)}
                                >
                                  Cambiar archivo
                                </Button>
                              )}
                            </div>
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
              <File className="h-6 w-6" />
              <span className="text-foreground">Subir archivo</span>
            </div>
            <Button type="submit" disabled={isSubmitting} form="CreatePayRoll">
              {isSubmitting ? 'Subiendo...' : 'Subir archivo'}
              {isSubmitting ? <Loader2 className="animate-spin" /> : <FileUp />}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
