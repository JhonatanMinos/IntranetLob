import { Link, router } from '@inertiajs/react';
import { ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/confirm-dialog';
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
  const [confirmOpen, setConfirmOpen] = useState(false);
  return (
    <Card className="h-full w-full overflow-hidden pt-0 transition-shadow hover:shadow-md">
      {item.cover_url ? (
        <img
          src={item.cover_url}
          alt={item.title}
          className="aspect-video w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex aspect-video items-center justify-center bg-muted text-muted-foreground">
          <ImageIcon className="size-8" aria-hidden="true" />
        </div>
      )}
      <CardHeader className="gap-3">
        <Badge className="w-fit">{item.price_formatted}</Badge>
        <CardTitle className="line-clamp-2">{item.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-2">
        <p className="line-clamp-2 whitespace-pre-wrap text-sm text-muted-foreground">
          {item.description}
        </p>
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
          <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
            Eliminar
          </Button>
        </CardFooter>
      )}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Eliminar “${item.title}”`}
        description="La publicación desaparecerá del marketplace. Esta acción no se puede deshacer."
        onConfirm={() => router.delete(destroy(item.id).url)}
      />
    </Card>
  );
}
