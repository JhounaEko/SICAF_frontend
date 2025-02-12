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
            'first_name' => ['required', 'string', 'regex:'],
            'last_name' => ['required', 'string', 'regex:'],
            'phone_number' => ['required', 'string', 'regex:'],
            'username' => ['required', 'string', ''],
            'password' => ['required', 'string', 'min:10', 'confirmed'],
            'email' => ['required', 'string', 'email'],
            'office_id' => ['required', 'integer', 'exists:office,id'],
            'state_id' => ['required', 'integer', 'exists:state,id']
        ];
    }

    public function messages() {
        return [
            ''
        ];
    }
}
