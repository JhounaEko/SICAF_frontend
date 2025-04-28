<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class IncomeNoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        if ($this->method() === 'PATCH') {
            return [
                'note' => ['sometimes', 'string'],
                'payment_receipt' => ['sometimes', 'string'],
                'expense_receipt' => ['sometimes', 'string'],
                'voucher_number' => ['sometimes', 'string'],
                'dfm_amount' => ['sometimes', 'decimal:0,4'],
                'dfm_date' => ['sometimes', 'date' ],
               
                'state_id' => ['nullable', 'integer', 'exists:states,id'],
            ];
        }
        return [

            'note' => ['nullable', 'string'],
            'payment_receipt' => ['required', 'string'],
            'expense_receipt' => ['nullable', 'string'],
            'voucher_number' => ['required', 'string'],
            'dfm_amount' => ['nullable', 'decimal:0,4'],
            'dfm_date' => ['required', 'date' ],
            'state_id' => ['nullable', 'integer', 'exists:states,id'],
        ];
    }
}
