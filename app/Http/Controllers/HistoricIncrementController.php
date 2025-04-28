<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterRequest;
use App\Http\Requests\HistoricIncrementRequest;
use App\Http\Resources\HistoricIncrementResource;
use App\Http\Responses\ApiResponse;
use App\Models\HistoricIncrement;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;

class HistoricIncrementController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:VIEW HISTORIC INCREMENTS', only: ['index', 'show']),
            new Middleware('permission:REGISTER HISTORIC INCREMENTS', only: ['store']),
            new Middleware('permission:UPDATE HISTORIC INCREMENTS', only: ['update']),
        ];
    }

    public function index(FilterRequest $request)
    {
        try {
            $query = HistoricIncrement::query();
            $query->filterByState($request->input('state_id'))
                ->filterByItem($request->input('item_id'))
                ->filterByDate($request->input('date'))
                ->filterByDescription($request->input('search'))
                ->filterByIsActive($request->input('is_active'))
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
            $increments = $query->paginate($perPage);

            if ($increments->isEmpty()) {
                return ApiResponse::error('No hay incrementos registrados.', 200);
            }

            $collection = HistoricIncrementResource::collection($increments);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Incrementos encontrados.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function store(HistoricIncrementRequest $request)
    {
        try {
            DB::beginTransaction();
            $increment = HistoricIncrement::create($request->validated());
            DB::commit();
            return ApiResponse::success('Incremento registrado exitosamente.', 201, $increment);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Se produjo un error al registrar el incremento.', 500, $e->getMessage());
        }
    }

    public function show(HistoricIncrement $historicIncrement)
    {
        try {
            return ApiResponse::success('Incremento encontrado.', 200, HistoricIncrementResource::make($historicIncrement));
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function update(HistoricIncrementRequest $request, HistoricIncrement $historicIncrement)
    {
        try {
            DB::beginTransaction();
            $historicIncrement->update($request->validated());
            DB::commit();
            return ApiResponse::success('Incremento actualizado exitosamente.', 200, $historicIncrement);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Se produjo un error al actualizar el incremento.', 500, $e->getMessage());
        }
    }
}
