<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FundingOrganizationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        if ($this->method() === 'PATCH') {
            return [
                'code' => ['sometimes', 'string'],
                'description' => ['sometimes', 'string'],
                'abbreviation' => ['sometimes', 'string'],
                'year' => ['sometimes', 'integer', 'min:1900', 'max:'. (date('Y') + 10)],
                'state_id' => ['nullable', 'integer', 'exists:states,id'],
            ];
        }
        return [

            'code' => ['required', 'string'],
            'description' => ['required', 'string'],
            'abbreviation' => ['required', 'string'],
            'year' => ['required', 'integer', 'min:1900', 'max:'. (date('Y') + 10)],
            'state_id' => ['nullable', 'integer', 'exists:states,id'],
        ];
    }
}
