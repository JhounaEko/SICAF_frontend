<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReportRequest extends FormRequest
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
                'description' => ['sometimes', 'string'],
                'title' => ['sometimes', 'string'],
                'state_id' => ['nullable', 'integer', 'exists:states,id'],
            ];
        }
        return [

            'description' => ['required', 'string'],
            'title' => ['required', 'string'],
            'state_id' => ['nullable', 'integer', 'exists:states,id'],
        ];
    }
}
