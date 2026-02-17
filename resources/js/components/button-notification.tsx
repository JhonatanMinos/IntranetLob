import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export default function ButtonNotification() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="center" className="z-[1000] w-96 p-0">
        <div className="flex items-center justify-between p-4">
          <h4>Notificaciones</h4>
        </div>
        <Separator />
        <ScrollArea className="h-80">
          <div>hola</div>
          <Separator />
          <div>adios</div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
