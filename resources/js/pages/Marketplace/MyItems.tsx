import type { PageProps } from '@inertiajs/core';
import { Head, usePage } from '@inertiajs/react';
import ItemCard, { type MarketItem } from '@/components/Marketplace/ItemCard';
import PaginationGeneric from '@/components/pagination';
import AppLayout from '@/layouts/app-layout';
import MarketplaceLayout from '@/layouts/MarketPlace/layout';
import { index as marketplace } from '@/routes/marketplace';
import { index as myItem } from '@/routes/my-items';
import type { BreadcrumbItem, PaginatedResponse } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'MarketPlaceLOB',
    href: marketplace().url,
  },
  {
    title: 'Mis publicaciones',
    href: myItem().url,
  },
];

interface MyItemsProps extends PageProps {
  items: PaginatedResponse<MarketItem>;
  filters: {
    search?: string;
  };
}

export default function MyItems() {
  const { items, filters } = usePage<MyItemsProps>().props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Mis ventas" />
      <MarketplaceLayout filters={filters} totalCount={items.meta.total}>
        {items?.data.map((item) => (
          <ItemCard key={item.id} item={item} manageable />
        ))}
      </MarketplaceLayout>
      <PaginationGeneric links={items.links} meta={items.meta} />
    </AppLayout>
  );
}
