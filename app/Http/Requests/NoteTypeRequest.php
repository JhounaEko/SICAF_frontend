<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NoteTypeRequest extends FormRequest
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
                'name' => ['sometimes', 'string', 'min:7'],
                'description' => ['sometimes', 'string'],
                'state_id' => ['sometimes', 'integer', 'exists:states,id']
            ];
        }
        return [
            'name' => ['required', 'string', 'min:7'],
            'description' => ['required', 'string'],
            'state_id' => ['nullable', 'integer', 'exists:states,id']
        ];
    }
}
