import { router } from '@inertiajs/react';
import {
  CalendarDays,
  FileText,
  LoaderCircle,
  Megaphone,
  Search,
  ShoppingBag,
  Store,
  Users,
} from 'lucide-react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ContentState } from '@/components/content-state';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type SearchResultType = 'user' | 'store' | 'event' | 'notification' | 'marketplace' | 'document';

type SearchResult = {
  id: string;
  group: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  url: string;
  external?: boolean;
};

const resultIcons = {
  user: Users,
  store: Store,
  event: CalendarDays,
  notification: Megaphone,
  marketplace: ShoppingBag,
  document: FileText,
} satisfies Record<SearchResultType, typeof Search>;

export default function SearchForm() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const normalizedQuery = query.trim();

  useEffect(() => {
    const openSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener('keydown', openSearch);
    return () => window.removeEventListener('keydown', openSearch);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    window.requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  useEffect(() => {
    if (normalizedQuery.length < 2) {
      setResults([]);
      setLoading(false);
      setError(false);
      setActiveIndex(-1);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setLoading(true);
      setError(false);

      try {
        const response = await fetch(`/global-search?q=${encodeURIComponent(normalizedQuery)}`, {
          headers: { Accept: 'application/json' },
          credentials: 'same-origin',
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('No se pudo completar la búsqueda.');
        }

        const payload = (await response.json()) as { data: SearchResult[] };
        setResults(payload.data);
        setActiveIndex(payload.data.length > 0 ? 0 : -1);
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') {
          return;
        }

        setResults([]);
        setError(true);
        setActiveIndex(-1);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [normalizedQuery]);

  const groupedResults = useMemo(
    () =>
      results.reduce<Record<string, SearchResult[]>>((groups, result) => {
        groups[result.group] ??= [];
        groups[result.group].push(result);
        return groups;
      }, {}),
    [results]
  );

  const navigateToResult = (result: SearchResult) => {
    setOpen(false);

    if (result.external) {
      window.open(result.url, '_blank', 'noopener,noreferrer');
      return;
    }

    router.visit(result.url);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (results.length === 0) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % results.length);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((current) => (current <= 0 ? results.length - 1 : current - 1));
    }

    if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      navigateToResult(results[activeIndex]);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex size-9 items-center justify-center rounded-md border border-input bg-background text-muted-foreground shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:w-64 sm:justify-start sm:gap-2 sm:px-3"
        aria-label="Abrir búsqueda global"
      >
        <Search className="size-4 shrink-0" />
        <span className="hidden flex-1 truncate text-left text-sm sm:block">
          Buscar en la intranet...
        </span>
        <kbd className="pointer-events-none hidden rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground lg:inline-flex">
          Ctrl K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="top-[12vh] max-h-[80vh] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-2xl"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">Búsqueda global</DialogTitle>
          <DialogDescription className="sr-only">
            Busca colaboradores, tiendas, eventos, avisos, artículos y documentos.
          </DialogDescription>

          <div className="flex items-center gap-3 border-b px-4">
            {loading ? (
              <LoaderCircle className="size-5 shrink-0 animate-spin text-primary" />
            ) : (
              <Search className="size-5 shrink-0 text-muted-foreground" />
            )}
            <Input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Buscar personas, tiendas, documentos..."
              className="h-14 border-0 px-0 text-base shadow-none focus-visible:ring-0"
              role="combobox"
              aria-expanded={results.length > 0}
              aria-controls="global-search-results"
              aria-activedescendant={activeIndex >= 0 ? results[activeIndex]?.id : undefined}
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                Limpiar
              </button>
            )}
          </div>

          <ScrollArea className="h-[min(60vh,32rem)]" id="global-search-results">
            <div className="p-2" role="listbox" aria-label="Resultados de búsqueda">
              {normalizedQuery.length < 2 && (
                <div className="flex h-48 flex-col items-center justify-center gap-3 px-6 text-center">
                  <div className="rounded-full bg-primary/10 p-3 text-primary">
                    <Search className="size-6" />
                  </div>
                  <div>
                    <p className="font-medium">Busca en toda la intranet</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Escribe al menos dos caracteres para comenzar.
                    </p>
                  </div>
                </div>
              )}

              {loading && (
                <div className="space-y-3 p-2" role="status" aria-label="Buscando">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <Skeleton className="size-9 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-2/5" />
                        <Skeleton className="h-3 w-3/5" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && error && (
                <ContentState
                  variant="error"
                  title="No pudimos realizar la búsqueda"
                  description="Revisa tu conexión e inténtalo de nuevo."
                  className="min-h-48 border-0 bg-transparent"
                />
              )}

              {!loading && !error && normalizedQuery.length >= 2 && results.length === 0 && (
                <ContentState
                  title={`Sin resultados para “${normalizedQuery}”`}
                  description="Prueba con un nombre, tienda, tema o documento diferente."
                  className="min-h-48 border-0 bg-transparent"
                />
              )}

              {!loading &&
                !error &&
                Object.entries(groupedResults).map(([group, groupResults]) => (
                  <section key={group} className="py-1">
                    <h3 className="px-3 py-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      {group}
                    </h3>
                    {groupResults.map((result) => {
                      const Icon = resultIcons[result.type];
                      const resultIndex = results.findIndex((item) => item.id === result.id);

                      return (
                        <button
                          key={result.id}
                          id={result.id}
                          type="button"
                          role="option"
                          aria-selected={resultIndex === activeIndex}
                          onMouseEnter={() => setActiveIndex(resultIndex)}
                          onClick={() => navigateToResult(result)}
                          className={cn(
                            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left outline-none transition-colors',
                            resultIndex === activeIndex && 'bg-accent text-accent-foreground'
                          )}
                        >
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background text-muted-foreground">
                            <Icon className="size-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">
                              {result.title}
                            </span>
                            {result.subtitle && (
                              <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                                {result.subtitle}
                              </span>
                            )}
                          </span>
                          {result.external && (
                            <span className="text-[10px] text-muted-foreground uppercase">
                              Nueva pestaña
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </section>
                ))}
            </div>
          </ScrollArea>

          <div className="hidden items-center gap-4 border-t bg-muted/30 px-4 py-2 text-[11px] text-muted-foreground sm:flex">
            <span>↑↓ Navegar</span>
            <span>↵ Abrir</span>
            <span>Esc Cerrar</span>
            {results.length > 0 && <span className="ml-auto">{results.length} resultados</span>}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
