<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HistoricExchangeRateRequest extends FormRequest
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
                'exchange_rate' => ['sometimes', 'numeric', 'decimal:0,4'],
                'exchange_rate_date' => ['sometimes', 'date'],
                'ufv' => ['sometimes', 'numeric', 'decimal:0,4'],
                'state_id' => ['nullable', 'integer', 'exists:states,id']
            ];
        }
        return [

            'exchange_rate' => ['required', 'numeric', 'decimal:0,4'],
            'exchange_rate_date' => ['required', 'date'],
            'ufv' => ['required', 'numeric', 'decimal:0,4'],
            'state_id' => ['nullable', 'integer', 'exists:states,id']
        ];
    }
}
