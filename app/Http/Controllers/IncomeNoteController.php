<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterRequest;
use App\Http\Requests\IncomeNoteRequest;
use App\Http\Resources\IncomeNoteResource;
use App\Http\Responses\ApiResponse;
use App\Models\IncomeNote;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;

class IncomeNoteController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:VIEW INCOME NOTES', only: ['index', 'show']),
            new Middleware('permission:REGISTER INCOME NOTES', only: ['store']),
            new Middleware('permission:UPDATE INCOME NOTES', only: ['update']),
        ];
    }

    public function index(FilterRequest $request)
    {
        try {
            $query = IncomeNote::query();
            $query->filterByState($request->input('state'))
                ->filterByNote($request->input('note'))
                ->filterByPaymentReceipt($request->input('payment_receipt'))
                ->filterByExpenseReceipt($request->input('expense_receipt'))
                ->filterByVoucherNumber($request->input('voucher_number'))
                ->filterByDfmAmount($request->input('dfm_amount'))
                ->filterByDfmDate($request->input('date'))
                ->filterByStateName($request->input('state_name'))
                ->filterByDates($request->input('start_date'), $request->input('end_date'));

            if ($request->filled('sort_by')) {
                try {
                    $query->sort($request->input('sort_by'), $request->input('sort_order', 'asc'));
                } catch (\Exception $e) {
                    return ApiResponse::error('Error in sorting', 400, $e->getMessage());
                }
            }

            $perPage = $request->input('row_num');
            $income_notes = $query->paginate($perPage);

            if ($income_notes->isEmpty()) {
                return ApiResponse::error("There're not registered income notes.", 200);
            }

            $collection = IncomeNoteResource::collection($income_notes);
            $responseData = $collection->response()->getData(true);

            return ApiResponse::success('Income notes found.', 200, $responseData);
        } catch (\Exception $e) {
            return ApiResponse::error('An error unexpected ocurred.', 500, $e->getMessage());
        }
    }

    public function store(IncomeNoteRequest $request)
    {
        try {
            DB::beginTransaction();
            $income_note = IncomeNote::create($request->validated());
            DB::commit();
            return ApiResponse::success('Income note registered successfully.', 201, $income_note);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('An error occurred while registering the income note.', 500, $e->getMessage());
        }
    }

    public function show(IncomeNote $incomeNote)
    {
        try {
            return ApiResponse::success('Income note found.', 200, IncomeNoteResource::make($incomeNote));
        } catch (\Exception $e) {
            return ApiResponse::error('An error unexpected ocurred.', 500, $e->getMessage());
        }
    }

    public function update(IncomeNoteRequest $request, IncomeNote $incomeNote)
    {
        try {
            DB::beginTransaction();
            $incomeNote->update($request->validated());
            DB::commit();
            return ApiResponse::success('Income note updated succesfully.', 200, $incomeNote);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('An error occurred while updating the income note.', 500, $e->getMessage());
        }
    }
}
