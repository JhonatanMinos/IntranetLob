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

interface NewsCardProps {
  news: Notification[];
}

export function NewsCard({ news }: NewsCardProps) {
  if (!news.length) return <p className="text-muted-foreground">No hay noticias disponibles.</p>;
  return (
    <div>
      <h2 className="text-2xl">Noticias y Articulos</h2>
      <div className="grid grid-cols-3 gap-4 lg:grid-cols-3 lg:gap-8">
        {news.map(({ publishedAt, title, content, imagenPath, type, id }) => (
          <Card key={id} className="relative">
            <div className="absolute inset-0 z-30 aspect-video bg-black/40" />
            {imagenPath && (
              <img
                src={`/storage/${imagenPath}`}
                alt="Event cover"
                className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
              />
            )}
            <CardHeader>
              <CardAction>
                <Badge variant="secondary" className="uppercase">
                  {type}
                </Badge>
              </CardAction>
              <CardTitle>{title}</CardTitle>
              <CardDescription>
                {content.length > 100 ? `${content.slice(0, 100)}...` : content} -{' '}
                {publishedAt
                  ? new Date(publishedAt).toLocaleDateString('es-MX', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                  : null}{' '}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={show({ notification: id }).url}>Ver notificación</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
