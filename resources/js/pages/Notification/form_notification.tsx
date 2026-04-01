import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { CloudCheck, Loader2, Rocket } from 'lucide-react';
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
import AppLayout from '@/layouts/app-layout';
import { create, edit, index as notifications, store, update } from '@/routes/notifications';
import { notificationSchema } from '@/schemas/notificationSchema';
import type { BreadcrumbItem, Notification, priority, types } from '@/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import TiptapEditor from '@/components/tiptapEditor';
import { SUBJECT_OPTIONS, TYPE_ICONS } from '@/lib/arrays';

type Props = {
  priorities: priority[];
  types: types[];
  notification?: Notification;
};

export default function FormNotification({ priorities, types, notification }: Props) {
  const isEdit = !!notification;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Notificaciones', href: notifications().url },
    {
      title: isEdit ? 'Editar notificación' : 'Crear notificación',
      href: isEdit ? edit(notification.id).url : create().url,
    },
  ];

  const form = useForm({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: notification?.title ?? '',
      subject: notification?.subject ?? '',
      content: notification?.content ?? '',
      imagen_path: notification?.imagenPath ?? '',
      priority: notification?.priority ?? '',
      type: notification?.type ?? '',
      published_at: notification?.publishedAt ?? '',
    },
  });

  const selectedType = form.watch('type');

  const subjectOptions =
    SUBJECT_OPTIONS.find((group) => group.type.toLowerCase() === selectedType?.toLowerCase())
      ?.children ?? [];

  useEffect(() => {
    form.setValue('subject', '');
  }, [selectedType, form]);

  const formRef = useRef(form);
  formRef.current = form;

  const onSubmit: SubmitHandler = useCallback(
    (data: Notification) => {
      setIsSubmitting(true);
      const options = {
        preserveScroll: true,
        forceFormData: true,
        onSuccess: () => router.visit(notifications().url),
        onError: (errors: Record<string, string>) => {
          Object.entries(errors).forEach(([field, message]) => {
            formRef.current.setError(field as keyof typeof data, {
              message,
            });
          });
        },
        onFinish: () => setIsSubmitting(false),
      };

      if (isEdit && notification?.id) {
        router.put(update(notification.id).url, data, options);
      } else {
        router.post(store().url, data, options);
      }
    },
    [isEdit, notification]
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Nueva notificacion" />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 p-4 sm:p-6"
              id="FormNotification"
            >
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
                          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          {types.map((types) => {
                            const isSelected = field.value === types.value;

                            return (
                              <label
                                key={types.value}
                                htmlFor={types.value}
                                className={`relative flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 transition-all ${
                                  isSelected
                                    ? 'border-green-500 bg-green-500/5 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                                    : 'border-sidebar-accent/50 bg-sidebar hover:bg-sidebar-accent/30'
                                } `}
                              >
                                <div className="flex flex-row items-center space-y-3">
                                  <RadioGroupItem
                                    id={types.value}
                                    value={types.value}
                                    aria-label="type-notification"
                                    className="sr-only"
                                  />
                                  <div className="flex shrink-0 items-center justify-center rounded-lg p-2 text-muted-foreground">
                                    {TYPE_ICONS[types.value]}
                                  </div>
                                  <div className="flex flex-col">
                                    <span
                                      className={`text-lg font-bold tracking-tight ${isSelected ? 'text-foreground' : 'text-foreground/80'}`}
                                    >
                                      {types.label}
                                    </span>
                                    <span
                                      className={`text-[10px] font-semibold tracking-widest uppercase ${isSelected ? 'text-green-500' : 'text-muted-foreground/60'}`}
                                    >
                                      {types.subtitle || 'CULTURA & IDENTIDAD'}{' '}
                                      {/* Aquí puedes usar un campo de tu objeto types */}
                                    </span>
                                  </div>
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

              <div className="grid auto-rows-max grid-cols-1 gap-8 lg:grid-cols-3 lg:grid-rows-2">
                <Card className="rounded-3xl bg-sidebar lg:col-span-2 lg:row-span-2">
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Asunto</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={!selectedType || subjectOptions.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    !selectedType
                                      ? 'Primero selecciona un tipo'
                                      : subjectOptions.length === 0
                                        ? 'Sin opciones disponibles'
                                        : 'Selecciona un asunto'
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subjectOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
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
                            <TiptapEditor
                              key={notification?.id ?? 'new'}
                              content={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="imagen_path"
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
                                      <div className="mb-3 rounded-full p-4">
                                        <CloudCheck className="h-8 w-8" />
                                      </div>
                                      <p className="mb-2 text-sm text-muted-foreground">
                                        <span className="font-semibold text-foreground">
                                          Haz clic para subir
                                        </span>
                                        <br />o arrastra y suelta
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

                <Card className="rounded-xl bg-sidebar lg:col-span-1 lg:row-span-1">
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
                                  className={`flex w-full cursor-pointer items-center justify-between rounded-xl border px-6 py-4 transition-all sm:w-auto ${isSelected ? `${priority.bg} border-blue-500 shadow-sm` : 'border-gray-200'} `}
                                >
                                  <div className="flex items-center space-x-3">
                                    <RadioGroupItem id={priority.value} value={priority.value} />
                                    <span className="font-medium">{priority.label}</span>
                                  </div>

                                  <div className={`h-4 w-4 rounded-full ${priority.color}`} />
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
                <Card className="lg:col-span-.5 lg:row-span-.5 rounded-3xl bg-sidebar">
                  <CardHeader>
                    <CardTitle>Publicacion</CardTitle>
                    <CardDescription>Fecha publicacion</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="published_at"
                      render={({ field }) => {
                        const formattedValue = field.value
                          ? new Date(field.value).toISOString().slice(0, 10)
                          : '';

                        return (
                          <FormItem>
                            <FormLabel>Fecha</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
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
        <div className="inset-shadow-xl shrink-0 border-t">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between p-4">
            <div className="text-md flex items-center gap-4">
              <CloudCheck className="h-6 w-6" />
              <span className="text-foreground">Publicar notificación</span>
            </div>
            <Button type="submit" disabled={isSubmitting} form="FormNotification">
              {isSubmitting ? 'Publicando...' : 'Publicar notificación'}
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Rocket />}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
