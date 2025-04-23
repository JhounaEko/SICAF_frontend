<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterRequest;
use App\Http\Requests\MotiveRequest;
use App\Http\Resources\MotiveResource;
use App\Http\Responses\ApiResponse;
use App\Models\Motive;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;

class MotiveController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:VER MOTIVOS', only: ['index', 'show']),
            new Middleware('permission:REGISTRAR MOTIVOS', only: ['store']),
            new Middleware('permission:ACTUALIZAR MOTIVOS', only: ['update'])
        ];
    }

    public function index(FilterRequest $request)
    {
        try {
            $query = Motive::query();
            $query->filterByState($request->input('state'))
                  ->filterByNameOrDescription($request->input('search'))
                  ->filterByDates($request->input('start_date'), $request->input('end_date'));

            if ($request->filled('sort_by')) {
                try {
                    $query->sort($request->input('sort_by'), $request->input('sort_order', 'asc'));
                } catch (\Exception $e) {
                    return ApiResponse::error('Error al ordenar.', 400, $e->getMessage());
                }
            }

            $perPage = $request->input('row_num');
            $motives = $query->paginate($perPage);

            if ($motives->isEmpty()) {
                return ApiResponse::error('No hay motivos registrados.', 200);
            }

            $collection = MotiveResource::collection($motives);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Motivos encontrados.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function store(MotiveRequest $request)
    {
        try {
            DB::beginTransaction();
            $motive = Motive::create($request->validated());
            DB::commit();
            return ApiResponse::success('Motivo registrado exitosamente.', 201, $motive);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Ocurrió un error al registrar el motivo.', 500, $e->getMessage());
        }
    }

    public function show(Motive $motive)
    {
        try {
            return ApiResponse::success('Motivo encontrado.', 200, MotiveResource::make($motive));
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function update(MotiveRequest $request, Motive $motive)
    {
        try {
            DB::beginTransaction();
            $motive->update($request->validated());
            DB::commit();
            return ApiResponse::success('Motivo actualizado exitosamente.', 200, $motive);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }
}
