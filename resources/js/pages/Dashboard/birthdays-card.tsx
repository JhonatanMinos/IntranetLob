import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Cake } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useInitials } from '@/hooks/use-initials';

interface BirthDays {
  id: number;
  name: string;
  position: string;
  birthday: string;
}

export function BirthDays({ birthdays }: BirthDays[]) {
  const getInitials = useInitials();
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Cake className="h-5 w-5 text-primary" />
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
          Cumpleaños
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="space-y-6 sm:h-[150px] md:h-[300px]">
          {birthdays?.map(({ id, name, position, birthday }) => (
            <div key={id} className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
              <div className="text-center">
                <Avatar>
                  <AvatarFallback>{getInitials(name)}</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <p className="textsm font-bold text-primary">{name}</p>
                <p className="text-[10px] text-muted-foreground uppercase">{position}</p>
              </div>
              <div className="ml-auto self-center">
                <Badge>
                  {format(new Date(birthday), 'dd MMMM', {
                    locale: es,
                  })}
                </Badge>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
