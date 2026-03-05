import { Search } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { SidebarInput } from '@/components/ui/sidebar';
import { useDebouncedSearch } from '@/hooks/use-debounced-search';
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group';

export default function SearchForm() {
    const { value, setValue } = useDebouncedSearch('search', 400);

    return (
        <div className="relative">
            <InputGroup className="max-w-xs">
                <InputGroupInput
                    id="search"
                    placeholder="Search...."
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <InputGroupAddon>
                    <Search />
                </InputGroupAddon>
            </InputGroup>
        </div>
    );
}
