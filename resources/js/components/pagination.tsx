import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

import type { PaginatedResponse, PaginationMeta } from '@/types';

interface PaginationProps {
  links: PaginatedResponse<unknown>['links'];
  meta: PaginationMeta;
}

export default function PaginationGeneric({ meta, links }: PaginationProps) {
  const { current_page, last_page } = meta;

  return (
    <Pagination className="border-t pt-4">
      <PaginationContent className="flex w-full flex-col gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {meta.from ?? 0}–{meta.to ?? 0} de {meta.total} resultados
        </p>
        <p className="text-sm font-medium">
          Página {current_page} de {last_page}
        </p>
        <div className="flex flex-row gap-2">
          <PaginationItem>
            {links.prev ? (
              <Link href={links.prev} className={cn(buttonVariants({ variant: 'outline' }))}>
                <ChevronLeft /> Anterior
              </Link>
            ) : (
              <span
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'cursor-not-allowed opacity-50'
                )}
              >
                <ChevronLeft /> Anterior
              </span>
            )}
          </PaginationItem>
          <PaginationItem>
            {links.next ? (
              <Link href={links.next} className={cn(buttonVariants({ variant: 'outline' }))}>
                Siguiente <ChevronRight />
              </Link>
            ) : (
              <span
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'cursor-not-allowed opacity-50'
                )}
              >
                Siguiente <ChevronRight />
              </span>
            )}
          </PaginationItem>
        </div>
      </PaginationContent>
    </Pagination>
  );
}
