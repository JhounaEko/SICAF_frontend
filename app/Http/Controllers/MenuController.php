<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterRequest;
use App\Http\Requests\MenuRequest;
use App\Http\Resources\MenuResource;
use App\Http\Resources\SimpleMenuResource;
use App\Http\Responses\ApiResponse;
use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;

class MenuController extends Controller
// implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:VIEW MENUS', only: ['index', 'show']),
            new Middleware('permission:REGISTER MENUS', only: ['store']),
            new Middleware('permission:UPDATE MENUS', only: ['update']),
        ];
    }

    public function index(FilterRequest $request)
    {
        try {
            $query = Menu::with(['parentMenu']);

            $query->filterByState($request->input('state'))
                ->filterByLabelOrRoute($request->input('search'))
                ->filterByStateName($request->input('state_name'))
                ->filterByDates($request->input('start_date'), $request->input('end_date'));

            if ($request->filled('sort_by')) {
                try {
                    $query->sort($request->input('sort_by'), $request->input('sort_order', 'asc'));
                } catch (\Exception $e) {
                    return ApiResponse::error('Error in sorting.', 400, $e->getMessage());
                }
            }

            if ($request->boolean('include_hierarchy')) {
                $query->whereNull('parent') // Filtra solo los menús de nivel superior
                      ->with(['childMenus']);
            } else {
                $query->with('state');
            }


            $perPage = $request->input('row_num'); 
            $menus = $query->paginate($perPage);

            if ($menus->isEmpty()) {
                return ApiResponse::error("There're not registered menus.", 200);
            }


            $collection = MenuResource::collection($menus);
            $responseData = $collection->response()->getData(true);
            return ApiResponse::success('Menus found.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('An unexpected error ocurred.', 500, $e->getMessage());
        }
    }


    public function store(MenuRequest $request)
    {
        try {
            DB::beginTransaction();
            $menu = Menu::create($request->validated());
            DB::commit();
            return ApiResponse::success('Menú registrado exitosamente.', 201, $menu);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Ocurrió un error al registrar el menú.', 500, $e->getMessage());
        }
    }

    public function show(Menu $menu)
    {
        try {
            return ApiResponse::success('Menú encontrado.', 200, MenuResource::make($menu));
        } catch (\Illuminate\Database\QueryException $e) {
            return ApiResponse::error('Ocurrió un error en la base de datos.', 500, $e->getMessage());
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function update(MenuRequest $request, Menu $menu)
    {
        try {
            DB::beginTransaction();
            $menu->update($request->validated());
            DB::commit();
            return ApiResponse::success('Menú actualizado exitosamente.', 200, $menu);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Ocurrió un error al actualizar el menú.', 500, $e->getMessage());
        }
    }

    /** Function auxliar, when get the data, for peticion GET*/
    function buildMenuTree(array $items): array
    {
        $menuMap = [];
        $tree = [];
        $items = $items['data'];  // Asegúrate de que 'data' exista y contenga los elementos
    
        // Crear el mapa de menús
        foreach ($items as $item) {
            if (!isset($item['id'])) {
                continue;
            }
    
            $item['children'] = [];
            $menuMap[$item['id']] = $item;
        }
    
        // Construir la jerarquía del árbol
        foreach ($menuMap as $id => $item) {  // Cambié &$item a $item
            if ($item['parent'] === null) {  // Si no tiene padre, es un nodo raíz
                $tree[] = $item;
            } else {  // Si tiene un padre, agregarlo como hijo
                if (isset($menuMap[$item['parent']])) {
                    $menuMap[$item['parent']]['children'][] = $item;
                }
            }
        }
    
        // Limpiar el árbol (eliminar 'children' vacíos)
        $clean = function (&$nodes) use (&$clean) {
            foreach ($nodes as &$node) {
                if (empty($node['children'])) {
                    unset($node['children']);
                } else {
                    $clean($node['children']);
                }
            }
        };
    
        $clean($tree);
    
        // Devolver el árbol en lugar de el mapa plano
        return $tree;
    }
}
