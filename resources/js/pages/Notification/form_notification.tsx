import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { Bell, CloudCheck, Mail, MessageSquare, Newspaper, Rocket } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { create, index as notifications, store, update } from '@/routes/notifications';
import { notificationSchema } from '@/schemas/notificationSchema';
import type { BreadcrumbItem, Notification } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Notificaciones',
    href: notifications().url,
  },
  {
    title: 'Formulario de notificacion',
    href: create().url,
  },
];

interface priority {
  value: string;
  label: string;
  color: string;
}

interface types {
  value: string;
  label: string;
}

type Props = {
  priorities: priority[];
  types: types[];
  notification?: Notification;
};

export default function FormNotification({ priorities, types, notification }: Props) {
  const isEdit = !!notification;

  const form = useForm({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: notification?.title ?? '',
      subject: notification?.subject ?? '',
      content: notification?.content ?? '',
      imagePath: null,
      priority: notification?.priority ?? '',
      type: notification?.type ?? '',
      published_at: notification?.publishedAt ?? '',
    },
  });

  const typeIcons: Record<string, React.ReactNode> = {
    aviso: <Mail className="h-6 w-6" />,
    noticia: <Bell className="h-6 w-6" />,
    articulo: <Newspaper className="h-6 w-6" />,
    mensaje: <MessageSquare className="h-6 w-6" />,
  };

  const onSubmit = (data: Notification) => {
    if (isEdit && notification?.id) {
      router.put(update(notification.id).url, data);
    } else {
      router.post(store().url, data);
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Nueva notificacion" />
      <div className="mx-auto w-full max-w-7xl overflow-y-auto px-4 sm:px-6 lg:px-8">
        <h1 className="mb-4 text-xl font-bold">
          {isEdit ? 'Editar Notificación' : 'Crear Notificación'}
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 p-4 sm:p-6"
            id="FormNotification"
          >
            <div className="grid auto-rows-max grid-cols-1 gap-6 lg:grid-cols-3">
              <Card className="rounded-3xl bg-sidebar lg:col-span-2">
                <CardHeader>
                  <CardTitle>Contenido de la notificacion</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titulo</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Scheduled System Maintenance" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Asunto</FormLabel>
                        <FormControl>
                          <Input placeholder="Breve resumen del contenido" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensaje</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Escribe aquí el contenido de tu anuncio..."
                            {...field}
                            rows={6}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="imagePath"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Imagen</FormLabel>
                        <FormControl>
                          <div
                            className="relative flex w-full flex-col items-center justify-center"
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
                                        typeof value === 'string'
                                          ? value
                                          : URL.createObjectURL(value)
                                      }
                                      className="h-30 w-30 rounded-2xl object-cover shadow-md"
                                      alt="Preview"
                                    />
                                    <div className="mt-2 text-center text-xs text-muted-foreground">
                                      {value instanceof File ? value.name : 'Imagen actual'}
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="mb-3 rounded-full bg-blue-500/10 p-4 text-blue-500">
                                      <CloudCheck className="h-8 w-8" />
                                    </div>
                                    <p className="mb-2 text-sm text-muted-foreground">
                                      <span className="font-semibold text-foreground">
                                        Haz clic para subir
                                      </span>
                                      o arrastra y suelta
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      PNG, JPG o WEBP (Máx. 2MB)
                                    </p>
                                  </>
                                )}
                              </div>

                              {/* El input oculto */}
                              <Input
                                id="dropzone-file"
                                type="file"
                                accept="image/*"
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
                                Cambiar imagen
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

              <Card className="rounded-xl bg-sidebar">
                <CardHeader>
                  <CardTitle>Prioridad</CardTitle>
                  <CardDescription>Que tan importante es este aviso?</CardDescription>
                </CardHeader>

                <CardContent>
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="space-y-3"
                        >
                          {priorities.map((priority) => {
                            const isSelected = field.value === priority.value;

                            return (
                              <label
                                key={priority.value}
                                htmlFor={priority.value}
                                className={`flex w-full cursor-pointer items-center justify-between rounded-xl border px-6 py-4 transition-all sm:w-auto ${isSelected ? 'border-blue-500 bg-blue-500/20 shadow-sm' : 'border-gray-200'} `}
                              >
                                <div className="flex items-center space-x-3">
                                  <RadioGroupItem id={priority.value} value={priority.value} />
                                  <span className="font-medium">{priority.label}</span>
                                </div>

                                <div className={`h-3 w-3 rounded-full ${priority.color}`} />
                              </label>
                            );
                          })}
                        </RadioGroup>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card className="rounded-3xl bg-sidebar lg:col-span-2">
                <CardHeader>
                  <CardTitle>Tipo</CardTitle>
                  <CardDescription>Selecciona el formato de la notificacion</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <RadioGroup
                          className="flex flex-col items-center sm:flex-row sm:flex-wrap sm:justify-between"
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          {types.map((types) => {
                            const isSelected = field.value === types.value;

                            return (
                              <label
                                key={types.value}
                                htmlFor={types.value}
                                className={`flex cursor-pointer items-center justify-between rounded-xl border px-12 py-4 transition-all ${isSelected ? 'border-blue-500 bg-blue-400/15 shadow-sm' : 'border-gray-200'} `}
                              >
                                <div className="flex flex-col items-center space-y-3">
                                  <RadioGroupItem
                                    id={types.value}
                                    value={types.value}
                                    aria-label="type-notification"
                                    className="sr-only"
                                  />

                                  {/* ICONO DINÁMICO */}
                                  <div className="text-muted-foreground">
                                    {typeIcons[types.value]}
                                  </div>
                                  <span className="font-medium">{types.label}</span>
                                </div>
                              </label>
                            );
                          })}
                        </RadioGroup>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card className="rounded-4xl bg-sidebar">
                <CardHeader>
                  <CardTitle>Publicacion</CardTitle>
                  <CardDescription>Fecha y hora de publicacion</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="published_at"
                    render={({ field }) => {
                      const formattedValue = field.value
                        ? new Date(field.value).toISOString().slice(0, 16)
                        : '';

                      return (
                        <FormItem>
                          <FormLabel>Fecha</FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              {...field}
                              value={formattedValue} // Forzamos el valor formateado
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>
      </div>
      <div className="sticky bottom-0 flex w-full flex-row items-center justify-between bg-sidebar p-4">
        <div className="text-md flex items-center">
          <CloudCheck className="m-2 rounded-full bg-muted-foreground p-1" />
          <span className="text-muted-foreground">publicar notificacion</span>
        </div>
        <Button form="FormNotification">
          Publicar notificacion <Rocket />
        </Button>
      </div>
    </AppLayout>
  );
}
