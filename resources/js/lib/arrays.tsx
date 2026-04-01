import { Dna, Sparkles, UsersRound, Megaphone } from 'lucide-react';

export const TYPE_ICONS: Record<string, React.ReactNode> = {
    adn: <Dna className="h-6 w-6" color="#80ff00" />,
    beneficios: <Sparkles color="#0a33f5" className="h-6 w-6" />,
    colaboradores: <UsersRound color="#ff8000" className="h-6 w-6" />,
    avisos: <Megaphone color="#ff0000" className="h-6 w-6" />,
};

export const SUBJECT_OPTIONS = [
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
        children: [{ value: 'obituario', label: 'Obituario' }], // listo para usar
    },
];

export const EVENT_BADGE: Record<string, string> = {
    festivo: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
    evento: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    cumpleanos: 'bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300',
    lanzamiento:
        'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
};
