<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterRequest;
use App\Http\Requests\OfficeRequest;
use App\Http\Resources\OfficeResource;
use App\Http\Responses\ApiResponse;
use App\Models\Office;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;

class OfficeController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:VIEW OFFICES', only: ['index', 'show']),
            new Middleware('permission:REGISTER OFFICES', only: ['store']),
            new Middleware('permission:UPDATE OFFICES', only: ['update']),
        ];
    }

    public function index(FilterRequest $request)
    {
        try {
            $query = Office::with(['state', 'parent']);
            $query->filterByState($request->input('state'))
                ->filterByLevel($request->input('level'))
                ->filterByParent($request->input('parent'))
                ->filterByInitialsOrName($request->input('search'))
                ->filterByStateName($request->input('state_name'))
                ->filterByDates($request->input('start_date'), $request->input('end_date'));

            if ($request->filled('sort_by')) {
                try {
                    $query->sort($request->input('sort_by'), $request->input('sort_order', 'asc'));
                } catch (\Exception $e) {
                    return ApiResponse::error('Error al ordenar.', 400, $e->getMessage());
                }
            }

            if ($request->boolean('include_hierarchy')) {
                $query->with('childOffices');
            }

            $perPage = $request->input('row_num'); 
            $offices = $query->paginate($perPage);
            
            if ($offices->isEmpty()) {
                return ApiResponse::error('No hay oficinas registradas.', 200);
            }

            $collection = OfficeResource::collection($offices);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Oficinas encontradas.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function store(OfficeRequest $request)
    {
        try {
            DB::beginTransaction();
            $office = Office::create($request->validated());
            DB::commit();
            return ApiResponse::success('Oficina registrada exitosamente.', 201, $office);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Ocurrió un error al registrar la oficina.', 500, $e->getMessage());
        }
    }

    public function show(FilterRequest $request, $id)
    {

        try {
            if (!is_numeric($id)) {
                return ApiResponse::error('Formato de ID inválido.', 400);
            }

            $query = Office::query();

            if ($request->boolean('include_hierarchy')) {
                $query->with(['childOffices']);
            }

            $query->with('state');
            $office = $query->find($id);

            if (!$office) {
                return ApiResponse::error('Oficina no encontrada.', 200);
            }

            return ApiResponse::success('Oficina encontrada.', 200, OfficeResource::make($office));
        } catch (\Illuminate\Database\QueryException $e) {
            return ApiResponse::error('Ocurrió un error en la base de datos.', 500, $e->getMessage());
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function update(OfficeRequest $request, Office $office)
    {
        try {
            DB::beginTransaction();
            $office->update($request->validated());
            DB::commit();
            return ApiResponse::success('Oficina actualizada exitosamente.', 200, $office);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Ocurrió un error al actualizar la oficina.', 500, $e->getMessage());
        }
    }
}
