<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

/**
 * @OA\Info(
 *     version="1.0.0",
 *     title="IntranetLOB API",
 *     description="API de Intranet Empresarial - Gestión integral de usuarios, tiendas, eventos, notificaciones y más",
 *     contact={
 *         "name": "IntranetLOB Support",
 *         "email": "support@intranetlob.com"
 *     }
 * )
 * @OA\Server(
 *     url="/",
 *     description="API Server"
 * )
 * @OA\SecurityScheme(
 *     type="apiKey",
 *     name="Authorization",
 *     in="header",
 *     securityScheme="api_key",
 * )
 */
abstract class Controller
{
    use AuthorizesRequests;
}
