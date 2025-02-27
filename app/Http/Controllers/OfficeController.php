<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterRequest;
use App\Http\Requests\OfficeRequest;
use App\Http\Resources\OfficeResource;
use App\Http\Responses\ApiResponse;
use App\Models\Office;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;


class OfficeController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:VIEW OFFICES', only: ['index', 'show']),
            new Middleware('permission:REGISTER OFFICES', only: ['store']),
            new Middleware('permission:UPDATE OFFICES', only: ['update']),
        ];
    }

    public function index(FilterRequest $request)
    {
        try {
            $query = Office::query();

            $query->filterByState($request->input('state'))
                ->filterByLevel($request->input('level'))
                ->filterByParent($request->input('parent'))
                ->filterByInitialsOrName($request->input('search'))
                ->filterByDates($request->input('start_date'), $request->input('end_date'));

            if ($request->filled('sort_by')) {
                try {
                    $query->sort($request->input('sort_by'), $request->input('sort_order', 'asc'));
                } catch (\Exception $e) {
                    return ApiResponse::error('Error in sorting,', 400, $e->getMessage());
                }
            }

            if ($request->boolean('include_hierarchy')) {
                $offices = $query->with(['childOffices', 'state'])->paginate(10); 
            } else {
                $offices = $query->paginate(10); 
            }

            if ($offices->isEmpty()) {
                return ApiResponse::error("There're not registered offices.", 200);
            }
            
            $collection = OfficeResource::collection($offices);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Offices found.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('An unexpected error ocurred', 500, $e->getMessage());
        }
    }
    public function store(OfficeRequest $request)
    {
        try {
            $office = Office::create($request->validated());
            return ApiResponse::success('Office registered successfully.', 201, $office);
        } catch (\Exception $e) {
            return ApiResponse::error('An error occurred while registering the office.', 500, $e->getMessage());
        }
    }
    public function show(FilterRequest $request, $id)
    {
        try {
            if (!is_numeric($id)) {
                return ApiResponse::error('Invalid ID format.', 400);
            }
            $query = Office::query();

            if ($request->boolean('include_hierarchy')) {
                $query->with(['childOffices']);
            }
            $query->with('state');

            $office = $query->find($id);

            if (!$office) {
                return ApiResponse::error('Office not found.', 200);
            }

            return ApiResponse::success('Office found', 200, OfficeResource::make($office));
        } catch (\Illuminate\Database\QueryException $e) {
            return ApiResponse::error('Database error occurred.', 500, $e->getMessage());
        } catch (\Exception $e) {
            return ApiResponse::error('An unexpected error occurred.', 500, $e->getMessage());
        }
    }

    public function update(OfficeRequest $request, $id)
    {
        try {
            if (!is_numeric($id)) {
                return ApiResponse::error('Invalid ID format.', 400);
            }
            $office = Office::find($id);
            if (!$office) {
                return ApiResponse::error('Office not found.', 200);
            }
            $office->update($request->validated());
            return ApiResponse::success('Office updated succesfully.', 200, $office);
        } catch (\Exception $e) {
            return ApiResponse::error('An unexpected error ocurred', 500, $e->getMessage());
        }
    }
}
