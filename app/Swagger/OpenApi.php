<?php

namespace App\Swagger;

use OpenApi\Attributes as OA;

#[OA\OpenApi(
    info: new OA\Info(
        version: '1.0.0',
        title: 'IntranetLOB API',
        description: 'Sistema de intranet corporativa - API REST',
        contact: new OA\Contact(
            name: 'Equipo de Desarrollo',
            email: '[email protected]'
        )
    ),
    servers: [
        new OA\Server(
            url: 'http://localhost:8000',
            description: 'Servidor de Desarrollo'
        ),
        new OA\Server(
            url: 'https://intranet.tuempresa.com',
            description: 'Servidor de Producción'
        )
    ]
)]
#[OA\SecurityScheme(
    securityScheme: 'sanctum',
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT'
)]

class OpenApi {}
