<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HistoricIncrementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        if ($this->method() === 'PATCH') {
            return [
                'item_id' => ['sometimes', 'integer'],
                'date' => ['sometimes', 'date'],
                'description' => ['sometimes', 'string'],
                'is_active' => ['sometimes', 'boolean'],
                'state_id' => ['nullable', 'integer', 'exists:states,id']
            ];
        }
        return [

            'item_id' => ['required', 'integer'],
            'date' => ['required', 'date'],
            'description' => ['required', 'string'],
            'is_active' => ['required', 'boolean'],
            'state_id' => ['nullable', 'integer', 'exists:states,id']
        ];
    }
}
