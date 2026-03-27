import { Bell, File, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { router, usePage } from '@inertiajs/react';
import { Badge } from './ui/badge';
import { edit } from '@/routes/employeeFiles';
import { Avatar } from './ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { show } from '@/routes/notifications';

type Notification = {
    id: string;
    data: { message: string; type: string; note: string };
    read_at: string | null;
};

export default function ButtonNotification() {
    const { notifications } = usePage<{ notifications: Notification[] }>()
        .props;

    console.log(notifications);
    const markAsRead = (id: string, type: string) => {
        if (type === 'file') {
            router.patch(
                `/notifications/${id}/read`,
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        router.get(edit().url);
                    },
                },
            );
        } else if (type === 'comunication') {
            router.patch(
                `/notifications/${id}/read`,
                {},
                {
                    preserveScroll: true,
                },
            );
        }
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
            <PopoverContent
                align="center"
                className="z-[1000] w-96 bg-background p-0"
            >
                <div className="flex items-center justify-between p-4">
                    <h4>Notificaciones</h4>
                </div>
                <ScrollArea className="h-full">
                    {notifications.length === 0 ? (
                        <p className="p-4 text-center text-sm text-muted-foreground">
                            Sin notificaciones
                        </p>
                    ) : (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                onClick={() => markAsRead(n.id, n.data.type)}
                                className="border-xl m-3 flex items-center gap-3 bg-sidebar p-4 hover:cursor-pointer hover:bg-muted"
                            >
                                <Avatar className="h-16 w-16 items-center justify-center rounded-full bg-muted">
                                    <AvatarFallback>
                                        {n.data.type === 'file' && (
                                            <File className="h-4 w-4 shrink-0 text-muted-foreground" />
                                        )}

                                        {n.data.type === 'comunication' && (
                                            <Megaphone className="h-4 w-4 shrink-0 text-muted-foreground" />
                                        )}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="text-sm">{n.data.message}</p>
                                    {n.data.note && (
                                        <p className="text-xs text-muted-foreground">
                                            {n.data.note}
                                        </p>
                                    )}
                                </div>
                                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-400" />
                            </div>
                        ))
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
