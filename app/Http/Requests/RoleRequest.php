<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RoleRequest extends FormRequest
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
                'name' => ['sometimes', 'string', Rule::unique('roles', 'name')->ignore($this->role), 'min:4'],
                'permissions' => ['sometimes', 'array'],
                'permissions.*' => ['exists:permissions,id'],
                'menus' => ['nullable', 'array'], // Añadimos la regla para el campo 'menus'
                'menus.*' => ['exists:menus,id'],
                'state_id' => ['sometimes', 'integer', 'exists:states,id']
            ];
        }
        return [
            'name' => ['required', 'string', Rule::unique('roles', 'name')->ignore($this->role), 'min:4'],
            'permissions' => ['sometimes', 'array'],
            'permissions.*' => ['exists:permissions,id'],
            'menus' => ['sometimes', 'array'], // Añadimos la regla para el campo 'menus'
            'menus.*' => ['exists:menus,id'],
            'state_id' => ['nullable', 'integer', 'exists:states,id']
        ];
    }
}
