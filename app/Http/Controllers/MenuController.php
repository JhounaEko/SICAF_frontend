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
            new Middleware('permission:VER MENÚS', only: ['index', 'show']),
            new Middleware('permission:REGISTRAR MENÚS', only: ['store']),
            new Middleware('permission:ACTUALIZAR MENÚS', only: ['update']),
        ];
    }

    public function index(FilterRequest $request)
    {
        try {
            $query = Menu::query();

            $query->filterByState($request->input('state'))
                ->filterByLabelOrRoute($request->input('search'))
                ->filterByStateName($request->input('state_name'))
                ->filterByDates($request->input('start_date'), $request->input('end_date'));

            if ($request->filled('sort_by')) {
                try {
                    $query->sort($request->input('sort_by'), $request->input('sort_order', 'asc'));
                } catch (\Exception $e) {
                    return ApiResponse::error('Error al ordenar.', 400, $e->getMessage());
                }
            }

            if ($request->boolean('include_hierarchy')) {
                $menus = $query->whereNull('parent') // Filtra solo los menús de nivel superior
                      ->with(['childMenus.childMenus', 'state']) // Carga la jerarquía y el estado
                      ->paginate(10);
            } else {
                $menus = $query->with('state')->paginate(10);
            }

            if ($menus->isEmpty()) {
                return ApiResponse::error('No hay menús registrados.', 200);
            }

            $collection = $request->boolean('simple_view')
                ? SimpleMenuResource::collection($menus)
                : MenuResource::collection($menus);

            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Menús encontrados.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
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
}
