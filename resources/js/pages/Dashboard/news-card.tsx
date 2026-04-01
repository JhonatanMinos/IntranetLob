import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import type { Notification } from '@/types';
import { show } from '@/routes/notifications';
import { Link } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface NewsCardProps {
    news: Notification[];
}

const badgeColor: Record<string, string> = {
    avisos: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
    adn: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
    beneficios: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    colaboradores:
        'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
};

const placeholderIcon: Record<string, string> = {
    avisos: '⚠️',
    adn: '🧬',
    beneficios: '🎁',
    colaboradores: '🤝',
};

export function NewsCard({ news }: NewsCardProps) {
    if (!news.length)
        return (
            <p className="text-muted-foreground">
                No hay noticias disponibles.
            </p>
        );
    return (
        <div>
            <h2 className="mb-10 text-2xl">Noticias y Artículos</h2>
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {news.map(
                    ({ publishedAt, title, content, imagenPath, type, id }) => (
                        <Card
                            key={id}
                            className="flex w-full flex-col overflow-hidden pt-0"
                        >
                            {!!imagenPath ? (
                                <div className="relative aspect-video w-full shrink-0">
                                    <div className="absolute inset-0 z-10 bg-black/35" />
                                    <img
                                        src={`/storage/${imagenPath}`}
                                        alt={title}
                                        className="h-full w-full object-cover brightness-75 dark:brightness-50"
                                    />
                                </div>
                            ) : (
                                <div
                                    className={`flex aspect-video w-full items-center justify-center ${badgeColor[type] ?? 'bg-muted'}`}
                                >
                                    <span className="text-4xl">
                                        {placeholderIcon[type] ?? '📋'}
                                    </span>
                                </div>
                            )}
                            <CardHeader className="flex-1">
                                <CardAction>
                                    <Badge
                                        variant="secondary"
                                        className={`uppercase ${badgeColor[type] ?? 'bg-gray-100 text-gray-700'}`}
                                    >
                                        {type}
                                    </Badge>
                                </CardAction>
                                <CardTitle className="line-clamp-2">
                                    {title}
                                </CardTitle>
                                <CardDescription>
                                    <div
                                        className="prose prose-sm max-h-20 max-w-none overflow-hidden [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)] dark:prose-invert"
                                        dangerouslySetInnerHTML={{
                                            __html: content,
                                        }}
                                    />
                                    {publishedAt && (
                                        <time
                                            dateTime={publishedAt}
                                            className="block text-xs text-muted-foreground"
                                        >
                                            {format(
                                                parseISO(publishedAt),
                                                "dd 'de' MMMM, yyyy",
                                                { locale: es },
                                            )}
                                        </time>
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link href={show({ notification: id }).url}>
                                        Ver notificación
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ),
                )}
            </div>
        </div>
    );
}
