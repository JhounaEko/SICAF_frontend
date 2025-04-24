<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterRequest;
use App\Http\Requests\HistoricNoteDetailRequest;
use App\Http\Resources\HistoricNoteDetailResource;
use App\Http\Responses\ApiResponse;
use App\Models\HistoricNoteDetail;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;

class HistoricNoteDetailController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:VIEW HISTORIC NOTE DETAILS', only: ['index', 'show']),
            new Middleware('permission:REGISTER HISTORIC NOTE DETAILS', only: ['store']),
            new Middleware('permission:UPDATE HISTORIC NOTE DETAILS', only: ['update']),
        ];
    }

    public function index(FilterRequest $request)
    {
        try {
            $query = HistoricNoteDetail::query();
            $query->filterByState($request->input('state'))
                ->filterByNote($request->input('note'))
                ->filterByIncomeNote($request->input('income_note'))
                ->filterByPaymentVoucher($request->input('payment_voucher'))
                ->filterByExpenseVoucher($request->input('expense_voucher'))
                ->filterByVoucher($request->input('voucher'))
                ->filterByFdmAmount($request->input('value_number'))
                ->filterByFdmDate($request->input('date'))
                ->filterByStateName($request->input('state_name'))
                ->filterByDates($request->input('start_date'), $request->input('end_date'));

            if ($request->filled('sort_by')) {
                try {
                    $query->sort($request->input('sort_by'), $request->input('sort_order', 'asc'));
                } catch (\Exception $e) {
                    return ApiResponse::error('Error al ordenar', 400, $e->getMessage());
                }
            }

            $perPage = $request->input('row_num');
            $note_details = $query->paginate($perPage);

            if ($note_details->isEmpty()) {
                return ApiResponse::error('No hay detalles de notas registrados.', 200);
            }

            $collection = HistoricNoteDetailResource::collection($note_details);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Detalles de notas encontrados.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function store(HistoricNoteDetailRequest $request)
    {
        try {
            DB::beginTransaction();
            $note_detail = HistoricNoteDetail::create($request->validated());
            DB::commit();
            return ApiResponse::success('Detalle de nota registrado exitosamente.', 201, $note_detail);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Se produjo un error al registrar el detalle de la nota.', 500, $e->getMessage());
        }
    }

    public function show(HistoricNoteDetail $historicNoteDetail)
    {
        try {
            return ApiResponse::success('Detalle de nota encontrado.', 200, HistoricNoteDetailResource::make($historicNoteDetail));
        } catch (\Exception $e) {
            return ApiResponse::error('Ocurrió un error inesperado.', 500, $e->getMessage());
        }
    }

    public function update(HistoricNoteDetailRequest $request, HistoricNoteDetail $historicNoteDetail)
    {
        try {
            DB::beginTransaction();
            $historicNoteDetail->update($request->validated());
            DB::commit();
            return ApiResponse::success('Detalle de nota actualizado exitosamente.', 200, $historicNoteDetail);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Se produjo un error al actualizar el detalle de la nota.', 500, $e->getMessage());
        }
    }

}
