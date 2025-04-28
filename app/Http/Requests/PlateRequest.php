<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PlateRequest extends FormRequest
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
                'item_id' => ['sometimes', 'integer', 'exists:items,id'],
                'description' => ['sometimes', 'string'],
                'serie' => ['sometimes', 'string'],
                'state_id' => ['nullable', 'integer', 'exists:states,id'],
            ];
        }
        return [

            'item_id' => ['nullable', 'integer', 'exists:items,id'],
            'description' => ['required', 'string'],
            'serie' => ['required', 'string'],
            'state_id' => ['nullable', 'integer', 'exists:states,id'],
        ];
    }
}
