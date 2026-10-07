import type { PageProps } from '@inertiajs/core';
import { Head, usePage } from '@inertiajs/react';
import { Building2 } from 'lucide-react';
import PaginationGeneric from '@/components/pagination';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useFlash } from '@/hooks/use-flash';
import AppLayout from '@/layouts/app-layout';
import RrhhLayout from '@/layouts/rrhh/layout';
import { index as company } from '@/routes/company';
import type { BreadcrumbItem, PaginatedResponse, SimpleModel } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Capital Humano', href: '/rrhh' },
  { title: 'Compañías', href: company().url },
];

interface CompanyProps extends PageProps {
  data: PaginatedResponse<SimpleModel>;
}

export default function Company() {
  const { data } = usePage<CompanyProps>().props;

  useFlash();

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Capital Humano" />
      <RrhhLayout>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((companys) => (
            <Card key={companys.id}>
              <CardHeader className="flex justify-center">
                <Avatar className="h-20 w-20 overflow-hidden rounded-full">
                  <AvatarFallback>
                    <Building2 className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center gap-4">
                <p>{companys.name}</p>
              </CardContent>
              <Separator />
              <CardFooter></CardFooter>
            </Card>
          ))}
        </div>
        {data.meta.total >= 10 && <PaginationGeneric links={data.links} meta={data.meta} />}
      </RrhhLayout>
    </AppLayout>
  );
}
