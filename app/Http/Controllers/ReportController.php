<?php

namespace App\Http\Controllers;


use App\Http\Requests\FilterRequest;
use App\Http\Requests\ReportRequest;
use App\Http\Resources\ReportResource;
use App\Http\Responses\ApiResponse;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller implements HasMiddleware
{

    public static function middleware()
    {
        return [
            new Middleware('permission:VIEW REPORTS', only: ['index', 'show']),
            new Middleware('permission:REGISTER REPORTS', only: ['store']),
            new Middleware('permission:UPDATE REPORTS', only: ['update']),
        ];
    }

    public function index(FilterRequest $request)
    {
        try {
            $query = Report::query();
            $query->filterByState($request->input('state_id'))
                
                ->filterByDescriptionsOrTitle($request->input('search'))
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
            $reports = $query->paginate($perPage);

            if ($reports->isEmpty()) {
                return ApiResponse::error('No hay reportes registrados.', 200);
            }

            $collection = ReportResource::collection($reports);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Reportes encontrados.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function store(ReportRequest $request)
    {
        try {
            DB::beginTransaction();
            $report = Report::create($request->validated());
            DB::commit();

            return ApiResponse::success('Reporte registrado exitosamente.', 201, $report);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Ocurrió un error al registrar el reporte.', 500, $e->getMessage());
        }
    }


    public function show(Report $report)
    {
        try {
            return ApiResponse::success('Reporte encontrado.', 200, ReportResource::make($report));
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());

        }
    }

    public function update(ReportRequest $request, Report $report)
    {
        try {
            DB::beginTransaction();
            $report->update($request->validated());
            DB::commit();
            return ApiResponse::success('Reporte actualizado exitosamente.', 200, $report);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Ocurrió un error al actualizar el reporte.', 500, $e->getMessage());
        }
    }
}
