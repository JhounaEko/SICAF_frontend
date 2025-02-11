<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StateRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:15'],
            'description' => ['required', 'string', 'max:50'],
            'code' => ['required', 'string', 'max:10' ,Rule::unique('states', 'code')],
            'color' => ['required', 'regex:/^#([0-9A-Fa-f]{3}){1,2}$/']
        ];
    }

    public function messages(): array {
        return [
            'color:regex' => 'Enter hexadecimal values.'
        ];
    }
}
