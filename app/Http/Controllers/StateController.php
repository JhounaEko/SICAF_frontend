<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterRequest;
use App\Models\State;
use App\Http\Requests\StateRequest;
use App\Http\Resources\StateResource;
use App\Http\Responses\ApiResponse;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;

class StateController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:VIEW STATES', only: ['index', 'show']),
            new Middleware('permission:REGISTER STATES', only: ['store']),
            new Middleware('permission:UPDATE STATES', only: ['update']),
        ];
    }
    
    public function index(FilterRequest $request)
    {
        try {
            $query = State::query();

            $query->filterByDescriptionOrName($request->input('search'))
                  ->filterByDates($request->input('start_date'), $request->input('end_date'));

            if ($request->filled('sort_by')) {
                try {
                    $query->sort($request->input('sort_by'), $request->input('sort_order', 'asc'));
                } catch (\Exception $e) {
                    return ApiResponse::error('Error al ordenar.', 400, $e->getMessage());
                }
            }

            $perPage = $request->input('row_num');
            $states = $query->paginate($perPage);

            if ($states->isEmpty()) {
                return ApiResponse::error('No hay estados registrados.', 200);
            }
            
            $collection = StateResource::collection($states);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Estados encontrados.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    /**
     * Almacena un nuevo recurso en la base de datos.
     */
    public function store(StateRequest $request)
    {
        try {
            DB::beginTransaction();
            $state = State::create($request->validated());
            DB::commit();
            return ApiResponse::success('Estado creado exitosamente.', 201, $state);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Ocurrió un error al registrar el estado.', 500, $e->getMessage());
        }
    }

    /**
     * Muestra el recurso especificado.
     */
    public function show(State $state)
    {
        try {
            return ApiResponse::success('Estado encontrado.', 200, StateResource::make($state));
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    /**
     * Actualiza el recurso especificado en la base de datos.
     */
    public function update(StateRequest $request,  State $state)
    {
        try {
            DB::beginTransaction();
            $state->update($request->validated());
            DB::commit();
            return ApiResponse::success('Estado actualizado exitosamente.', 200, $state);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Ocurrió un error al actualizar el estado.', 500, $e->getMessage());
        }
    }
}
