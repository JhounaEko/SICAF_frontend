<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DocumentRequest extends FormRequest
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
                'year' => ['sometimes', 'integer'],
                'original_value' => ['sometimes', 'decimal:0,2'],
                'date' => ['sometimes', 'date'],
                'useful_months' => ['sometimes', 'integer'],
                'state_id' => ['nullable', 'integer', 'exists:states,id'],
            ];
        }
        return [

            'item_id' => ['required', 'integer'],
            'year' => ['required', 'integer'],
            'original_value' => ['required', 'decimal:0,2'],
            'date' => ['required', 'date'],
            'useful_months' => ['required', 'integer'],
            'state_id' => ['nullable', 'integer', 'exists:states,id'],
        ];
    }
}
