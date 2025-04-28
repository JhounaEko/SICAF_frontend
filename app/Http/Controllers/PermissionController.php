<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterRequest;
use App\Http\Requests\PermissionRequest;
use App\Http\Resources\PermissionResource;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;
use App\Models\Permission;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;

class PermissionController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:VIEW PERMISSIONS', only: ['index', 'show']),
            new Middleware('permission:REGISTER PERMISSIONS', only: ['store']),
            new Middleware('permission:UPDATE PERMISSIONS', only: ['update']),
        ];
    }

    public function index(FilterRequest $request) {
        try {
            $query = Permission::query();
            
            $query->filterByState($request->input('state_id'))
                ->filterByName($request->input('search'))
                ->filterByStateName($request->input('state_name'))
                ->filterByDates($request->input('start_date'), $request->input('end_date'));
            if ($request->filled('sort_by')) {
                try {
                    $query->sort($request->input('sort_by'), $request->input('sort_order', 'asc'));
                } catch (\Exception $e) {
                    return ApiResponse::error('Error al ordenar.', 400, $e->getMessage());
                }
            }
            
            $perPage = $request->input('row_num');
            $permissions = $query->paginate($perPage);

            if ($permissions->isEmpty()) {
                return ApiResponse::error('No hay permisos registrados.', 200);
            }

            $collection = PermissionResource::collection($permissions);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Permisos encontrados.', 200, $responseData);

        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function store(PermissionRequest $request) {
        try {
            DB::beginTransaction();
            $permission = Permission::create($request->validated());
            DB::commit();
            return ApiResponse::success('Permiso registrado exitosamente.', 201, $permission);
        } catch (\Exception $e) {
            DB::rollBack(); 
            return ApiResponse::error('Ocurrió un error al registrar el permiso.', 500, $e->getMessage());
        }
    }
    
    public function show(Permission $permission){
        try {
            return ApiResponse::success('Permiso encontrado.', 200, PermissionResource::make($permission));
        } catch (\Illuminate\Database\QueryException $e) {
            return ApiResponse::error('Ocurrió un error en la base de datos.', 500, $e->getMessage());
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function update(PermissionRequest $request, Permission $permission) {
        try {
            DB::beginTransaction();
            $permission->update($request->validated());
            DB::commit();
            return ApiResponse::success('Permiso actualizado exitosamente.', 200, $permission);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Ocurrió un error al actualizar el permiso.', 500, $e->getMessage());
        }
    }
}
