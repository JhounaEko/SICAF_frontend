<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterRequest;
use App\Http\Requests\IncreaseTypeRequest;
use App\Http\Resources\IncreaseTypeResource;
use App\Http\Responses\ApiResponse;
use App\Models\IncreaseType;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;

class IncreaseTypeController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
<<<<<<< HEAD
            new Middleware('permission:VER TIPOS DE INCREMENTO', only: ['index', 'show']),
            new Middleware('permission:REGISTRAR TIPOS DE INCREMENTO', only: ['store']),
            new Middleware('permission:ACTUALIZAR TIPOS DE INCREMENTO', only: ['update'])
=======
            new Middleware('permission:VIEW INCREASE TYPES', only: ['index', 'show']),
            new Middleware('permission:REGISTER INCREASE TYPES', only: ['store']),
            new Middleware('permission:UPDATE INCREASE TYPES', only: ['update'])
>>>>>>> 9ba86a3afbf92d7b37b3fc89b2a3ca852a226ad5
        ];
    }

    public function index(FilterRequest $request)
    {
        try {
            $query = IncreaseType::query();
            $query->filterByState($request->input('state'))
                ->filterByNameOrDescription($request->input('search'))
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
            $increaseType = $query->paginate($perPage);

            if ($increaseType->isEmpty()) {
                return ApiResponse::error('No hay tipos de incremento registrados.', 200);
            }

            $collection = IncreaseTypeResource::collection($increaseType);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Tipos de incremento encontrados.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function store(IncreaseTypeRequest $request)
    {
        try {
            DB::beginTransaction();
            $increaseType = IncreaseType::create($request->validated());
            DB::commit();
            return ApiResponse::success('Tipo de incremento registrado exitosamente.', 201, $increaseType);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Ocurrió un error al registrar el tipo de incremento.', 500, $e->getMessage());
        }
    }

    public function show(IncreaseType $increaseType)
    {
        try {
            return ApiResponse::success('Tipo de incremento encontrado.', 200, IncreaseTypeResource::make($increaseType));
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function update(IncreaseTypeRequest $request, IncreaseType $increaseType)
    {
        try {
            DB::beginTransaction();
            $increaseType->update($request->validated());
            DB::commit();
            return ApiResponse::success('Tipo de incremento actualizado exitosamente.', 200, $increaseType);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Ocurrió un error al actualizar el tipo de incremento.', 500, $e->getMessage());
        }
    }
}
