import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { CloudCheck, Dna, Loader2, Megaphone, Rocket, Sparkles, UsersRound } from 'lucide-react';
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
import { create, edit, index as notifications, store, update } from '@/routes/notifications';
import { notificationSchema } from '@/schemas/notificationSchema';
import type { BreadcrumbItem, Notification } from '@/types';
import { Children, useCallback, useRef, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

const TYPE_ICONS: Record<string, React.ReactNode> = {
  adn: <Dna className="h-6 w-6" color="#80ff00" />,
  beneficios: <Sparkles color="#0a33f5" className="h-6 w-6" />,
  colaboradores: <UsersRound color="#ff8000" className="h-6 w-6" />,
  avisos: <Megaphone color="#ff0000" className="h-6 w-6" />,
};

const SUBJECT_OPTIONS = [
  {
    type: 'ADN',
    children: [
      { value: 'procesos_proyectos', label: 'Procesos y proyectos' },
      { value: 'nuestros_logros', label: 'Nuestros Logros' },
      { value: 'reconocimientos', label: 'Reconocimientos' },
      { value: 'calendario_comercial', label: 'Calendario comercial' },
      { value: 'adn_organizacional', label: 'ADN organizacional' },
      {
        value: 'valores_organizacionales',
        label: 'Valores Organizacionales',
      },
      { value: 'conmemoracion', label: 'Conmemoración' },
      { value: 'efemerides', label: 'Efemérides' },
    ],
  },
  {
    type: 'Beneficios',
    children: [
      { value: 'cumpleanos', label: 'Cumpleaños' },
      {
        value: 'beneficios_colaboradores',
        label: 'Beneficios a Colaboradores',
      },
      { value: 'eventos', label: 'Eventos' },
      { value: 'servicios', label: 'Servicios' },
      { value: 'escucharte', label: 'Queremos Escucharte' },
      {
        value: 'salud_seguridad_higiene',
        label: 'Salud, Seguridad e Higiene',
      },
    ],
  },
  {
    type: 'Colaboradores',
    children: [
      { value: 'oportunidad', label: 'Oportunidad' },
      { value: 'comunidad', label: 'Comunidad' },
      { value: 'solidaridad', label: 'Solidaridad' },
      { value: 'participa', label: 'Participa' },
      { value: 'induccion', label: 'Inducción' },
      { value: 'bienvenidos', label: 'Bienvenidos' },
      { value: 'capacitacion', label: 'Capacitación' },
    ],
  },
  {
    type: 'Avisos',
    children: [], // listo para usar
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
      imagen_path: null,
      priority: notification?.priority ?? '',
      type: notification?.type ?? '',
      published_at: notification?.publishedAt ?? '',
    },
  });

  const selectedType = form.watch('type');

  const subjectOptions =
    SUBJECT_OPTIONS.find((group) => group.type.toLowerCase() === selectedType?.toLowerCase())
      ?.children ?? [];

  const formRef = useRef(form);
  formRef.current = form;

  const onSubmit = useCallback(
    (data: Notification) => {
      console.log(data);
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
    [isEdit, notification?.id, form]
  );

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
                          // Reset subject cuando cambia type
                          key={selectedType}
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
                          <Textarea
                            placeholder="Escribe aquí el contenido de tu anuncio..."
                            {...field}
                            rows={6}
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

                                <div className={`h-3 w-3 rounded-full bg-${priority.color}`} />
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
                                  <div className="text-muted-foreground">
                                    {TYPE_ICONS[types.value]}
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
      <div className="sticky bottom-0 flex w-full items-center justify-between bg-sidebar p-4">
        <div className="text-md flex items-center">
          <CloudCheck className="m-2 rounded-full bg-muted-foreground p-1" />
          <span className="text-muted-foreground">Publicar notificación</span>
        </div>
        <Button type="submit" disabled={isSubmitting} form="FormNotification">
          {isSubmitting ? 'Publicando...' : 'Publicar notificación'}
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Rocket />}
        </Button>
      </div>
    </AppLayout>
  );
}
