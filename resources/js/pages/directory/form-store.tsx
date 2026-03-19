import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { Loader2, Store as StoreIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
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
import { store, update } from '@/routes/shops'; // Asumiendo que existen estas rutas
import { createStoreSchema, updateStoreSchema } from '@/schemas/storeSchema';
import type { Store } from '@/types';
import { useFlash } from '@/hooks/use-flash';

interface CreateStoreProps {
    store?: Store;
    onSuccess?: () => void;
}

export function FormStore({ store, onSuccess }: CreateStoreProps) {
    const isEdit = !!store;
    const form = useForm({
        resolver: zodResolver(isEdit ? updateStoreSchema : createStoreSchema),
        defaultValues: {
            name: store?.name ?? '',
            code: store?.code ?? '',
            type: store?.type ?? '',
            address: store?.address ?? '',
            neighborhood: store?.neighborhood ?? '',
            city: store?.city ?? '',
            postalCode: store?.postalCode ?? '',
        },
    });
    const {
        formState: { isSubmitting },
    } = form;

    const onSubmit = async (data) => {
        if (isEdit && store?.id) {
            await router.put(update(store.id).url, data, {
                onSuccess: () => {
                    onSuccess?.();
                },
                onError: () => {},
            });
        } else {
            await router.post(store().url, data, {
                onSuccess: () => {
                    onSuccess?.();
                },
                onError: () => {},
            });
        }
    };

    useFlash();

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="custom-scrollbar space-y-8 overflow-y-auto p-6"
            >
                <div className="mb-2 flex flex-row items-center gap-2">
                    <StoreIcon />
                    <h2 className="text-sm font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
                        Información de la tienda
                    </h2>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Nombre de la tienda"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Código</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Código de la tienda"
                                        {...field}
                                    />
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
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un tipo" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="tienda">
                                            Tienda
                                        </SelectItem>
                                        <SelectItem value="bodega">
                                            Bodega
                                        </SelectItem>
                                        <SelectItem value="oficina">
                                            Oficina
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Dirección</FormLabel>
                                <FormControl>
                                    <Input placeholder="Dirección" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="neighborhood"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Barrio</FormLabel>
                                <FormControl>
                                    <Input placeholder="Barrio" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ciudad</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ciudad" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Código Postal</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Código Postal"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {isEdit ? 'Actualizar Tienda' : 'Crear Tienda'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

