import { format, parseISO } from 'date-fns';
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

interface Props {
    birthdays: BirthDays[];
}

export function BirthDays({ birthdays }: Props) {
    const getInitials = useInitials();

    const isToday = (dateStr: string) => {
        const date = parseISO(dateStr);
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth()
        );
    };

    return (
        <Card className="flex-1">
            <CardHeader className="flex flex-row items-center gap-2">
                <Cake className="h-5 w-5 text-primary" />
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
                    Cumpleaños
                </CardTitle>
            </CardHeader>
            <CardContent>
                {!birthdays?.length ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                        Sin cumpleaños próximos
                    </p>
                ) : (
                    <ScrollArea className="sm:h-[150px] md:h-[300px]">
                        <div className="space-y-3">
                            {birthdays?.map(
                                ({ id, name, position, birthday }) => {
                                    const isbirthday = isToday(birthday);
                                    return (
                                        <div
                                            key={id}
                                            className="flex items-center gap-3 rounded-lg bg-muted/40 p-3"
                                        >
                                            <div className="text-center">
                                                <Avatar>
                                                    <AvatarFallback>
                                                        {getInitials(name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-primary">
                                                    {name}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground uppercase">
                                                    {position}
                                                </p>
                                            </div>
                                            <div className="ml-auto shrink-0 self-center">
                                                <Badge
                                                    variant={
                                                        isbirthday
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {isbirthday
                                                        ? '🎂 Hoy'
                                                        : format(
                                                              parseISO(
                                                                  birthday,
                                                              ),
                                                              'dd MMM',
                                                              { locale: es },
                                                          )}
                                                </Badge>
                                            </div>{' '}
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    );
}
