<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HistoricNoteDetailRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        if ($this->method() === 'PATCH') {
            return [
                'note_id' => ['sometimes', 'integer'],
                'income_note_id' => ['sometimes', 'integer'],
                'payment_voucher' => ['sometimes', 'string'],
                'expense_voucher' => ['sometimes', 'string'],
                'voucher' => ['sometimes', 'string'],
                'fdm_amount' => ['sometimes', 'integer'],
                'fdm_date' => ['sometimes', 'date'],
                'state_id' => ['nullable', 'integer', 'exists:states,id']
            ];
        }
        return [

            'note_id' => ['required', 'integer'],
            'income_note_id' => ['required', 'integer'],
            'payment_voucher' => ['required', 'string'],
            'expense_voucher' => ['required', 'string'],
            'voucher' => ['required', 'string'],
            'fdm_amount' => ['required', 'integer'],
            'fdm_date' => ['required', 'date'],
            'state_id' => ['nullable', 'integer', 'exists:states,id']
        ];
    }
}
