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
        if ($this->method() === 'PATCH') {
            return [
                'name' => ['sometimes', 'string', 'max:15'],
                'description' => ['sometimes', 'string', 'max:50'],
                'code' => ['sometimes', 'string', 'max:10' ,Rule::unique('states', 'code')->ignore($this->state)],
                'color' => ['sometimes', 'string', 'regex:/^#([0-9A-Fa-f]{3}){1,2}$/'],
                'order' => ['sometimes', 'int', 'min:0']
            ];
        }
        return [
            'name' => ['required', 'string', 'max:15'],
            'description' => ['required', 'string', 'max:50'],
            'code' => ['required', 'string', 'max:10' ,Rule::unique('states', 'code')->ignore($this->state)],
            'color' => ['required', 'string', 'regex:/^#([0-9A-Fa-f]{3}){1,2}$/'],
            'order' => ['required', 'int', 'min:0']
        ];
    }

    public function messages(): array {
        return [
            'color.regex' => 'Ingrese valores hexadecimales.',
        ];        
    }
}
