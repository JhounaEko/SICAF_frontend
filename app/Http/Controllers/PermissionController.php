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
            
            $query->filterByState($request->input('state'))
                ->filterByName($request->input('search'))
                ->filterByDates($request->input('start_date'), $request->input('end_date'));
            
            if ($request->filled('sort_by')) {
                try {
                    $query->sort($request->input('sort_by'), $request->input('sort_order', 'asc'));
                } catch (\Exception $e) {
                    return ApiResponse::error('Error in sorting.', 400, $e->getMessage());
                }
            }
            
            $perPage = $request->input('row_num');
            $permissions = $query->paginate($perPage);

            if ($permissions->isEmpty()) {
                return ApiResponse::error("There're not registered permissions.", 200);
            }

            $collection = PermissionResource::collection($permissions);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Permissions found.', 200, $responseData);

        } catch (\Exception $e) {
            return ApiResponse::error('An unexpected error ocurred.', 500, $e->getMessage());
        }
    }

    public function store(PermissionRequest $request) {
        try {
            DB::beginTransaction();
            $permission = Permission::create($request->validated());
            DB::commit();
            return ApiResponse::success('Permission registered successfully', 201, $permission);
        } catch (\Exception $e) {
            DB::rollBack(); 
            return ApiResponse::error('An error occurred while registering the permission.', 500, $e->getMessage());
        }
    }
    
    public function show($id){
        try {
            if(!is_numeric($id)){
                return ApiResponse::error('Invalid ID format.', 400);
            }

            $permission = Permission::find($id);
            if (!$permission) {
                return ApiResponse::error('Permission not found.', 200);
            } 
            return ApiResponse::success('Permission found.', 200, PermissionResource::make($permission));
        } catch (\Illuminate\Database\QueryException $e) {
            return ApiResponse::error('Database error occurred.', 500, $e->getMessage());
        } catch (\Exception $e) {
            return ApiResponse::error('An unexpected error occurred.', 500, $e->getMessage());
        }
    }

    public function update(PermissionRequest $request, $id) {
        try {
            DB::beginTransaction();
            if (!is_numeric($id)) {
                return ApiResponse::error('Invalid ID format.', 400);
            }
            $permission = Permission::find($id);
            if (!$permission) {
                return ApiResponse::error('Permission not found.', 200);
            }
            $permission->update($request->validated());
            DB::commit();
            return ApiResponse::success('Permission updated succesfully.', 200, $permission);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('An error unexpected.', 500, $e->getMessage());
        }
    }

    
}
