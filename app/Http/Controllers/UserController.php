<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterRequest;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Http\Responses\ApiResponse;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(FilterRequest $request) {
        try {
            $query = User::query();
            $query->filterByState($request->input('state'))
                ->filterByOffice($request->input('office'))
                ->filterByUsername($request->input('username'))
                ->filterByEmail($request->input('email'))
                ->filterByName($request->input('search'))
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
            $user = User::create($request->validated());
            return ApiResponse::success('User registered successfully.', 201, $user);
        } catch (\Exception $e) {
            return ApiResponse::error('An error unexpected ocurred', 500, $e->getMessage());
        }
    }
    public function show($id) {
        try {
            if (!is_numeric($id)) {
                return ApiResponse::error('Invalid ID format.', 400);
            }
            $state = User::find($id);
            if (!$state) {
                return ApiResponse::error('User not found.', 200);
            }
            return ApiResponse::success('User found', 200, UserResource::make($state));
        } catch (\Exception $e) {
            return ApiResponse::error('An error unexpected.', 500, $e->getMessage());
        }
    }
    public function update(UserRequest $request, $id) {
        try {
            if (!is_numeric($id)) {
                return ApiResponse::error('Invalid ID format.', 400);
            }
            $user = User::find($id);
            if (!$user) {
                return ApiResponse::error('User not found.', 200);
            }
            $user->update($request->validated());
            return ApiResponse::success('User updated succesfully.', 200, $user);
        } catch (\Exception $e) {
            return ApiResponse::error('An error unexpected.', 500, $e->getMessage());
        }
    }
}
