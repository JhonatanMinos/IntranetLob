import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { BriefcaseBusiness, User as UserIcon } from 'lucide-react';
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
import { store, update } from '@/routes/users';
import { createUserSchema, updateUserSchema } from '@/schemas/registerSchema';
import type { SimpleModel, Store, User } from '@/types';

interface CreateUserProps {
    departments: SimpleModel[];
    stores: Store[];
    company: SimpleModel[];
    user?: User;
}

export function FormUser({
    departments,
    stores,
    company,
    user,
}: CreateUserProps) {
    const isEdit = !!user;
    const form = useForm({
        resolver: zodResolver(isEdit ? updateUserSchema : createUserSchema),
        defaultValues: {
            employeeNumber: user?.employeeNumber ?? undefined,
            name: user?.name ?? '',
            email: user?.email ?? '',
            password: '',
            position: user?.position ?? '',
            birthday: user?.birthday ?? '',
            dateEntry: user?.dateEntry ?? '',
            phone: user?.phone ?? '',
            department_id: user?.department_id?.toString() ?? '',
            store_id: user?.store_id?.toString() ?? '',
            company_id: user?.company_id?.toString() ?? '',
        },
    });

    const onSubmit = (data) => {
        if (isEdit && user?.id) {
            router.put(update(user.id).url, data, {
                onSuccess: () => {
                    toast.success('Usuario actualizado', {
                        position: 'bottom-right',
                    });
                },
                onError: () => {
                    toast.error('Error al actualizar al usuario', {
                        position: 'bottom-right',
                    });
                },
            });
        } else {
            router.post(store().url, data);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="custom-scrollbar space-y-8 overflow-y-auto p-6"
            >
                <div className="mb-2 flex flex-row items-center gap-2">
                    <UserIcon />
                    <h2 className="text-sm font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
                        Informacion personal
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
                                        placeholder="Nombre del empleado"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Correo</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Correo del empleado"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {isEdit
                                        ? 'Nueva contraseña (opcional)'
                                        : 'Contraseña'}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Contraseña del empleado"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Telefono</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Telefono del empelado"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="birthday"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fecha de nacimineto</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="space-y-4">
                    <div className="mb-2 flex flex-row items-center gap-2">
                        <BriefcaseBusiness color="#ffffff" />
                        <h2 className="text-sm font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
                            Información Laboral
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="employeeNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Numero de empleado</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Numero del empleado"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="position"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Puesto</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Puesto de empleado"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="department_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Departamento</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value || ''} // controlado por RHF
                                            onValueChange={field.onChange} // actualiza el formulario
                                            className="w-full rounded border px-3 py-2"
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona un departamento" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {departments.map(
                                                    (department) => (
                                                        <SelectItem
                                                            key={department.id}
                                                            value={department.id.toString()}
                                                        >
                                                            {department.name}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="store_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tienda</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value || ''} // controlado por RHF
                                            onValueChange={field.onChange} // actualiza el formulario
                                            className="w-full rounded border px-3 py-2"
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona una tienda" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {stores.map((store) => (
                                                    <SelectItem
                                                        key={store.id}
                                                        value={store.id.toString()}
                                                    >
                                                        {store.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="company_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Compañia</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value || ''} // controlado por RHF
                                            onValueChange={field.onChange} // actualiza el formulario
                                            className="w-full rounded border px-3 py-2"
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona una compañia" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {company.map((companys) => (
                                                    <SelectItem
                                                        key={companys.id}
                                                        value={companys.id.toString()}
                                                    >
                                                        {companys.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dateEntry"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fecha de ingreso</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Button type="submit" className="w-full">
                    {isEdit ? 'Actualizar Usuario' : 'Registrar Usuario'}
                </Button>
            </form>
        </Form>
    );
}
