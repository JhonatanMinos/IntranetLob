import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export function useDebouncedSearch(key = 'search', delay = 400) {
  const params = new URLSearchParams(window.location.search);
  const initial = params.get(key) || '';

  const [value, setValue] = useState(initial);

  const previousValueRef = useRef(initial);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const previousValue = previousValueRef.current;

      // Solo hacer petición si hay un cambio real en la búsqueda
      if (value === previousValue) return;

      previousValueRef.current = value;

      const newParams = new URLSearchParams(window.location.search);
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }

      router.get(window.location.pathname, Object.fromEntries(newParams), {
        preserveState: true,
        replace: true,
      });
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, key, delay]);

  return { value, setValue };
}
