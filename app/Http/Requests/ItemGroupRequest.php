<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ItemGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        if ($this->method() === 'PATCH') {
            return [
                'item_description' => ['sometimes', 'string'],
                'item_group_type_id' => ['sometimes', 'integer'],
                'alphanumeric_code' => ['sometimes', 'string'],
                'item_group_description' => ['sometimes', 'string'],
                'material' => ['sometimes', 'string'],
                'type' => ['sometimes', 'string' ],
                'is_intangible' => ['sometimes',  'boolean'],
                'useful_months' => ['sometimes', 'integer'],
                'budget_rubric_id' => ['sometimes', 'integer', 'exists:budget_rubrics,id'],
                'state_id' => ['nullable', 'integer', 'exists:states,id'],
            ];
        }
        return [

            'item_description' => ['required', 'string'],
            'item_group_type_id' => ['required', 'integer'],
            'alphanumeric_code' => ['required', 'string'],
            'item_group_description' => ['required', 'string'],
            'material' => ['required', 'string'],
            'type' => ['nullable', 'string' ],
            'is_intangible' => ['required',  'boolean'],
            'useful_months' => ['nullable', 'integer'],
            'budget_rubric_id' => ['required', 'integer', 'exists:budget_rubrics,id'],
            'state_id' => ['nullable', 'integer', 'exists:states,id'],
        ];
    }
}
