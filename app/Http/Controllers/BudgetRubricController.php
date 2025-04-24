<?php

namespace App\Http\Controllers;

use App\Http\Requests\BudgetRubricRequest;
use App\Http\Requests\FilterRequest;
use App\Http\Resources\BudgetRubricResource;
use App\Http\Responses\ApiResponse;
use App\Models\BudgetRubric;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;

class BudgetRubricController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:VIEW BUDGET RUBRICS', only: ['index', 'show']),
            new Middleware('permission:REGISTER BUDGET RUBRICS', only: ['store']),
            new Middleware('permission:UPDATE BUDGET RUBRICS', only: ['update']),
        ];
    }

    public function index(FilterRequest $request)
    {
        try {
            $query = BudgetRubric::query();
            $query->filterByState($request->input('state'))
                ->filterByDescription($request->input('search'))
                ->filterByRubric($request->input('rubric'))
                ->filterByLifespan($request->input('lifespan'))
                ->filterByIsDepreciated($request->input('is_depreciated'))
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
            $budget_rubrics = $query->paginate($perPage);

            if ($budget_rubrics->isEmpty()) {
                return ApiResponse::error('No existen registros sobre rúbricas presupuestarias.', 200);
            }

            $collection = BudgetRubricResource::collection($budget_rubrics);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Se encontraron las rúbricas de presupuesto.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function store(BudgetRubricRequest $request)
    {
        try {
            DB::beginTransaction();
            $budget_rubric = BudgetRubric::create($request->validated());
            DB::commit();
            return ApiResponse::success('Rúbrica de presupuesto registrada exitosamente.', 201, $budget_rubric);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Se produjo un error al registrar la rúbrica de presupuesto.', 500, $e->getMessage());
        }
    }

    public function show(BudgetRubric $budgetRubric)
    {
        try {
            return ApiResponse::success('Rúbrica de presupuesto encontrada.', 200, BudgetRubricResource::make($budgetRubric));
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function update(BudgetRubricRequest $request, BudgetRubric $budgetRubric)
    {
        try {
            DB::beginTransaction();
            $budgetRubric->update($request->validated());
            DB::commit();
            return ApiResponse::success('Rúbrica de presupuesto actualizada con éxito.', 200, $budgetRubric);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Se produjo un error al actualizar la rúbrica de presupuesto.', 500, $e->getMessage());
        }
    }
}
