import { Bell, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { router, usePage } from '@inertiajs/react';
import { Badge } from './ui/badge';

type Notification = {
  id: string;
  data: { message: string; type: string; note: string };
  read_at: string | null;
};

export default function ButtonNotification() {
  const { notifications } = usePage<{ notifications: Notification[] }>().props;

  const markAsRead = (id: string) => {
    router.patch(`/notifications/${id}/read`, {}, { preserveScroll: true });
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications.length !== 0 && (
            <Badge className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {notifications.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="center" className="z-[1000] w-96 p-0">
        <div className="flex items-center justify-between p-4">
          <h4>Notificaciones</h4>
        </div>
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">Sin notificaciones</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className="flex items-center gap-3 border-b p-4 hover:cursor-pointer hover:bg-muted"
              >
                {/* Indicador no leído */}
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-400" />

                {/* Icono por tipo */}
                {n.data.type === 'file' && (
                  <File className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}

                <div className="flex-1">
                  <p className="text-sm">{n.data.message}</p>
                  {n.data.note && <p className="text-xs text-muted-foreground">{n.data.note}</p>}
                </div>
              </div>
            ))
          )}
        </ScrollArea>{' '}
      </PopoverContent>
    </Popover>
  );
}
