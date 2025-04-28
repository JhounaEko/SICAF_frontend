<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Config;

class SetSortableColumns
{

    public function handle(Request $request, Closure $next): Response
    {
        $routeName = $request->route() ? $request->route()->getName() : null;
        $sortableColumns = [];
        // Leer las columnas ordenables permitidas desde el archivo de configuración
        $sortableColumnsMapping = Config::get('sortable.sortable_columns');
        // Buscar las columnas permitidas para la ruta actual
        if ($routeName && isset($sortableColumnsMapping[$routeName])) {
            $sortableColumns = $sortableColumnsMapping[$routeName];
        } 
        // Añadir las columnas permitidas al request para que el controlador/query scope las use
        $request->merge(['sortable_columns' => $sortableColumns]);
        return $next($request);
    }
}
