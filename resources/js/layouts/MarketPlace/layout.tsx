import { Link, router, usePage } from '@inertiajs/react';
import { Package, SlidersHorizontal } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { create, index } from '@/routes/my-items';

export interface MarketCategory {
  id: number;
  name: string;
  slug: string;
  items_count?: number;
}

export interface MarketplaceFilters {
  search?: string;
  category?: string;
  sort?: string;
  payment_type?: string;
}

type MarketplaceLayoutProps = {
  children: ReactNode;
  categories?: MarketCategory[];
  filters?: MarketplaceFilters;
  totalCount?: number;
};

const SORT_OPTIONS = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'oldest', label: 'Más antiguos' },
  { value: 'price_asc', label: 'Menor precio' },
  { value: 'price_desc', label: 'Mayor precio' },
] as const;

const PAYMENT_OPTIONS = [
  { value: 'all', label: 'Cualquier pago' },
  { value: 'money', label: 'Dinero' },
  { value: 'swap', label: 'Trueque' },
] as const;

function buildParams(
  current: MarketplaceFilters,
  update: Partial<MarketplaceFilters>
): Record<string, string> {
  const merged: Record<string, string | undefined> = {
    ...current,
    ...update,
    page: undefined, // siempre vuelve a la página 1 al filtrar
  };

  return Object.fromEntries(
    Object.entries(merged).filter(([, v]) => v !== undefined && v !== 'all' && v !== '') as [
      string,
      string,
    ][]
  );
}

export default function MarketplaceLayout({
  children,
  categories = [],
  filters = {},
  totalCount = 0,
}: MarketplaceLayoutProps) {
  const { component } = usePage();
  const activeCategory = filters.category ?? 'all';
  const activeSort = filters.sort ?? 'newest';
  const activePayment = filters.payment_type ?? 'all';
  const hasActiveFilters = activeCategory !== 'all' || activePayment !== 'all';

  const isMyItemsPage = component === 'Marketplace/MyItems';

  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const offStart = router.on('start', () => setIsNavigating(true));
    const offFinish = router.on('finish', () => setIsNavigating(false));
    return () => {
      offStart();
      offFinish();
    };
  }, []);

  const applyFilter = (key: keyof MarketplaceFilters, value: string) => {
    router.get(window.location.pathname, buildParams(filters, { [key]: value }), {
      preserveState: true,
      preserveScroll: false,
      replace: true,
    });
  };

  const clearFilters = () => {
    router.get(window.location.pathname, {}, { replace: true });
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6">
      <PageHeader
        title={isMyItemsPage ? 'Mis publicaciones' : 'Marketplace LOB'}
        description={
          isMyItemsPage
            ? 'Administra los artículos que has publicado.'
            : 'Compra, vende o intercambia artículos con otros colaboradores.'
        }
        eyebrow="Servicios"
        actions={
          <Button asChild>
            <Link href={isMyItemsPage ? create() : index()}>
              {isMyItemsPage ? 'Publicar artículo' : 'Mis publicaciones'}
            </Link>
          </Button>
        }
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {isNavigating
              ? 'Cargando…'
              : `${totalCount} ${totalCount === 1 ? 'artículo' : 'artículos'}`}
          </span>
          {hasActiveFilters && !isNavigating && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 sm:flex">
            {!isMyItemsPage && (
              <Select value={activePayment} onValueChange={(v) => applyFilter('payment_type', v)}>
                <SelectTrigger className="h-9 w-[140px] text-xs">
                  <SelectValue placeholder="Tipo de pago" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={activeSort} onValueChange={(v) => applyFilter('sort', v)}>
              <SelectTrigger className="h-9 w-[155px] text-xs">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="sm:hidden"
                aria-label="Abrir filtros"
              >
                <SlidersHorizontal />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-xl p-4">
              <SheetHeader className="px-0 text-left">
                <SheetTitle>Filtros y orden</SheetTitle>
                <SheetDescription>Ajusta los artículos que quieres ver.</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 pb-4">
                {!isMyItemsPage && (
                  <Select
                    value={activePayment}
                    onValueChange={(v) => applyFilter('payment_type', v)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Tipo de pago" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Select value={activeSort} onValueChange={(v) => applyFilter('sort', v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {categories.length > 0 && (
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* "Todos" siempre primero */}
          <CategoryPill
            label="Todos"
            active={activeCategory === 'all'}
            onClick={() => applyFilter('category', 'all')}
          />

          {categories.map((cat) => (
            <CategoryPill
              key={cat.id}
              label={cat.name}
              count={cat.items_count}
              active={activeCategory === cat.slug}
              onClick={() => applyFilter('category', cat.slug)}
            />
          ))}
        </div>
      )}

      <Separator />

      <div
        className={cn(
          'grid gap-4 transition-opacity duration-200',
          'grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6',
          isNavigating && 'pointer-events-none opacity-50'
        )}
      >
        {totalCount === 0 ? (
          <EmptyState hasFilters={hasActiveFilters} onClearFilters={clearFilters} />
        ) : (
          children
        )}
      </div>
    </div>
  );
}

interface CategoryPillProps {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}

function CategoryPill({ label, count, active, onClick }: CategoryPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex-shrink-0 rounded-full border px-3 py-1 text-xs font-medium',
        'transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-none',
        'focus-visible:ring-ring focus-visible:ring-offset-2',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : [
              'border-border bg-background text-muted-foreground',
              'hover:border-primary/60 hover:text-foreground',
            ]
      )}
    >
      {label}
      {count !== undefined && (
        <span className={cn('ml-1', active ? 'opacity-70' : 'opacity-50')}>({count})</span>
      )}
    </button>
  );
}

interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

function EmptyState({ hasFilters, onClearFilters }: EmptyStateProps) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center gap-3 py-24 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Package className="h-6 w-6 text-muted-foreground" />
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium">
          {hasFilters ? 'Sin resultados para estos filtros' : 'El mercado está vacío'}
        </p>
        <p className="text-xs text-muted-foreground">
          {hasFilters
            ? 'Prueba con otra categoría o tipo de pago.'
            : 'Sé el primero en publicar un artículo.'}
        </p>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-1 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent"
        >
          Ver todos los artículos
        </button>
      )}
    </div>
  );
}
