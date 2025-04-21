<?php

namespace App\Http\Controllers;

use App\Http\Requests\CorrelativeRequest;
use App\Http\Requests\FilterRequest;
use App\Http\Resources\CorrelativeResource;
use App\Http\Responses\ApiResponse;
use App\Models\Correlative;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;

class CorrelativeController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:VIEW CORRELATIVES', only: ['index', 'show']),
            new Middleware('permission:REGISTER CORRELATIVES', only: ['store']),
            new Middleware('permission:UPDATE CORRELATIVES', only: ['update']),
        ];
    }

    public function index(FilterRequest $request)
    {
        try {
            $query = Correlative::query();
            $query->filterByState($request->input('state'))
                ->filterByDescription($request->input('search'))
                ->filterByLimitDate($request->input('date'))
                ->filterByCurrentNumber($request->input('value_number'))
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
            $correlatives = $query->paginate($perPage);

            if ($correlatives->isEmpty()) {
                return ApiResponse::error("There're not registered correlatives.", 200);
            }

            $collection = CorrelativeResource::collection($correlatives);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Correlatives found.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('An error unexpected ocurred.', 500, $e->getMessage());
        }
    }

    public function store(CorrelativeRequest $request)
    {
        try {
            DB::beginTransaction();
            $correlative = Correlative::create($request->validated());
            DB::commit();
            return ApiResponse::success('Correlative registered successfully.', 201, $correlative);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('An error occurred while registering the correlative.', 500, $e->getMessage());
        }
    }

    public function show(Correlative $correlative)
    {
        try {
            return ApiResponse::success('Correlative found.', 200, CorrelativeResource::make($correlative));
        } catch (\Exception $e) {
            return ApiResponse::error('An error unexpected ocurred.', 500, $e->getMessage());
        }
    }

    public function update(CorrelativeRequest $request, Correlative $correlative)
    {
        try {
            DB::beginTransaction();
            $correlative->update($request->validated());
            DB::commit();
            return ApiResponse::success('Correlative updated succesfully.', 200, $correlative);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('An error unexpected ocurred.', 500, $e->getMessage());
        }
    }
}
