import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
    <Pagination className="pt-4">
      <PaginationContent className="flex w-full flex-row justify-between">
        <div>
          <Badge>total: {meta.total}</Badge>
        </div>
        <div>
          <span>
            Pagina {current_page}/{last_page}
          </span>
        </div>
        <div className="flex flex-row gap-2">
          <PaginationItem>
            {links.prev ? (
              <Link href={links.prev} className={cn(buttonVariants({ variant: 'outline' }))}>
                <ChevronLeft /> Prev
              </Link>
            ) : (
              <span
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'cursor-not-allowed opacity-50'
                )}
              >
                <ChevronLeft /> Prev
              </span>
            )}
          </PaginationItem>
          <PaginationItem>
            {links.next ? (
              <Link href={links.next} className={cn(buttonVariants({ variant: 'outline' }))}>
                Next <ChevronRight />
              </Link>
            ) : (
              <span
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'cursor-not-allowed opacity-50'
                )}
              >
                Next <ChevronRight />
              </span>
            )}
          </PaginationItem>
        </div>
      </PaginationContent>
    </Pagination>
  );
}
