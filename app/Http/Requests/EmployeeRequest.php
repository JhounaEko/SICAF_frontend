<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeRequest extends FormRequest
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
                'first_name' => ['sometimes', 'string', "regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/u", 'max:30'],
                'last_name' => ['sometimes', 'string', "regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/u", 'max:30'],
                'phone_number' => ['sometimes', 'regex:/^(6|7)[0-9]{7}$/', 'max:8'],
                'position' => ['sometimes', 'string', 'max:60', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
                'office_id' => ['sometimes', 'integer', 'exists:offices,id'],
                'state_id' => ['sometimes', 'integer', 'exists:states,id'],
            ];
        }
        return [
            'first_name' => ['required', 'string', "regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/u", 'max:30'],
            'last_name' => ['required', 'string', "regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/u", 'max:30'],
            'phone_number' => ['required', 'regex:/^(6|7)[0-9]{7}$/', 'max:8'],
            'position' => ['required', 'string', 'max:60', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            'office_id' => ['required', 'integer', 'exists:offices,id'],
            'state_id' => ['nullable', 'integer', 'exists:states,id'],
        ];
    }
}
