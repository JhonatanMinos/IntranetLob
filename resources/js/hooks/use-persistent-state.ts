import { usePage } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import type { SharedData } from '@/types';

export function usePersistentState<T>(key: string, initialValue: T) {
  const userId = usePage<SharedData>().props.auth.user.id;
  const storageKey = `intranet:${userId}:${key}`;
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const stored = window.localStorage.getItem(storageKey);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      // La interfaz sigue funcionando si el navegador bloquea el almacenamiento local.
    }
  }, [storageKey, value]);

  const reset = useCallback(() => {
    setValue(initialValue);
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // No requiere acción adicional.
    }
  }, [initialValue, storageKey]);

  return [value, setValue, reset] as const;
}
