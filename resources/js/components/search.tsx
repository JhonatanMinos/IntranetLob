import { Search } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { SidebarInput } from '@/components/ui/sidebar';
import { useDebouncedSearch } from '@/hooks/use-debounced-search';

export default function SearchForm() {
    const { value, setValue } = useDebouncedSearch('search', 400);

    return (
        <div className="relative">
            <Label htmlFor="search" className="sr-only">
                Search
            </Label>
            <SidebarInput
                id="search"
                placeholder="escribe para buscar..."
                className="h-8 pl-7"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
        </div>
    );
}
