import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, SharedData } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { edit } from '@/routes/employeeFiles';
import SettingsLayout from '@/layouts/settings/layout';
import Heading from '@/components/heading';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import {
    IdCard,
    BriefcaseBusiness,
    CalendarRange,
    Fingerprint,
    GraduationCap,
    Users,
    User,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import DocumentRow from '@/components/DocumentRow';

type DocumentStatus = 'pending' | 'approved' | 'rejected' | null;

type Document = {
    path: string | null;
    status: DocumentStatus;
    note: string | null;
};

type EmployeeFileProps = {
    employeeFile: {
        id: number;
        emergency_contact_name: string | null;
        emergency_contact_phone: string | null;
        documents: Record<string, Document>;
        user_id: number;
    };
};

const documentGroups = [
    {
        id: 'identity',
        label: 'Identidad y Legal',
        icon: Fingerprint,
        docs: [
            {
                key: 'curp',
                label: 'CURP',
                description: 'Clave Única de Registro de Población',
            },
            {
                key: 'ine',
                label: 'INE',
                description: 'Identificación Oficial (Frente y Vuelta)',
            },
            {
                key: 'birth_certificate',
                label: 'Acta de Nacimiento',
                description: 'Copia certificada reciente',
            },
            {
                key: 'rfc',
                label: 'RFC',
                description: 'Constancia de Situación Fiscal',
            },
        ],
    },
    {
        id: 'academic',
        label: 'Laboral y Académico',
        icon: GraduationCap,
        docs: [
            {
                key: 'nss',
                label: 'NSS (IMSS)',
                description: 'Número de Seguridad Social oficial',
            },
            {
                key: 'address_proof',
                label: 'Comprobante de Domicilio',
                description: 'No mayor a 3 meses (Luz, Agua, Tel)',
            },
            {
                key: 'education_certificate',
                label: 'Certificado de Estudios',
                description: 'Último grado de estudios',
            },
            {
                key: 'criminal_record',
                label: 'Antecedentes No Penales',
                description: 'Carta de antecedentes no penales',
            },
        ],
    },
    {
        id: 'references',
        label: 'Referencias y Banco',
        icon: Users,
        docs: [
            {
                key: 'recommendation_letter_1',
                label: 'Carta de Recomendación 1',
                description: 'Referencia personal o laboral',
            },
            {
                key: 'recommendation_letter_2',
                label: 'Carta de Recomendación 2',
                description: 'Referencia personal o laboral',
            },
            {
                key: 'bank_account',
                label: 'Cuenta Bancaria',
                description: 'Estado de cuenta o carátula',
            },
            {
                key: 'profile_photo',
                label: 'Foto de Perfil',
                description: 'Foto para el expediente',
            },
        ],
    },
];

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Expediente', href: edit().url },
];

export default function EmployeeFiles() {
    const { auth, employeeFile } = usePage<SharedData & EmployeeFileProps>()
        .props;
    const getInitials = useInitials();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Documentos" />
            <h1 className="sr-only">Expediente digital</h1>
            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Actualizar Expediente"
                        description="Expediente digital del empleado"
                    />

                    {/* Profile Card */}
                    <Card className="mb-4 p-6">
                        <div className="flex">
                            <Avatar className="h-12 w-12 items-center justify-center rounded-sm bg-muted-foreground">
                                <AvatarImage />
                                <AvatarFallback className="text-xl font-semibold">
                                    {getInitials(auth.user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-1 flex-col justify-between">
                                <CardHeader className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                                            {auth.user.name}
                                        </CardTitle>
                                        <CardDescription className="mt-0.5 flex flex-wrap items-center gap-2 text-sm font-medium">
                                            <div className="flex items-center gap-1">
                                                <IdCard className="h-4 w-4 text-muted-foreground" />
                                                Empleado:{' '}
                                                <span className="font-semibold">
                                                    {auth.user.employeeNumber}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />
                                                Puesto:{' '}
                                                <span className="font-semibold">
                                                    {auth.user.position}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <CalendarRange className="h-4 w-4 text-muted-foreground" />
                                                Ingreso:{' '}
                                                <span className="font-semibold">
                                                    {auth.user.dateEntry}
                                                </span>
                                            </div>
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                            </div>
                        </div>
                    </Card>

                    {/* Document Groups */}
                    {documentGroups.map((group) => {
                        const Icon = group.icon;
                        return (
                            <div key={group.id}>
                                <div className="mb-3 flex items-center gap-2">
                                    <Icon className="h-8 w-8 text-muted-foreground" />
                                    <span className="text-sm font-bold tracking-wider uppercase">
                                        {group.label}
                                    </span>
                                </div>
                                <Card>
                                    <CardContent className="divide-y p-0">
                                        {group.docs.map(
                                            ({ key, label, description }) => (
                                                <DocumentRow
                                                    key={key}
                                                    docKey={key}
                                                    label={label}
                                                    description={description}
                                                    doc={
                                                        employeeFile
                                                            .documents?.[
                                                            key
                                                        ] ?? {
                                                            path: null,
                                                            status: null,
                                                            note: null,
                                                        }
                                                    }
                                                    userId={auth.user.id}
                                                    employeeFile={
                                                        employeeFile.id
                                                    }
                                                />
                                            ),
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        );
                    })}
                    <div className="mb-3 flex items-center gap-2">
                        <User className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm font-bold tracking-wider uppercase">
                            Contacto de Emergencia
                        </span>
                    </div>

                    <Card>
                        <CardContent className="divide-y p-4">
                            <form className="gap-2 space-y-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="emergency_contact_name">
                                        Nombre completo
                                    </Label>
                                    <Input
                                        id="emergency_contact_name"
                                        className="mt-1 block w-full"
                                        defaultValue={
                                            employeeFile.emergency_contact_name
                                        }
                                        name="emergency_contact_name"
                                        required
                                        autoComplete="emergency_contact_name"
                                        placeholder="Nombre de contacto de emergencia"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="emergency_contact_name">
                                        Telefono
                                    </Label>
                                    <Input
                                        id="emergency_contact_phone"
                                        className="mt-1 block w-full"
                                        defaultValue={
                                            employeeFile.emergency_contact_phone
                                        }
                                        name="emergency_contact_phone"
                                        required
                                        autoComplete="emergency_contact_phone"
                                        placeholder="Telefono de contacto de emergencia"
                                    />
                                </div>
                                <Button>Agregar</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
