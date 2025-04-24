<?php

namespace App\Http\Controllers;

use App\Http\Requests\EnterpriseRubricRequest;
use App\Http\Requests\FilterRequest;
use App\Http\Resources\EnterpriseRubricResource;
use App\Http\Responses\ApiResponse;
use App\Models\EnterpriseRubric;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;

class EnterpriseRubricController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:VIEW ENTERPRISE RUBRICS', only: ['index', 'show']),
            new Middleware('permission:REGISTER ENTERPRISE RUBRICS', only: ['store']),
            new Middleware('permission:UPDATE ENTERPRISE RUBRICS', only: ['update']),
        ];
    }

    public function index(FilterRequest $request)
    {
        try {
            $query = EnterpriseRubric::query();
            $query->filterByState($request->input('state'))
                ->filterByDescription($request->input('search'))
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
            $enterprise_rubrics = $query->paginate($perPage);

            if ($enterprise_rubrics->isEmpty()) {
                return ApiResponse::error('No existen rúbricas empresariales registradas.', 200);
            }

            $collection = EnterpriseRubricResource::collection($enterprise_rubrics);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Rúbricas empresariales encontradas.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function store(EnterpriseRubricRequest $request)
    {
        try {
            DB::beginTransaction();
            $enterprise_rubric = EnterpriseRubric::create($request->validated());
            DB::commit();
            return ApiResponse::success('Rúbrica empresarial registrada exitosamente.', 201, $enterprise_rubric);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Se produjo un error al registrar la rúbrica de la empresa.', 500, $e->getMessage());
        }
    }

    public function show(EnterpriseRubric $enterpriseRubric)
    {
        try {
            return ApiResponse::success('Rúbrica empresarial encontrada.', 200, EnterpriseRubricResource::make($enterpriseRubric));
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function update(EnterpriseRubricRequest $request, EnterpriseRubric $enterpriseRubric)
    {
        try {
            DB::beginTransaction();
            $enterpriseRubric->update($request->validated());
            DB::commit();
            return ApiResponse::success('Rúbrica empresarial actualizada exitosamente.', 200, $enterpriseRubric);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Se produjo un error al actualizar la rúbrica de la empresa.', 500, $e->getMessage());
        }
    }
}
