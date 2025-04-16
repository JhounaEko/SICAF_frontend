<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HistoricChangeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        if ($this->method() === 'PATCH') {
            return [
                'ufv' => ['sometimes', 'numeric', 'decimal:0,4'],
                'date' => ['sometimes', 'date'],
                'state_id' => ['nullable', 'integer', 'exists:states,id']
            ];
        }
        return [
            'ufv' => ['required', 'numeric', 'decimal:0,4'],
            'date' => ['required', 'date'],
            'state_id' => ['nullable', 'integer', 'exists:states,id']
        ];
    }
}
