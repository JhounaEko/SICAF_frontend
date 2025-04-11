<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
<<<<<<< HEAD
    | or "middleware". This determines what cross-origin operations may execute
=======
    | or "CORS". This determines what cross-origin operations may execute
>>>>>>> 595971771846d108dc12d3d1d63d05ae2f6206f7
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

<<<<<<< HEAD
    'paths' => ['api/*', 'sanctum/csrf-cookie','*'],

    'allowed_methods' => ['GET, POST, PUT, DELETE, OPTIONS, PATCH'],

    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['Content-Type', 'Authorization'],

    'exposed_headers' => [],

    'max_age' => 86400,
=======
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://dominio'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,
>>>>>>> 595971771846d108dc12d3d1d63d05ae2f6206f7

    'supports_credentials' => false,

];
