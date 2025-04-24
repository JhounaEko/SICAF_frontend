<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterRequest;
use App\Http\Requests\PositionRequest;
use App\Http\Resources\PositionResource;
use App\Http\Responses\ApiResponse;
use App\Models\Position;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;

class PositionController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:VIEW POSITIONS', only: ['index', 'show']),
            new Middleware('permission:REGISTER POSITIONS', only: ['store']),
            new Middleware('permission:UPDATE POSITIONS', only: ['update']),
        ];
    }
    public function index(FilterRequest $request)
    {
        try {
            $query = Position::query();

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
            $positions = $query->paginate($perPage);

            if ($positions->isEmpty()) {
                return ApiResponse::error('No hay cargos registrados.', 200);
            }

            $collection = PositionResource::collection($positions);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Cargos encontrados.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function store(PositionRequest $request)
    {
        try {
            DB::beginTransaction();
            $position = Position::create($request->validated());
            DB::commit();
            return ApiResponse::success('Cargo registrado exitosamente.', 201, $position);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Ocurrió un error al registrar el cargo.', 500, $e->getMessage());
        }
    }

    public function show(Position $position)
    {
        try {
            return ApiResponse::success('Cargo encontrado.', 200, PositionResource::make($position));
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function update(PositionRequest $request, Position $position)
    {
        try {
            DB::beginTransaction();
            $position->update($request->validated());
            DB::commit();
            return ApiResponse::success('Cargo actualizado exitosamente.', 200, $position);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Ocurrió un error al actualizar el cargo.', 500, $e->getMessage());
        }
    }
}
