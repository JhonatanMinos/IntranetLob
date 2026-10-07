import { Link } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
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
import { show } from '@/routes/notifications';
import type { Notification } from '@/types';

interface NewsCardProps {
  news: Notification[];
}

const badgeColor: Record<string, string> = {
  avisos: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
  adn: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
  beneficios: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  colaboradores: 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
};

const placeholderIcon: Record<string, string> = {
  avisos: '⚠️',
  adn: '🧬',
  beneficios: '🎁',
  colaboradores: '🤝',
};

export function NewsCard({ news }: NewsCardProps) {
  if (!news.length) return <p className="text-muted-foreground">No hay noticias disponibles.</p>;
  return (
    <div>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-wider text-primary uppercase">Actualidad</p>
          <h2 className="text-2xl font-semibold tracking-tight">Noticias y artículos</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
        {news.map(({ publishedAt, title, content, imagenPath, type, id }) => (
          <Card
            key={id}
            className="group flex h-full w-full flex-col overflow-hidden pt-0 transition-shadow hover:shadow-md"
          >
            {imagenPath ? (
              <div className="relative aspect-video w-full shrink-0">
                <div className="absolute inset-0 z-10 bg-black/35" />
                <img
                  src={`/storage/${imagenPath}`}
                  alt={title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
            ) : (
              <div
                className={`flex aspect-video w-full items-center justify-center ${badgeColor[type] ?? 'bg-muted'}`}
              >
                <span className="text-4xl">{placeholderIcon[type] ?? '📋'}</span>
              </div>
            )}
            <CardHeader className="flex-1">
              <CardAction>
                <Badge
                  variant="secondary"
                  className={`uppercase ${badgeColor[type] ?? 'bg-muted text-muted-foreground'}`}
                >
                  {type}
                </Badge>
              </CardAction>
              <CardTitle className="line-clamp-2">{title}</CardTitle>
              <CardDescription className="space-y-3">
                <p className="line-clamp-3 leading-relaxed">
                  {content
                    .replace(/<[^>]*>/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim()}
                </p>
                {publishedAt && (
                  <time dateTime={publishedAt} className="block text-xs text-muted-foreground">
                    {format(parseISO(publishedAt), "dd 'de' MMMM, yyyy", { locale: es })}
                  </time>
                )}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href={show({ notification: id }).url}>Ver notificación</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
