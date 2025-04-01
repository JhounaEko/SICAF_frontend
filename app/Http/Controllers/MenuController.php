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
            $query = Menu::query();

            $query->filterByState($request->input('state'))
                ->filterByLabelOrRoute($request->input('search'))
                ->filterByDates($request->input('start_date'), $request->input('end_date'));

            if ($request->filled('sort_by')) {
                try {
                    $query->sort($request->input('sort_by'), $request->input('sort_order', 'asc'));
                } catch (\Exception $e) {
                    return ApiResponse::error('Error in sorting.', 400, $e->getMessage());
                }
            }

            if ($request->boolean('include_hierarchy')) {
                $menus = $query->whereNull('parent') // Filtra solo los menús de nivel superior
                      ->with(['childMenus.childMenus', 'state']) // Carga la jerarquía (ajusta la profundidad según sea necesario) y el estado
                      ->paginate(10);
            } else {
                $menus = $query->with('state')->paginate(10);
            }


            if ($request->boolean('simple_view')) {
                $collection = SimpleMenuResource::collection($menus);
            } else {
                $collection = MenuResource::collection($menus);
            }


            if ($menus->isEmpty()) {
                return ApiResponse::error("There're not registered menus.", 200);
            }


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
            return ApiResponse::success('Menu registered successfully', 201, $menu);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('An error occurred while registering the menu.', 500, $e->getMessage());
        }
    }

    public function show($id)
    {
        try {
            if (!is_numeric($id)) {
                return ApiResponse::error('Invalid ID format.', 400);
            }

            $menu = Menu::find($id);
            if (!$menu) {
                return ApiResponse::error('Menu not found.', 200);
            }
            return ApiResponse::success('Menu found.', 200, MenuResource::make($menu));
        } catch (\Illuminate\Database\QueryException $e) {
            return ApiResponse::error('Database error occurred.', 500, $e->getMessage());
        } catch (\Exception $e) {
            return ApiResponse::error('An unexpected error occurred.', 500, $e->getMessage());
        }
    }

    public function update(MenuRequest $request, $id)
    {
        try {
            DB::beginTransaction();
            if (!is_numeric($id)) {
                return ApiResponse::error('Invalid ID format.', 400);
            }
            $menu = Menu::find($id);
            if (!$menu) {
                return ApiResponse::error('Menu not found.', 200);
            }
            $menu->update($request->validated());
            DB::commit();
            return ApiResponse::success('Menu updated succesfully.', 200, $menu);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('An error unexpected.', 500, $e->getMessage());
        }
    }
}
