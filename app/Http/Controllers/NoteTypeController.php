<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterRequest;
use App\Http\Requests\MotiveRequest;
use App\Http\Requests\NoteTypeRequest;
use App\Http\Resources\NoteTypeResource;
use App\Http\Responses\ApiResponse;
use App\Models\NoteType;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;

class NoteTypeController extends Controller
{
    public static function middleware()
    {
        return [
<<<<<<< HEAD
            new Middleware('permission:VER TIPOS DE NOTA', only: ['index', 'show']),
            new Middleware('permission:REGISTRAR TIPOS DE NOTA', only: ['store']),
            new Middleware('permission:ACTUALIZAR TIPOS DE NOTA', only: ['update'])
=======
            new Middleware('permission:VIEW NOTE TYPES', only: ['index', 'show']),
            new Middleware('permission:REGISTER NOTE TYPES', only: ['store']),
            new Middleware('permission:UPDATE NOTE TYPES', only: ['update'])
>>>>>>> 9ba86a3afbf92d7b37b3fc89b2a3ca852a226ad5
        ];
    }

    public function index(FilterRequest $request)
    {
        try {
            $query = NoteType::query();
            $query->filterByState($request->input('state'))
<<<<<<< HEAD
                  ->filterByNameOrDescription($request->input('search'))
                  ->filterByDates($request->input('start_date'), $request->input('end_date'));
=======
                ->filterByNameOrDescription($request->input('search'))
                ->filterByStateName($request->input('state_name'))
                ->filterByDates($request->input('start_date'), $request->input('end_date'));
>>>>>>> 9ba86a3afbf92d7b37b3fc89b2a3ca852a226ad5

            if ($request->filled('sort_by')) {
                try {
                    $query->sort($request->input('sort_by'), $request->input('sort_order', 'asc'));
                } catch (\Exception $e) {
                    return ApiResponse::error('Error al ordenar.', 400, $e->getMessage());
                }
            }

            $perPage = $request->input('row_num');
            $note_types = $query->paginate($perPage);

            if ($note_types->isEmpty()) {
                return ApiResponse::error('No hay tipos de nota registrados.', 200);
            }

            $collection = NoteTypeResource::collection($note_types);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Tipos de nota encontrados.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function store(NoteTypeRequest $request)
    {
        try {
            DB::beginTransaction();
            $note_type = NoteType::create($request->validated());
            DB::commit();
            return ApiResponse::success('Tipo de nota registrado exitosamente.', 201, $note_type);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Ocurrió un error al registrar el tipo de nota.', 500, $e->getMessage());
        }
    }

    public function show(NoteType $noteType)
    {
        try {
            return ApiResponse::success('Tipo de nota encontrado.', 200, NoteTypeResource::make($noteType));
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function update(NoteTypeRequest $request, NoteType $noteType)
    {
        try {
            DB::beginTransaction();
            $noteType->update($request->validated());
            DB::commit();
            return ApiResponse::success('Tipo de nota actualizado exitosamente.', 200, $noteType);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Ocurrió un error al actualizar el tipo de nota.', 500, $e->getMessage());
        }
    }
}
