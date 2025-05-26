<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PermissionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
    
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        if ($this->method() === 'PATCH') {
            return [
                'name' => ['sometimes', 'string', Rule::unique('permissions', 'name')->ignore($this->permission), 'min:3'],
                'state_id' => ['sometimes', 'integer', 'exists:states,id']
            ];
        }
        return [
            'name' => ['required', 'string', Rule::unique('permissions', 'name')->ignore($this->permission), 'min:3'],
            'state_id' => ['nullable', 'integer', 'exists:states,id']
        ];
    }
}
