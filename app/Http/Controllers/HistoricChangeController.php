<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterRequest;
use App\Http\Requests\HistoricChangeRequest;
use App\Http\Resources\HistoricChangeResource;
use App\Http\Responses\ApiResponse;
use App\Models\HistoricChange;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;

class HistoricChangeController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:VIEW HISTORIC CHANGES', only: ['index', 'show']),
            new Middleware('permission:REGISTER HISTORIC CHANGES', only: ['store']),
            new Middleware('permission:UPDATE HISTORIC CHANGES', only: ['update']),
        ];
    }

    public function index(FilterRequest $request)
    {
        try {
            $query = HistoricChange::query();
            $query->filterByState($request->input('state'))
                ->filterByUfv($request->input('ufv'))
                ->filterByDate($request->input('date'))
                ->filterByStateName($request->input('state_name'))
                ->filterByDates($request->input('start_date'), $request->input('end_date'));

            if ($request->filled('sort_by')) {
                try {
                    $query->sort($request->input('sort_by'), $request->input('sort_order', 'asc'));
                } catch (\Exception $e) {
                    return ApiResponse::error('Error al ordenar', 400, $e->getMessage());
                }
            }

            $perPage = $request->input('row_num');
            $changes = $query->paginate($perPage);

            if ($changes->isEmpty()) {
                return ApiResponse::error('No hay cambios registrados', 200);
            }

            $collection = HistoricChangeResource::collection($changes);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Cambios encontrados.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function store(HistoricChangeRequest $request)
    {
        try {
            DB::beginTransaction();
            $change = HistoricChange::create($request->validated());
            DB::commit();
            return ApiResponse::success('Cambio registrado exitosamente.', 201, $change);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Se produjo un error al registrar el cambio.', 500, $e->getMessage());
        }
    }

   
    public function show(HistoricChange $historicChange)
    {
        try {
            return ApiResponse::success('Cambio encontrado.', 200, HistoricChangeResource::make($historicChange));
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }


    public function update(HistoricChangeRequest $request, HistoricChange $historicChange)
    {
        try {
            DB::beginTransaction();
            $historicChange->update($request->validated());
            DB::commit();
            return ApiResponse::success('Cambio actualizado exitosamente.', 200, $historicChange);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Se produjo un error al actualizar el cambio.', 500, $e->getMessage());
        }
    }

}
