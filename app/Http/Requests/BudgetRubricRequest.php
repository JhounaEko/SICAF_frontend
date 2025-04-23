<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BudgetRubricRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        if ($this->method() === 'PATCH') {
            return [
                'rubric' => ['sometimes', 'string'],
                'description' => ['sometimes', 'string'],
                'lifespan' => ['sometimes', 'integer'],
                'is_depreciated' => ['sometimes', 'boolean'],
                'state_id' => ['nullable', 'integer', 'exists:states,id'],
            ];
        }
        return [
            'rubric' => ['required', 'string'],
            'description' => ['required', 'string'],
            'lifespan' => ['required', 'integer'],
            'is_depreciated' => ['required', 'boolean'],
            'state_id' => ['nullable', 'integer', 'exists:states,id'],
        ];
    }
}
