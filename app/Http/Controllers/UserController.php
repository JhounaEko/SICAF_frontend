<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterRequest;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Http\Responses\ApiResponse;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\DB;

class UserController extends Controller implements HasMiddleware
{
    use AuthorizesRequests;
    public static function middleware()
    {
        return [
            new Middleware('permission:VIEW USERS', only: ['index']),
            new Middleware('permission:REGISTER USERS', only: ['store']),
        ];
    }

    public function index(FilterRequest $request) {
        try {
            $query = User::query();
            $query->filterByState($request->input('state'))
                ->filterByOffice($request->input('office'))
                ->filterByUsername($request->input('username'))
                ->filterByEmail($request->input('email'))
                ->filterByName($request->input('search'))
                ->filterByOfficeName($request->input('office_name')) 
                ->filterByOfficeInitials($request->input('office_initials'))
                ->filterByDates($request->input('start_date'), $request->input('end_date'));
            
            if($request->filled('sort_by')){
                try {
                    $query->sort($request->input('sort_by'), $request->input('sort_order', 'asc'));
                } catch (\Exception $e) {
                    return ApiResponse::error('Error in sorting', 400, $e->getMessage());
                }
            }

            $users = $query->paginate(10);

            if ($users->isEmpty()) {
                return ApiResponse::error("There're not registered users.", 200);
            }
            
            $collection = UserResource::collection($users);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Users found', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('An error unexpected ocurred.', 500, $e->getMessage());
        }
    }
    public function store(UserRequest $request) {
        try {
            DB::beginTransaction();
            $user = User::create($request->validated());
            if ($request->has('roles')) {
                $user->assignRole($request->input('roles'));
            }
            DB::commit();
            return ApiResponse::success('User registered successfully.', 201, $user);
        } catch (\Exception $e) {
            DB::rollBack(); 
            return ApiResponse::error('An error unexpected ocurred', 500, $e->getMessage());
        }
    }
    public function show(User $user) {
        $this->authorize('view', $user);
        try {
            return ApiResponse::success('User found', 200, UserResource::make($user));
        } 
        catch (\Exception $e) {
            return ApiResponse::error('An error unexpected.', 500, $e->getMessage());
        }
    }
    public function update(UserRequest $request, User $user) {
        $this->authorize('view', $user);
        try {
            DB::beginTransaction();
            $user->update($request->validated());
    
            if ($request->has('roles')) {
                $user->syncRoles($request->input('roles'));
            }
            DB::commit();
            return ApiResponse::success('User updated succesfully.', 200, $user);
        } catch (\Exception $e) {
            DB::rollBack(); 
            return ApiResponse::error('An error unexpected.', 500, $e->getMessage());
        }
    }
}
