<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterRequest;
use App\Http\Requests\HistoricRegRequest;
use App\Http\Resources\HistoricRegResource;
use App\Http\Responses\ApiResponse;
use App\Models\HistoricReg;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;

class HistoricRegController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:VIEW HISTORIC REGS', only: ['index', 'show']),
            new Middleware('permission:REGISTER HISTORIC REGS', only: ['store']),
            new Middleware('permission:UPDATE HISTORIC REGS', only: ['update']),
        ];
    }

    public function index(FilterRequest $request)
    {
        try {
            $query = HistoricReg::query();
            $query->filterByState($request->input('state'))
                ->filterByNi($request->input('ni'))
                ->filterByCp($request->input('cp'))
                ->filterByCe($request->input('ce'))
                ->filterByCc($request->input('cc'))
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
            $regs = $query->paginate($perPage);

            if ($regs->isEmpty()) {
                return ApiResponse::error('No hay regs registrados.', 200);
            }

            $collection = HistoricRegResource::collection($regs);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Regs encontrados.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }
    public function store(HistoricRegRequest $request)
    {
        try {
            DB::beginTransaction();
            $reg = HistoricReg::create($request->validated());
            DB::commit();
            return ApiResponse::success('Reg registrado exitosamente.', 201, $reg);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Se produjo un error al registrar el reg.', 500, $e->getMessage());
        }
    }

    public function show(HistoricReg $historicReg)
    {
        try {
            return ApiResponse::success('Reg encontrado.', 200, HistoricRegResource::make($historicReg));
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function update(HistoricRegRequest $request, HistoricReg $historicReg)
    {
        try {
            DB::beginTransaction();
            $historicReg->update($request->validated());
            DB::commit();
            return ApiResponse::success('Reg actualizado exitosamente.', 200, $historicReg);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Se produjo un error al actualizar el reg.', 500, $e->getMessage());
        }
    }
}
