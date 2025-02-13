<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
        return [
            'first_name' => ['required', 'string', "regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/u", 'max:30'],
            'last_name' => ['required', 'string', "regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/u", 'max:30'],
            'phone_number' => ['required', 'string', 'regex:/^(6|7)[0-9]{7}$/'],
            'username' => ['required', 'string', 'max:30'],
            'password' => ['required', 'string', 'min:8', 'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/' , 'confirmed'],
            'email' => ['required', 'string', 'email', 'regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/'],
            'office_id' => ['required', 'integer', 'exists:office,id'],
            'state_id' => ['required', 'integer', 'exists:state,id']
        ];
    }

    public function messages() {
        return [
            'first_name.regex' => 'The first_name field must be letters, spaces, apostrophes, or hyphens.',
            'last_name.regex' => 'The last_name field must be letters, spaces, apostrophes, or hyphens.',
            'email.regex' => 'The email field must be valid.'
        ];
    }
}
