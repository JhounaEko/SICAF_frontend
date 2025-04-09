<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterRequest;
use App\Http\Requests\IncreaseTypeRequest;
use App\Http\Resources\IncreaseTypeResource;
use App\Http\Responses\ApiResponse;
use App\Models\IncreaseType;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;

class IncreaseTypeController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:VIEW INCREASE_TYPES', only: ['index', 'show']),
            new Middleware('permission:REGISTER INCREASE_TYPES', only: ['store']),
            new Middleware('permission:UPDATE INCREASE_TYPES', only: ['update'])
        ];
    }
    public function index(FilterRequest $request)
    {
        try {
            $query = IncreaseType::query();
            $query->filterByState($request->input('state'))
                ->filterByNameOrDescription($request->input('search'))
                ->filterByDates($request->input('start_date'), $request->input('end_date'));

            if ($request->filled('sort_by')) {
                try {
                    $query->sort($request->input('sort_by'), $request->input('sort_order', 'asc'));
                } catch (\Exception $e) {
                    return ApiResponse::error('Error in sorting.', 400, $e->getMessage());
                }
            }
            $perPage = $request->input('row_num');
            $increaseType = $query->paginate($perPage);
            if ($increaseType->isEmpty()) {
                return ApiResponse::error("There're not registered increase types.", 200);
            }

            $collection = IncreaseTypeResource::collection($increaseType);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Increase types found', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('An unexpected error ocurred.', 500, $e->getMessage());
        }
    }

    public function store(IncreaseTypeRequest $request)
    {
        try {
            DB::beginTransaction();
            $increaseType = IncreaseType::create($request->validated());
            DB::commit();
            return ApiResponse::success('Increase type created succesfully.', 201, $increaseType);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('An error occurred while registering the increase type.', 500, $e->getMessage());
        }
    }

    public function show(IncreaseType $increaseType)
    {
        try {
            return ApiResponse::success('Increase type found.', 200, IncreaseTypeResource::make($increaseType));
        } catch (\Exception $e) {
            return ApiResponse::error('An error unexpected.', 500, $e->getMessage());
        }
    }

    public function update(IncreaseTypeRequest $request, IncreaseType $increaseType)
    {
        try {
            DB::beginTransaction();
            $increaseType->update($request->validated());
            DB::commit();
            return ApiResponse::success('Increase type updated successfully.', 200, $increaseType);
        } catch (\Exception $e) {
            return ApiResponse::error('An error occurred while updating the increase type.', 500, $e->getMessage());
        }
    }
}
