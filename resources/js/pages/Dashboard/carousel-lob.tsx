import Autoplay from 'embla-carousel-autoplay';
import * as React from 'react';
import banner1 from '@/assets/media/01banner.jpg';
import banner2 from '@/assets/media/02banner.jpg';
import banner from '@/assets/media/banner.jpg';
import { Card } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

export function CarouselLob() {
    const slides = [
        {
            title: 'Objetivo General',
            content:
                'Reconocer a nuestro cliente mejor que nadie, con propuestas de moda superiores. Posicionarse como la marca de moda juvenil emblemática de México y motivar a nuestros clientes para que se sientan atractivos, jóvenes y en tendencia.',
            image: banner,
        },
        {
            title: 'Nosotros',
            content:
                'En LOB nos dedicamos a ofrecer moda y calidad al mejor precio a través de nuestras colecciones inspiradas en las tendencias mundiales. El principal objetivo es inspirar nuestro cliente, facilitarle su compra y que siempre pueda encontrar la mejor opción de moda. Nuestra diversa gama de colecciones les permite vestir con un estilo propio; y de esta forma les brindamos la vanguardia en tendencias que reúnen cuatro características principales: Moda, Calidad, Innovación y Precio.',
            image: banner1,
        },
        {
            title: 'Nuestra filosofía',
            content:
                'LOB celebra la juventud a cualquier edad con diseños siempre en tendencia para el mercado de México. Los productos que diseña son justo lo que sus clientes sueñan para sus ocasiones esperadas y su reacción al verlos es de sorpresa. Ofrecemos moda siempre pensando en el diseño, calidad, innovación y precio justo. ',
            image: banner2,
        },
    ];

    return (
        <Carousel
            plugins={[
                Autoplay({
                    delay: 4000,
                }),
            ]}
            className="w-full"
        >
            <CarouselContent className="h-full w-full">
                {slides.map(({ title, content, image }, index) => (
                    <CarouselItem
                        key={index}
                        className="flex h-full w-full items-center justify-center"
                    >
                        <Card className="max-w-4xl p-10">
                            <div className="-m-10 mb-2 overflow-hidden rounded-t-lg">
                                <img
                                    src={image}
                                    className="h-56 w-full object-cover"
                                />
                            </div>
                            <h2 className="mb-4 text-3xl font-bold">{title}</h2>
                            <p className="text-base leading-relaxed whitespace-pre-line">
                                {content}
                            </p>
                        </Card>
                    </CarouselItem>
                ))}
            </CarouselContent>

            <CarouselPrevious className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white p-2 shadow" />
            <CarouselNext className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white p-2 shadow" />
        </Carousel>
    );
}
