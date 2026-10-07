import { router } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { usePersistentState } from '@/hooks/use-persistent-state';

interface PersistentPageSearchProps {
  preferenceKey: string;
  placeholder: string;
}

export function PersistentPageSearch({ preferenceKey, placeholder }: PersistentPageSearchProps) {
  const initialQuery =
    typeof window === 'undefined'
      ? ''
      : new URLSearchParams(window.location.search).get('search') || '';
  const [value, setValue] = usePersistentState(`filters:${preferenceKey}:search`, initialQuery);
  const previousValue = useRef(initialQuery);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      if (initialQuery) {
        previousValue.current = initialQuery;
        setValue(initialQuery);
      }
      return;
    }

    if (initialQuery !== previousValue.current) {
      previousValue.current = initialQuery;
      setValue(initialQuery);
    }
  }, [initialQuery, setValue]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (value === previousValue.current) return;
      previousValue.current = value;

      const params = new URLSearchParams(window.location.search);
      params.delete('page');
      if (value.trim()) params.set('search', value.trim());
      else params.delete('search');

      router.get(window.location.pathname, Object.fromEntries(params), {
        preserveState: true,
        preserveScroll: true,
        replace: true,
      });
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [value]);

  return (
    <InputGroup className="w-full sm:max-w-sm">
      <InputGroupAddon>
        <Search aria-hidden="true" />
      </InputGroupAddon>
      <InputGroupInput
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      {value && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton onClick={() => setValue('')} aria-label="Limpiar búsqueda">
            <X />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
