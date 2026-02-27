import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { BreadcrumbItem, SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;
    const [preview, setPreview] = useState<string | null>(null);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile Settings</h1>

            <SettingsLayout>
                <div className="items-center justify-center space-y-6">
                    <Heading
                        variant="small"
                        title="Profile information"
                        description="Update your name and email address"
                    />

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                            forceFormData: true,
                        }}
                        className="grid grid-cols-2 gap-2 space-y-3"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <div className="grid gap-3">
                                    <Label htmlFor="photo">
                                        Foto de perfil
                                    </Label>
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-20 w-20">
                                            <AvatarImage
                                                src={preview ?? auth.avatar_url}
                                                alt={auth.user.name}
                                            />
                                            <AvatarFallback>
                                                {auth.user.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>

                                        <Input
                                            id="photo"
                                            name="avatar_path"
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                            className="max-w-xs"
                                        />
                                    </div>

                                    <InputError message={errors.photo} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="employeeNumber">
                                        Numero de empleado
                                    </Label>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Input
                                                id="employeeNumber"
                                                className="mt-1 block w-full"
                                                defaultValue={
                                                    auth.user.employeeNumber
                                                }
                                                name="employeeNumber"
                                                required
                                                autoComplete="employeeNumber"
                                                placeholder="Numero de empleado"
                                                readOnly
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                Solo Capital Humano puede
                                                modificar
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <InputError
                                        className="mt-2"
                                        message={errors.position}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="Full name"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.name}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email address</Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="Email address"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.email}
                                    />
                                </div>

                                {mustVerifyEmail &&
                                    auth.user.email_verified_at === null && (
                                        <div>
                                            <p className="-mt-4 text-sm text-muted-foreground">
                                                Your email address is
                                                unverified.
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                                >
                                                    Click here to resend the
                                                    verification email.
                                                </Link>
                                            </p>

                                            {status ===
                                                'verification-link-sent' && (
                                                <div className="mt-2 text-sm font-medium text-green-600">
                                                    A new verification link has
                                                    been sent to your email
                                                    address.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                <div className="grid gap-2">
                                    <Label htmlFor="position">Posicion</Label>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Input
                                                id="position"
                                                className="mt-1 block w-full"
                                                defaultValue={
                                                    auth.user.position
                                                }
                                                name="position"
                                                required
                                                autoComplete="position"
                                                placeholder="Posicion"
                                                readOnly
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                Solo Capital Humano puede
                                                modificar
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <InputError
                                        className="mt-2"
                                        message={errors.position}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="birthday">
                                        Fecha de nacimiento
                                    </Label>

                                    <Input
                                        id="birthday"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.birthday}
                                        type="date"
                                        name="birthday"
                                        required
                                        autoComplete="birthday"
                                        placeholder="Fecha de nacimiento"
                                        readOnly
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.birthday}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="dateEntry">
                                        Fecha de ingreso
                                    </Label>

                                    <Input
                                        id="dateEntry"
                                        type="date"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.dateEntry}
                                        name="dateEntry"
                                        required
                                        autoComplete="dateEntry"
                                        placeholder="Fecha de ingreso"
                                        readOnly
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.dateEntry}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Telefono</Label>

                                    <Input
                                        id="phone"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.phone}
                                        name="phone"
                                        required
                                        autoComplete="phone"
                                        placeholder="Telefono"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.position}
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                    >
                                        Save
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-neutral-600">
                                            Saved
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
