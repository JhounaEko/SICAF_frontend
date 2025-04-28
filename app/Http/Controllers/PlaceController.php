<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterRequest;
use App\Http\Requests\PlaceRequest;
use App\Http\Resources\PlaceResource;
use App\Http\Responses\ApiResponse;
use App\Models\Place;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;

class PlaceController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:VIEW PLACES', only: ['index', 'show']),
            new Middleware('permission:REGISTER PLACES', only: ['store']),
            new Middleware('permission:UPDATE PLACES', only: ['update']),
        ];
    }
    public function index(FilterRequest $request)
    {
        try {
            $query = Place::query();

            $query->filterByState($request->input('state_id'))
                ->filterByAbbreviationOrDescriptionOrDetails($request->input('search'))
                ->filterByCode($request->input('code'))
                ->filterByStateName($request->input('state_name'))
                ->filterByDates($request->input('start_date'), $request->input('end_date'));

            if ($request->filled('sort_by')) {
                try {
                    $query->sort($request->input('sort_by'), $request->input('sort_order', 'asc'));
                } catch (\Exception $e) {
                    return ApiResponse::error('Error al ordenar,', 400, $e->getMessage());
                }
            }
    
            $perPage = $request->input('row_num'); 
            $places = $query->paginate($perPage);

            if ($places->isEmpty()) {
                return ApiResponse::error('No hay lugares registrados.', 200);
            }
            
            $collection = PlaceResource::collection($places);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Lugares encontrados.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function store(PlaceRequest $request)
    {
        try {
            DB::beginTransaction();
            $place = Place::create($request->validated());
            DB::commit();
            return ApiResponse::success('Lugar registrado exitosamente.', 201, $place);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Ocurrió un error al registrar el lugar.', 500, $e->getMessage());
        }
    }

    public function show(Place $place)
    {
        try {
            return ApiResponse::success('Lugar encontrado.', 200, PlaceResource::make($place));
        } catch (\Illuminate\Database\QueryException $e) {
            return ApiResponse::error('Se produjo un error en la base de datos.', 500, $e->getMessage());
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function update(PlaceRequest $request, Place $place)
    {
        try {
            DB::beginTransaction();
            $place->update($request->validated());
            DB::commit();
            return ApiResponse::success('Lugar actualizado exitosamente.', 200, $place);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Ocurrió un error al actualizar el lugar.', 500, $e->getMessage());
        }
    }

  
}
