import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { store, update } from '@/routes/events';

const eventSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  type: z
    .string()
    .refine(
      (val) => ['festivo', 'campania', 'lanzamiento', 'evento'].includes(val),
      'Selecciona un tipo válido'
    ),
  start_date: z.string().min(1, 'La fecha de inicio es requerida'),
  end_date: z.string().min(1, 'La fecha de finalización es requerida'),
  all_day: z.boolean(),
});

type EventFormData = z.infer<typeof eventSchema>;

interface Event {
  id: string;
  title: string;
  type: string;
  start_date: string;
  end_date: string;
  all_day?: boolean;
}

interface CreateEventProps {
  event?: Event;
  onSuccess?: () => void;
}

export function CreateEvent({ event, onSuccess }: CreateEventProps) {
  const [loading, setLoading] = useState(false);
  const isEditing = !!event;

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      type: 'evento',
      start_date: '',
      end_date: '',
      all_day: false,
    },
  });

  const handleSubmit = (data: EventFormData) => {
    setLoading(true);

    if (isEditing && event) {
      router.put(update(event.id).url, data, {
        onSuccess: () => {
          setLoading(false);
          form.reset();
          onSuccess?.();
        },
        onError: () => {
          setLoading(false);
        },
      });
    } else {
      router.post(store().url, data, {
        onSuccess: () => {
          setLoading(false);
          form.reset();
          onSuccess?.();
        },
        onError: () => {
          setLoading(false);
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título del evento</FormLabel>
              <FormControl>
                <Input placeholder="Ingresa el título del evento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="evento">Evento</SelectItem>
                  <SelectItem value="festivo">Festivo</SelectItem>
                  <SelectItem value="campania">Campaña</SelectItem>
                  <SelectItem value="lanzamiento">Lanzamiento</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de inicio</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de finalización</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="all_day"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-y-0 space-x-3">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="cursor-pointer font-normal">Evento de día completo</FormLabel>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={loading}>
            {loading
              ? isEditing
                ? 'Actualizando...'
                : 'Creando...'
              : isEditing
                ? 'Actualizar Evento'
                : 'Crear Evento'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
