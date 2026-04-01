import { format, getDaysInMonth, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarDays, Calendars, CalendarX } from 'lucide-react';
import {
  Label,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; // ajusta la ruta según tu estructura
import { type ChartConfig, ChartContainer } from '@/components/ui/chart';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { EVENT_BADGE } from '@/lib/arrays';

const today = new Date();
const dayOfMonth = today.getDate();
const daysInMonth = getDaysInMonth(today);

const chartData = [
  {
    name: 'month-progress',
    visitors: dayOfMonth,
    fill: 'var(--color-safari)',
  },
];

const chartConfig = {
  visitors: { label: 'Día', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;

type CalendarEvent = {
  id: string;
  title: string;
  start_date: Date;
  end_date: Date;
  type: 'birthday' | 'holiday' | 'event' | 'launch';
};

interface CalendarAgendaProps {
  setOpen: (open: boolean) => void;
  events: CalendarEvent[];
}

export function EventsCard({ setOpen, events }: CalendarAgendaProps) {
  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row items-center gap-2">
        <Calendars className="h-5 w-5 text-primary" />
        <CardTitle className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Evento
        </CardTitle>
      </CardHeader>

      <CardContent className="pb-0">
        <div className="relative">
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[220px]">
            <RadialBarChart
              width={220}
              height={220}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={100}
              barSize={10}
              data={chartData}
              startAngle={90}
              endAngle={-270}
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="none"
                className="first:fill-muted last:fill-background"
                polarRadius={[86, 74]}
              />
              <PolarAngleAxis type="number" domain={[0, daysInMonth]} tick={false} />
              <RadialBar dataKey="visitors" background cornerRadius={10} />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-4xl font-bold"
                          >
                            {dayOfMonth}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy ?? 0) + 24}
                            className="fill-muted-foreground text-sm uppercase"
                          >
                            {format(today, 'MMMM', {
                              locale: es,
                            })}
                          </tspan>
                        </text>
                      );
                    }
                    return null;
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-4 right-4 rounded-full"
                onClick={() => setOpen(true)}
              >
                <CalendarDays />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Calendario</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="w-full space-y-3">
          {events?.length > 0 ? (
            events?.map(({ id, title, type, start_date }) => (
              <div key={id} className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
                <div className="text-center">
                  <p className="text-sm font-bold text-primary">
                    {format(parseISO(start_date), 'dd')}
                  </p>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {format(parseISO(start_date), 'MMM')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-medium capitalize ${EVENT_BADGE[type] ?? 'bg-muted text-muted-foreground'}`}
                  >
                    {type}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center gap-2 py-4">
              <CalendarX className="h-5 w-5 text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground">Sin eventos este mes</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
