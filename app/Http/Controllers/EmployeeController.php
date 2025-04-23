<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeRequest;
use App\Http\Requests\FilterRequest;
use App\Http\Resources\EmployeeResource;
use App\Http\Responses\ApiResponse;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;

class EmployeeController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:VER EMPLEADOS', only: ['index', 'show']),
            new Middleware('permission:REGISTRAR EMPLEADOS', only: ['store']),
            new Middleware('permission:ACTUALIZAR EMPLEADOS', only: ['update']),
        ];
    }

    public function index(FilterRequest $request)
    {
        try {
            $query = Employee::query();
            $query->filterByState($request->input('state'))
                ->filterByOffice($request->input('office'))
                ->filterByPosition($request->input('position'))
                ->filterByName($request->input('search'))
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
            $employees = $query->paginate($perPage);

            if ($employees->isEmpty()) {
                return ApiResponse::error('No hay empleados registrados.', 200);
            }

            $collection = EmployeeResource::collection($employees);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Empleados encontrados.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function store(EmployeeRequest $request)
    {
        try {
            DB::beginTransaction();
            $employee = Employee::create($request->validated());
            DB::commit();
            return ApiResponse::success('Empleado registrado exitosamente.', 201, $employee);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Ocurrió un error al registrar al empleado.', 500, $e->getMessage());
        }
    }

    public function show(Employee $employee)
    {
        try {
            return ApiResponse::success('Empleado encontrado.', 200, EmployeeResource::make($employee));
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function update(EmployeeRequest $request, Employee $employee)
    {
        try {
            DB::beginTransaction();
            $employee->update($request->validated());
            DB::commit();
            return ApiResponse::success('Empleado actualizado exitosamente.', 200, $employee);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }
}
