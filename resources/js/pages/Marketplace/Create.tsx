import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { index, store, update } from '@/routes/my-items';

interface Listing {
  id: number;
  title: string;
  description: string;
  category_id: number;
  listing_type: string;
  price: string | null;
  status: string;
}

export default function CreateMarketplace({
  categories,
  item,
}: {
  categories: { id: number; name: string }[];
  item?: Listing;
}) {
  const form = useForm({
    title: item?.title ?? '',
    description: item?.description ?? '',
    category_id: item?.category_id.toString() ?? '',
    listing_type: item?.listing_type ?? 'sale',
    price: item?.price ?? '',
    status: item?.status ?? 'available',
  });
  return (
    <AppLayout breadcrumbs={[{ title: 'Mis publicaciones', href: index().url }]}>
      <Head title={item ? 'Editar publicación' : 'Publicar artículo'} />
      <form
        className="mx-auto w-full max-w-xl space-y-4 p-6"
        onSubmit={(event) => {
          event.preventDefault();
          if (item) form.put(update(item.id).url);
          else form.post(store().url);
        }}
      >
        <h1 className="text-xl font-semibold">
          {item ? 'Editar publicación' : 'Publicar artículo'}
        </h1>
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={form.data.title}
          onChange={(e) => form.setData('title', e.target.value)}
          required
          maxLength={255}
        />
        <InputError message={form.errors.title} />
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={form.data.description}
          onChange={(e) => form.setData('description', e.target.value)}
          required
          maxLength={10000}
        />
        <InputError message={form.errors.description} />
        <Label htmlFor="category">Categoría</Label>
        <select
          id="category"
          className="w-full rounded-md border bg-background p-2"
          value={form.data.category_id}
          onChange={(e) => form.setData('category_id', e.target.value)}
          required
        >
          <option value="">Selecciona una categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <InputError message={form.errors.category_id} />
        {categories.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No hay categorías disponibles para publicar.
          </p>
        )}
        <Label htmlFor="listing-type">Tipo de publicación</Label>
        <select
          id="listing-type"
          className="w-full rounded-md border bg-background p-2"
          value={form.data.listing_type}
          onChange={(e) => form.setData('listing_type', e.target.value)}
        >
          <option value="sale">Venta</option>
          <option value="swap">Trueque</option>
          <option value="both">Venta o trueque</option>
        </select>
        <InputError message={form.errors.listing_type} />
        <Label htmlFor="price">Precio</Label>
        <Input
          id="price"
          type="number"
          min="0"
          step="0.01"
          value={form.data.price}
          required={form.data.listing_type !== 'swap'}
          onChange={(e) => form.setData('price', e.target.value)}
        />
        <InputError message={form.errors.price} />
        <Label htmlFor="status">Estado</Label>
        <select
          id="status"
          className="w-full rounded-md border bg-background p-2"
          value={form.data.status}
          onChange={(e) => form.setData('status', e.target.value)}
        >
          <option value="available">Disponible</option>
          <option value="draft">Borrador</option>
          <option value="reserved">Reservado</option>
          <option value="sold">Vendido</option>
          <option value="cancelled">Cancelado</option>
        </select>
        <InputError message={form.errors.status} />
        <div className="flex gap-3">
          <Button type="submit" disabled={form.processing || categories.length === 0}>
            {form.processing ? 'Guardando…' : 'Guardar publicación'}
          </Button>
          <Button asChild variant="outline">
            <Link href={index()}>Cancelar</Link>
          </Button>
        </div>
      </form>
    </AppLayout>
  );
}
