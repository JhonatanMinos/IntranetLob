import { zodResolver } from '@hookform/resolvers/zod';
import { Head } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { create, index as notifications } from '@/routes/notifications';
import { notificationSchema } from '@/schemas/notificationSchema';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Notificaciones',
    href: notifications().url,
  },
  {
    title: 'Crear notificacion',
    href: create().url,
  },
];

type Props = {
  priorities: string[];
  type: string[];
};

export default function formNotification({ priorities, type }: Props) {
  const form = useForm({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: '',
      content: '',
      priority: '',
      type: '',
      created_by: '',
      publishet_at: '',
    },
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Nueva notificacion" />
      <div className="mx-50">
        <h1 className="mb-4 text-xl font-bold">Crear Notificación</h1>
        <Form {...form}>
          <form className="custom-scrollbar space-y-8 overflow-y-auto p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card className="col-span-2 row-span-2 rounded-4xl bg-sidebar">
                <CardHeader>
                  <CardTitle>Contenido de la notificacion</CardTitle>
                </CardHeader>

                <CardContent>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        sidebar-foreground
                        <FormLabel>Titulo</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Scheduled System Maintenance" {...field} />
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
                            placeholder="Escribe aquí el contenido de tu anuncio... Usa Markdown o la barra de herramientas de arriba."
                            {...field}
                            rows="15"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card className="rounded-4xl bg-sidebar">
                <CardHeader>
                  <CardTitle>Prioridad</CardTitle>
                </CardHeader>

                <CardContent>
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selecciona una prioridad</FormLabel>

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
                                className={`flex cursor-pointer items-center justify-between rounded-4xl border p-4 transition-all ${isSelected ? 'border-blue-500 bg-blue-200/50 shadow-sm' : 'border-gray-200'} `}
                              >
                                <div className="flex items-center space-x-3">
                                  <RadioGroupItem value={priority.value} />
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
              <Card className="rounded-4xl bg-sidebar">
                <CardHeader>
                  <CardTitle>Publicacion</CardTitle>
                </CardHeader>
              </Card>
              <Card className="col-span-2 rounded-4xl bg-sidebar">
                <CardHeader>
                  <CardTitle>Tipo</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selecciona un tipo</FormLabel>
                        <RadioGroup
                          className="flex gap-4"
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          {type.map((types) => {
                            const isSelected = field.value === types.value;
                            return (
                              <label
                                key={types.value}
                                className={`flex cursor-pointer items-center justify-between rounded-4xl border p-4 transition-all ${isSelected ? 'border-blue-500 bg-blue-200/50 shadow-sm' : 'border-gray-200'} `}
                              >
                                <div className="flex items-center space-x-3">
                                  <RadioGroupItem value={types.value} />
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
              <Card className="rounded-4xl bg-sidebar"></Card>
            </div>
          </form>
        </Form>
      </div>
    </AppLayout>
  );
}
