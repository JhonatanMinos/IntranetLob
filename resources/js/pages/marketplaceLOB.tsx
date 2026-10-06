import type { PageProps } from '@inertiajs/core';
import { Head, usePage } from '@inertiajs/react';
import ItemCard, { type MarketItem } from '@/components/Marketplace/ItemCard';
import PaginationGeneric from '@/components/pagination';
import AppLayout from '@/layouts/app-layout';
import MarketplaceLayout from '@/layouts/MarketPlace/layout';
import { index as marketplace } from '@/routes/marketplace';
import type { BreadcrumbItem, PaginatedResponse } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'MarketPlaceLOB',
    href: marketplace().url,
  },
];

type category = {
  id: number;
  name: string;
  slug: string;
};

interface MarketplaceProps extends PageProps {
  items: PaginatedResponse<MarketItem>;
  categories: category[];
  filters: {
    search?: string;
    category?: string;
    sort?: string;
    payment_type?: string;
  };
}

export default function MarketPlaceLOB() {
  const { items, categories, filters } = usePage<MarketplaceProps>().props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="MarketPlaceLOB" />
      <MarketplaceLayout totalCount={items.meta.total} filters={filters} categories={categories}>
        {items?.data.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </MarketplaceLayout>
      <PaginationGeneric links={items.links} meta={items.meta} />
    </AppLayout>
  );
}
