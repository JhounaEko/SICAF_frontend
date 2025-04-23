<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterRequest;
use App\Http\Requests\SummaryRequest;
use App\Http\Resources\SummaryResource;
use App\Http\Responses\ApiResponse;
use App\Models\Summary;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;

class SummaryController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:VIEW SUMMARIES', only: ['index', 'show']),
            new Middleware('permission:REGISTER SUMMARIES', only: ['store']),
            new Middleware('permission:UPDATE SUMMARIES', only: ['update']),
        ];
    }

    public function index(FilterRequest $request)
    {
        try {
            $query = Summary::query();
            $query->filterByState($request->input('state'))
                ->filterByRubric($request->input('search'))
                ->filterByAcquisitionCost($request->input('acquisition_cost'))
                ->filterByAccumulatedDepreciation($request->input('accumulated_depreciation'))
                ->filterByAssetCost($request->input('asset_cost'))
                ->filterByCurrentCost($request->input('current_cost'))
                ->filterByAnnualDepreciation($request->input('annual_depreciation'))
                ->filterByCurrentDepreciation($request->input('current_depreciation'))
                ->filterByTotalAcumulatedDepreciation($request->input('total_accumulated_depreciation'))
                ->filterByNetValue($request->input('net_value'))
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
            $summaries = $query->paginate($perPage);

            if ($summaries->isEmpty()) {
                return ApiResponse::error("There're not registered summaries.", 200);
            }

            $collection = SummaryResource::collection($summaries);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Summaries found.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('An error unexpected ocurred.', 500, $e->getMessage());
        }
    }

    public function store(SummaryRequest $request)
    {
        try {
            DB::beginTransaction();
            $item_group = Summary::create($request->validated());
            DB::commit();
            return ApiResponse::success('Summary registered successfully.', 201, $item_group);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('An error occurred while registering the summary.', 500, $e->getMessage());
        }
    }

    public function show(Summary $summary)
    {
        try {
            return ApiResponse::success('Summary found.', 200, SummaryResource::make($summary));
        } catch (\Exception $e) {
            return ApiResponse::error('An error unexpected ocurred.', 500, $e->getMessage());
        }
    }

    public function update(SummaryRequest $request, Summary $summary)
    {
        try {
            DB::beginTransaction();
            $summary->update($request->validated());
            DB::commit();
            return ApiResponse::success('Summary updated succesfully.', 200, $summary);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('An error unexpected ocurred.', 500, $e->getMessage());
        }
    }
}
