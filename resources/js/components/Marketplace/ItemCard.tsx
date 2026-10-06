import { Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { destroy, edit } from '@/routes/my-items';

export interface MarketItem {
  id: number;
  title: string;
  description: string;
  price: string | null;
  price_formatted: string;
  type: string;
  status: string;
  user_id: number;
  seller?: string | null;
  category?: string | null;
  cover_url?: string | null;
}

export default function ItemCard({
  item,
  manageable = false,
}: {
  item: MarketItem;
  manageable?: boolean;
}) {
  return (
    <Card className="w-full overflow-hidden">
      {item.cover_url && (
        <img
          src={item.cover_url}
          alt={item.title}
          className="aspect-video w-full object-cover"
          loading="lazy"
        />
      )}
      <CardHeader>
        <Badge variant="secondary">{item.price_formatted}</Badge>
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="whitespace-pre-wrap text-sm">{item.description}</p>
        <p className="text-xs text-muted-foreground">
          {item.category}
          {item.seller ? ` · ${item.seller}` : ''}
        </p>
      </CardContent>
      {manageable && (
        <CardFooter className="gap-2">
          <Button asChild variant="outline">
            <Link href={edit(item.id)}>Editar</Link>
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (window.confirm('¿Eliminar esta publicación?'))
                router.delete(destroy(item.id).url);
            }}
          >
            Eliminar
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
