<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterRequest;
use App\Http\Requests\FundingSourceRequest;
use App\Http\Resources\FundingSourceResource;
use App\Http\Responses\ApiResponse;
use App\Models\FundingSource;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;

class FundingSourceController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:VIEW FUNDING SOURCES', only: ['index', 'show']),
            new Middleware('permission:REGISTER FUNDING SOURCES', only: ['store']),
            new Middleware('permission:UPDATE FUNDING SOURCES', only: ['update']),
        ];
    }

    public function index(FilterRequest $request)
    {
        try {
            $query = FundingSource::query();
            $query->filterByState($request->input('state_id'))
                ->filterByDescriptionsOrAbbreviation($request->input('search'))
                ->filterByYear($request->input('year'))
                ->filterByCode($request->input('number'))
                ->filterByStateName($request->input('state_name'))
                ->filterByDates($request->input('start_date'), $request->input('end_date'));

            if ($request->filled('sort_by')) {
                try {
                    $query->sort($request->input('sort_by'), $request->input('sort_order', 'asc'));
                } catch (\Exception $e) {
                    return ApiResponse::error('Error al ordenar.', 400, $e->getMessage());
                }
            }

            $perPage = $request->input('row_num');
            $funding_sources = $query->paginate($perPage);

            if ($funding_sources->isEmpty()) {
                return ApiResponse::error('No hay fuentes de financiamiento registradas', 200);
            }

            $collection = FundingSourceResource::collection($funding_sources);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Fuentes de financiamiento encontradas.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function store(FundingSourceRequest $request)
    {
        try {
            DB::beginTransaction();
            $funding_source = FundingSource::create($request->validated());
            DB::commit();
            return ApiResponse::success('Fuente de financiamiento registrada exitosamente.', 201, $funding_source);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Se produjo un error al registrar la fuente de financiamiento.', 500, $e->getMessage());
        }
    }

    
    public function show(FundingSource $fundingSource)
    {
        try {
            return ApiResponse::success('Fuente de financiamiento encontrada.', 200, FundingSourceResource::make($fundingSource));
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function update(FundingSourceRequest $request, FundingSource $fundingSource)
    {
        try {
            DB::beginTransaction();
            $fundingSource->update($request->validated());
            DB::commit();
            return ApiResponse::success('Fuente de financiamiento actualizada exitosamente.', 200, $fundingSource);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Se produjo un error al actualizar la fuente de financiamiento.', 500, $e->getMessage());
        }
    }
}
