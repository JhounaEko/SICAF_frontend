<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterRequest;
use App\Http\Requests\RoleRequest;
use App\Http\Resources\RoleResource;
use App\Http\Responses\ApiResponse;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;

class RoleController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:VIEW ROLES', only: ['index', 'show']),
            new Middleware('permission:REGISTER ROLES', only: ['store']),
            new Middleware('permission:UPDATE ROLES', only: ['update']),
        ];
    }

    public function index(FilterRequest $request)
    {
        try {
            $query = Role::query();

            $query->filterByState($request->input('state'))
                ->filterByName($request->input('search'))
                ->filterByDates($request->input('start_date'), $request->input('end_date'));

            if ($request->filled('sort_by')) {
                try {
                    $query->sort($request->input('sort_by'), $request->input('sort_order', 'asc'));
                } catch (\Exception $e) {
                    return ApiResponse::error('Error al ordenar.', 400, $e->getMessage());
                }
            }
            
            $perPage = $request->input('row_num');
            $roles = $query->paginate($perPage);

            if ($roles->isEmpty()) {
                return ApiResponse::error('No hay roles registrados.', 200);
            }

            $collection = RoleResource::collection($roles);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Roles encontrados.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function store(RoleRequest $request)
    {
        try {
            DB::beginTransaction();
            $role = Role::create($request->validated());

            if ($request->has('permissions')) {
                $role->syncPermissions($request->input('permissions'));
            }

            if ($request->has('menus')) {
                $role->menus()->sync($request->input('menus'));
            }
            DB::commit();
            return ApiResponse::success('Rol registrado exitosamente.', 201, $role->load(['permissions', 'menus']));
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Ocurrió un error al registrar el rol.', 500, $e->getMessage());
        }
    }

    public function show(Role $role)
    {
        try {
            return ApiResponse::success('Rol encontrado.', 200, RoleResource::make($role));
        } catch (\Illuminate\Database\QueryException $e) {
            return ApiResponse::error('Ocurrió un error en la base de datos.', 500, $e->getMessage());
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function update(RoleRequest $request, Role $role)
    {
        try {
            DB::beginTransaction();
            $role->update($request->validated());

            if ($request->has('permissions')) {
                $role->syncPermissions($request->input('permissions'));
            }

            if ($request->has('menus')) {
                $role->menus()->sync($request->input('menus'));
            }
            DB::commit();
            return ApiResponse::success('Rol actualizado exitosamente.', 200, $role->load(['permissions', 'menus']));
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Ocurrió un error al actualizar el rol.', 500, $e->getMessage());
        }
    }
}
