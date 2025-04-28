<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterRequest;
use App\Http\Requests\OfficeLocationRequest;
use App\Http\Resources\OfficeLocationResource;
use App\Http\Responses\ApiResponse;
use App\Models\OfficeLocation;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;

class OfficeLocationController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:VIEW OFFICE LOCATIONS', only: ['show']),
            new Middleware('permission:REGISTER OFFICE LOCATIONS', only: ['store']),
            new Middleware('permission:UPDATE OFFICE LOCATIONS', only: ['update']),
        ];
    }

    public function index(FilterRequest $request)
    {
        try {
            $query = OfficeLocation::query();
            // dump($query);
            $query->filterByState($request->input('state'))
                ->filterByOffice($request->input('office'))
                ->filterByPlace($request->input('place'))
                // ->filterByCoordinates($request->input('coordinates'))
                ->filterByOfficeName($request->input('office_name'))
                ->filterByPlaceName($request->input('place_name'))
                ->filterByStateName($request->input('state_name'))
                ->filterByDates($request->input('start_date'), $request->input('end_date'));

            if ($request->filled('sort_by')) {
                try {
                    $query->sort($request->input('sort_by'), $request->input('sort_order', 'asc'));
                } catch (\Exception $e) {
                    return ApiResponse::error('Error in sorting', 400, $e->getMessage());
                }
            }

            $perPage = $request->input('row_num');
            $office_locations = $query->paginate($perPage);

            if ($office_locations->isEmpty()) {
                return ApiResponse::error("There're not registered office locations.", 200);
            }

            $collection = OfficeLocationResource::collection($office_locations);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Office locations found.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('An error unexpected ocurred.', 500, $e->getMessage());
        }
    }

    public function store(OfficeLocationRequest $request)
    {
        try {
            DB::beginTransaction();
            $office_location = OfficeLocation::create($request->validated());
            DB::commit();
            return ApiResponse::success('Office location registered successfully.', 201, $office_location);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('An error occurred while registering the office location.', 500, $e->getMessage());
        }
    }

    public function show(OfficeLocation $officeLocation)
    {
        try {
            return ApiResponse::success('Office location found.', 200, OfficeLocationResource::make($officeLocation));
        } catch (\Exception $e) {
            return ApiResponse::error('An error unexpected ocurred.', 500, $e->getMessage());
        }
    }

    public function update(OfficeLocationRequest $request, OfficeLocation $officeLocation)
    {
        try {
            DB::beginTransaction();
            $officeLocation->update($request->validated());
            DB::commit();
            return ApiResponse::success('Office location updated succesfully.', 200, $officeLocation);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('An error occurred while updating the office location.', 500, $e->getMessage());
        }
    }
}
