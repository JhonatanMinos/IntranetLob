import DocumentRowStatus from '@/components/DocumentRowStatus';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import EmployeeFilesLayout from '@/layouts/employeeFiles/layout';
import { index as files, show } from '@/routes/employeeFiles';
import type { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Fingerprint, GraduationCap, Users } from 'lucide-react';

type DocumentStatus = 'pending' | 'approved' | 'rejected' | null;

type Document = {
    path: string | null;
    status: DocumentStatus;
    note: string | null;
};

type EmployeeFile = {
    id: number;
    emergency_contact_name: string | null;
    emergency_contact_phone: string | null;
    documents: Record<string, Document>;
    user_id: number;
    user: {
        name: string;
        position: string;
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

export default function Status() {
    const { employeeFile } = usePage<{ employeeFile: EmployeeFile }>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Expedientes', href: files().url },
        {
            title: 'Status',
            href: employeeFile.id
                ? show({ employeeFile: employeeFile.id }).url
                : '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Status" />
            <EmployeeFilesLayout>
                <Card className="mb-4">
                    <CardHeader>
                        <CardTitle>{employeeFile.user.name}</CardTitle>
                        <CardDescription>
                            {employeeFile.user.position}
                        </CardDescription>
                    </CardHeader>
                </Card>
                {documentGroups.map((group) => {
                    const Icon = group.icon;
                    return (
                        <div key={group.id}>
                            <div className="my-5 flex items-center gap-3">
                                <Icon className="h-9 w-9 text-muted-foreground" />
                                <span className="text-sm font-bold tracking-wider uppercase">
                                    {group.label}
                                </span>
                            </div>
                            <Card>
                                <CardContent className="divide-y p-0">
                                    {group.docs.map(
                                        ({ key, label, description }) => (
                                            <DocumentRowStatus
                                                key={key}
                                                docKey={key}
                                                label={label}
                                                description={description}
                                                doc={
                                                    employeeFile.documents?.[
                                                        key
                                                    ] ?? {
                                                        path: null,
                                                        status: null,
                                                        note: null,
                                                    }
                                                }
                                                employeeFile={employeeFile.id}
                                            />
                                        ),
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    );
                })}
            </EmployeeFilesLayout>
        </AppLayout>
    );
}
