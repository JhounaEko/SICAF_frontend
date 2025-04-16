<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CorrelativeRequest extends FormRequest
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
                'description' => ['sometimes', 'string'],
                'limit_date' => ['sometimes', 'date'],
                'current_number' => ['sometimes', 'integer', 'min:1'],
                'state_id' => ['nullable', 'integer', 'exists:states,id']
            ];
        }
        return [

            'description' => ['required', 'string'],
            'limit_date' => ['required', 'date'],
            'current_number' => ['required', 'integer', 'min:1'],
            'state_id' => ['nullable', 'integer', 'exists:states,id']
        ];
    }
}
