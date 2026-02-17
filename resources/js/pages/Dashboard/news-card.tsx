import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardTitle,
    CardHeader,
    CardDescription,
    CardFooter,
} from '@/components/ui/card';

interface News {
    date: string;
    title: string;
    description: string;
    img: string;
    type: string;
}

const news: News[] = [
    {
        date: '2026-02-24',
        title: 'Nuevo Articulo',
        description: 'lorems impulls',
        img: 'https://avatar.vercel.sh/shadcn1',
        type: 'Featured',
    },
    {
        date: '2026-02-27',
        title: 'Nueva noticia',
        description: 'lorems impulls ',
        img: 'https://avatar.vercel.sh/shadcn1',
        type: 'Featured',
    },
];

export function NewsCard() {
    return (
        <div>
            <h2 className="text-2xl">Noticias y Articulos</h2>
            <div className="grid grid-cols-3 gap-4 lg:grid-cols-3 lg:gap-8">
                {news.map(({ date, title, description, img, type }, index) => (
                    <Card key={index} className="relative">
                        <div className="absolute inset-0 z-30 aspect-video bg-black/40" />
                        <img
                            src={img}
                            alt="Event cover"
                            className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
                        />
                        <CardHeader>
                            <CardAction>
                                <Badge variant="secondary">{type}</Badge>
                            </CardAction>
                            <CardTitle>{title}</CardTitle>
                            <CardDescription>
                                {description} - {date}
                            </CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Button className="w-full">View Event</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
