<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HistoricRegRequest extends FormRequest
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
                'ni' => ['sometimes', 'integer'],
                'cp' => ['sometimes', 'string'],
                'ce' => ['sometimes', 'integer'],
                'cc' => ['sometimes', 'integer'],
                'state_id' => ['nullable', 'integer', 'exists:states,id']
            ];
        }
        return [

            'ni' => ['required', 'integer'],
            'cp' => ['required', 'string'],
            'ce' => ['required', 'integer'],
            'cc' => ['required', 'integer'],
            'state_id' => ['nullable', 'integer', 'exists:states,id']
        ];
    }
}
