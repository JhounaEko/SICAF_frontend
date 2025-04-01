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
                    return ApiResponse::error('Error in sorting.', 400, $e->getMessage());
                }
            }
            $roles = $query->paginate(10);

            if ($roles->isEmpty()) {
                return ApiResponse::error("There're not registered roles.", 200);
            }

            $collection = RoleResource::collection($roles);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Roles found.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('An unexpected error ocurred.', 500, $e->getMessage());
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
            return ApiResponse::success('Role registered successfully', 201, $role->load(['permissions', 'menus']));
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('An error occurred while registering the role.', 500, $e->getMessage());
        }
    }

    public function show($id)
    {
        try {
            if (!is_numeric($id)) {
                return ApiResponse::error('Invalid ID format.', 400);
            }

            $role = Role::find($id);
            if (!$role) {
                return ApiResponse::error('Role not found.', 200);
            }

            return ApiResponse::success('Role found.', 200, RoleResource::make($role));
        } catch (\Illuminate\Database\QueryException $e) {
            return ApiResponse::error('Database error occurred.', 500, $e->getMessage());
        } catch (\Exception $e) {
            return ApiResponse::error('An unexpected error occurred.', 500, $e->getMessage());
        }
    }

    public function update(RoleRequest $request, $id)
    {
        try {
            DB::beginTransaction();
            if (!is_numeric($id)) {
                return ApiResponse::error('Invalid ID format.', 400);
            }
            $role = Role::find($id);
            if (!$role) {
                return ApiResponse::error('Role not found.', 200);
            }

            $role->update($request->validated());

            if ($request->has('permissions')) {
                $role->syncPermissions($request->input('permissions'));
            }

            if ($request->has('menus')) {
                $role->menus()->sync($request->input('menus'));
            }
            DB::commit();
            return ApiResponse::success('Role updated succesfully.', 200, $role->load(['permissions', 'menus']));
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('An error unexpected.', 500, $e->getMessage());
        }
    }
}
