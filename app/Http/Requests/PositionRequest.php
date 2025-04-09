<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PositionRequest extends FormRequest
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
                'name' => ['sometimes', 'string', 'max:60', 'regex:/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s\-,.]+$/'],
                'description' => ['sometimes', 'string', 'max:100', 'regex:/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s\-,.]+$/'],
                'state_id' => ['nullable', 'integer', 'exists:states,id']
            ];
        }
        return [
            'name' => ['required', 'string', 'max:60', 'regex:/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s\-,.]+$/'],
            'description' => ['required', 'string', 'max:100', 'regex:/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s\-,.]+$/'],
            'state_id' => ['nullable', 'integer', 'exists:states,id']
        ];
    }
}
