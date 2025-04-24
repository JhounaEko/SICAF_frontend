<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OfficeLocationRequest extends FormRequest
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
                'office_id' => ['sometimes', 'integer', 'exists:offices,id'],
                'place_id' => ['sometimes', 'integer', 'exists:places,id'],
                'latitude' => ['nullable', 'numeric', 'between:-90,90'],
                'longitude' => ['nullable', 'numeric', 'between:-90,90'],
                'state_id' => ['nullable', 'integer', 'exists:states,id'],
            ];
        }
        return [

            'office_id' => ['required', 'integer', 'exists:offices,id'],
            'place_id' => ['required', 'integer', 'exists:places,id'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-90,90'],
            'state_id' => ['nullable', 'integer', 'exists:states,id'],
        ];
    }
}
