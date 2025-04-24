<?php

namespace App\Http\Controllers;

use App\Http\Requests\DocumentRequest;
use App\Http\Requests\FilterRequest;
use App\Http\Resources\DocumentResource;
use App\Http\Responses\ApiResponse;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;

class DocumentController extends Controller
{
    public static function middleware()
    {
        return [
            new Middleware('permission:VIEW DOCUMENTS', only: ['index', 'show']),
            new Middleware('permission:REGISTER DOCUMENTS', only: ['store']),
            new Middleware('permission:UPDATE DOCUMENTS', only: ['update']),
        ];
    }

    public function index(FilterRequest $request)
    {
        try {
            $query = Document::query();
            $query->filterByState($request->input('state_id'))
                ->filterByItem($request->input('item_id'))
                ->filterByYear($request->input('year'))
                ->filterByOriginalValue($request->input('original_value'))
                ->filterByDate($request->input('date'))
                ->filterByUsefulMonths($request->input('useful_months'))
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
            $documents = $query->paginate($perPage);

            if ($documents->isEmpty()) {
                return ApiResponse::error('No hay documentos registrados.', 200);
            }

            $collection = DocumentResource::collection($documents);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Documentos encontrados.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function store(DocumentRequest $request)
    {
        try {
            DB::beginTransaction();
            $document = Document::create($request->validated());
            DB::commit();
            return ApiResponse::success('Documento registrado exitosamente.', 201, $document);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Se produjo un error al registrar el documento.', 500, $e->getMessage());
        }
    }


    public function show(Document $document)
    {
        try {
            return ApiResponse::success('Documento encontrado.', 200, DocumentResource::make($document));
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function update(DocumentRequest $request, Document $document)
    {
        try {
            DB::beginTransaction();
            $document->update($request->validated());
            DB::commit();
            return ApiResponse::success('Documento actualizado exitosamente.', 200, $document);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Se produjo un error al actualizar el documento.', 500, $e->getMessage());
        }
    }

}
