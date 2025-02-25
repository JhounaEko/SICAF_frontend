<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
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
                'username' => ['sometimes', 'string', 'max:30', Rule::unique('users', 'username')->ignore($this->user)],
                'password' => ['sometimes', 'string', 'min:8', 'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/', 'confirmed'],
                'email' => ['sometimes', 'string', 'email', 'regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/', Rule::unique('users', 'email')->ignore($this->user)],
                'office_id' => ['sometimes', 'integer', 'exists:offices,id'],
                'state_id' => ['sometimes', 'integer', 'exists:states,id'],
                'roles' => ['sometimes', 'array'],
                'roles.*' => ['exists:roles,id']
            ];
        }
        return [
            'first_name' => ['required', 'string', "regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/u", 'max:30'],
            'last_name' => ['required', 'string', "regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/u", 'max:30'],
            'phone_number' => ['required', 'regex:/^(6|7)[0-9]{7}$/', 'max:8'],
            'username' => ['required', 'string', 'max:30', Rule::unique('users', 'username')->ignore($this->user)],
            'password' => ['required', 'string', 'min:8', 'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/', 'confirmed'],
            'email' => ['required', 'string', 'email', 'regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/', Rule::unique('users', 'email')->ignore($this->user)],
            'office_id' => ['required', 'integer', 'exists:offices,id'],
            'state_id' => ['nullable', 'integer', 'exists:states,id'],
            'roles' => ['sometimes', 'array'],
            'roles.*' => ['exists:roles,id']
        ];
    }

    public function messages()
    {
        return [
            'first_name.regex' => 'The first_name field must be letters, spaces, apostrophes, or hyphens.',
            'last_name.regex' => 'The last_name field must be letters, spaces, apostrophes, or hyphens.',
            'phone_number.regex' => 'The phone number field must be valid (starts with 6 or 7 and is 8 digits)',
            'password.regex' => 'The password field must be contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).',
            'email.regex' => 'The email field must be valid.',

        ];
    }
}
