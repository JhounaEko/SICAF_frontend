<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PlaceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        if ($this->method() === 'PATCH') {
            return [
                'description' => ['sometimes', 'string', 'max:100'],
                'abbreviation' => ['sometimes', 'string', 'max:12'],
                'state_id' => ['sometimes', 'int', 'exists:states,id'],
                'code' => ['nullable', 'string', Rule::unique('places', 'code')->ignore($this->place)],
                'details' => ['sometimes','nullable', 'string']
            ];
        }
        return [
            'description' => ['required', 'string', 'max:100'],
            'abbreviation' => ['required', 'string', 'max:12'],
            'state_id' => ['nullable', 'int', 'exists:states,id'],
            'code' => ['required', 'string', Rule::unique('places', 'code')->ignore($this->place)],
            'details' => ['nullable', 'string']
        ];
    }

    public function messages()
    {
        return [           
            'code.unique' => 'El codigo ingresado ya está registrado. Por favor, use uno diferente.',        
        ];
        
    } 
}
