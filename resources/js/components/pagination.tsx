import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { buttonVariants } from '@/components/ui/button';

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginationProps {
  links: PaginationLink[];
}

export default function PaginationGeneric({ links }: PaginationProps) {
  console.log(links);
  return (
    <Pagination className="mt-4 justify-center">
      <PaginationContent>
        {links.map((link) => (
          <PaginationItem key={link.label}>
            {link.url ? (
              <Link
                href={link.url}
                className={cn(
                  buttonVariants({
                    variant: link.active ? 'outline' : 'ghost',
                    size: 'icon',
                  })
                )}
              >
                <span
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: La paginación de Laravel usa entidades HTML para las flechas (<< y >>)
                  dangerouslySetInnerHTML={{
                    __html: link.label,
                  }}
                />
              </Link>
            ) : (
              <span className="px-3 py-2">....</span>
            )}
          </PaginationItem>
        ))}
      </PaginationContent>
    </Pagination>
  );
}
