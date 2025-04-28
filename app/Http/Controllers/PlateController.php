<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterRequest;
use App\Http\Requests\PlateRequest;
use App\Http\Resources\PlateResource;
use App\Http\Responses\ApiResponse;
use App\Models\Plate;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;

class PlateController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:VIEW PLATES', only: ['index', 'show']),
            new Middleware('permission:REGISTER PLATES', only: ['store']),
            new Middleware('permission:UPDATE PLATES', only: ['update']),
        ];
    }

    public function index(FilterRequest $request)
    {
        try {
            $query = Plate::query();
            $query->filterByState($request->input('state'))
                ->filterByItem($request->input('item'))
                ->filterByDescription($request->input('search'))
                ->filterBySerie($request->input('code'))
                ->filterByItemName($request->input('item_name'))
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
            $plates = $query->paginate($perPage);

            if ($plates->isEmpty()) {
                return ApiResponse::error("There're not registered plates.", 200);
            }

            $collection = PlateResource::collection($plates);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Plates found.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('An error unexpected ocurred.', 500, $e->getMessage());
        }
    }

    public function store(PlateRequest $request)
    {
        try {
            DB::beginTransaction();
            $plate = Plate::create($request->validated());
            DB::commit();
            return ApiResponse::success('Plate registered successfully.', 201, $plate);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('An error occurred while registering the plate.', 500, $e->getMessage());
        }
    }

   
    public function show(Plate $plate)
    {
        try {
            return ApiResponse::success('Plate found.', 200, PlateResource::make($plate));
        } catch (\Exception $e) {
            return ApiResponse::error('An error unexpected ocurred.', 500, $e->getMessage());
        }
    }

    public function update(PlateRequest $request, Plate $plate)
    {
        try {
            DB::beginTransaction();
            $plate->update($request->validated());
            DB::commit();
            return ApiResponse::success('Plate updated succesfully.', 200, $plate);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('An error occurred while updating the plate.', 500, $e->getMessage());
        }
    }

}
