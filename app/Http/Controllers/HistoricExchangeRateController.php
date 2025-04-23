<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterRequest;
use App\Http\Requests\HistoricExchangeRateRequest;
use App\Http\Resources\HistoricExchangeRateResource;
use App\Http\Responses\ApiResponse;
use App\Models\HistoricExchangeRate;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;

class HistoricExchangeRateController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:VIEW HISTORIC EXCHANGE RATES', only: ['index', 'show']),
            new Middleware('permission:REGISTER HISTORIC EXCHANGE RATES', only: ['store']),
            new Middleware('permission:UPDATE HISTORIC EXCHANGE RATES', only: ['update']),
        ];
    }
    public function index(FilterRequest $request)
    {
        try {
            $query = HistoricExchangeRate::query();
            $query->filterByState($request->input('state'))
                ->filterByUfv($request->input('ufv'))
                ->filterByExchangeRate($request->input('exchange_rate'))
                ->filterByExchangeRateDate($request->input('date'))
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
            $exchange_rates = $query->paginate($perPage);

            if ($exchange_rates->isEmpty()) {
                return ApiResponse::error("There're not registered exchange rates.", 200);
            }

            $collection = HistoricExchangeRateResource::collection($exchange_rates);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Exchange rates found.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('An error unexpected ocurred.', 500, $e->getMessage());
        }
    }

    public function store(HistoricExchangeRateRequest $request)
    {
        try {
            DB::beginTransaction();
            $exchange_rate = HistoricExchangeRate::create($request->validated());
            DB::commit();
            return ApiResponse::success('Exchange rate registered successfully.', 201, $exchange_rate);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('An error occurred while registering the exchange rate.', 500, $e->getMessage());
        }
    }

    public function show(HistoricExchangeRate $historicExchangeRate)
    {
        try {
            return ApiResponse::success('Exchange rate found.', 200, HistoricExchangeRateResource::make($historicExchangeRate));
        } catch (\Exception $e) {
            return ApiResponse::error('An error unexpected ocurred.', 500, $e->getMessage());
        }
    }

    public function update(HistoricExchangeRateRequest $request, HistoricExchangeRate $historicExchangeRate)
    {
        try {
            DB::beginTransaction();
            $historicExchangeRate->update($request->validated());
            DB::commit();
            return ApiResponse::success('Exchange rate updated succesfully.', 200, $historicExchangeRate);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('An error unexpected ocurred.', 500, $e->getMessage());
        }
    }
}
