<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StaffRequest extends FormRequest
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
                'office_phone_number' => ['sometimes', 'regex:/^(6|7)[0-9]{7}$/', 'max:8'],
                'other_phone_number' => ['sometimes', 'regex:/^(6|7)[0-9]{7}$/', 'max:8'],
                'identity_card' => ['sometimes', 'string', 'min:6', 'max:8', 'regex:/^[1-9]\d*$/'],
                'complement' => ['nullable', 'string', 'max:3', 'regex:/^\d{1,2}[A-Za-z]$/'],
                'issued_by' => ['sometimes', 'string', 'in:LP,CH,CB,OR,PT,TJ,SC,BE,PD,S/E'],
                'email' => ['sometimes', 'string', 'email', 'regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/', Rule::unique('staff', 'email')->ignore($this->staff)],
                'position_id' => ['sometimes', 'exists:positions,id'],
                'office_location_id' => ['sometimes', 'integer', 'exists:office_locations,id'],
                
                'state_id' => ['sometimes', 'integer', 'exists:states,id'],
            ];
        }
        return [
            'first_name' => ['required', 'string', "regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/u", 'max:30'],
            'last_name' => ['required', 'string', "regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/u", 'max:30'],
            'phone_number' => ['required', 'regex:/^(6|7)[0-9]{7}$/', 'max:8'],
            'office_phone_number' => ['nullable', 'regex:/^(6|7)[0-9]{7}$/', 'max:8'],
            'other_phone_number' => ['nullable', 'regex:/^(6|7)[0-9]{7}$/', 'max:8'],
            'identity_card' => ['required', 'string', 'min:6', 'max:8', 'regex:/^[1-9]\d*$/', Rule::unique('staff', 'identity_card')->ignore($this->staff)],
            'complement' => ['nullable', 'string', 'max:3', 'regex:/^\d{1,2}[A-Za-z]$/'],
            'issued_by' => ['required', 'string', 'in:LP,CH,CB,OR,PT,TJ,SC,BE,PD,S/E'],
            'email' => ['required', 'string', 'email', 'regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/', Rule::unique('staff', 'email')->ignore($this->staff)],
            'position_id' => ['required', 'exists:positions,id'],
            'office_location_id' => ['required', 'integer', 'exists:office_locations,id'],
            
            'state_id' => ['nullable', 'integer', 'exists:states,id'],
        ];
    }

    public function messages()
{
    return [
      
        'first_name.string' => 'El campo nombre debe ser una cadena de texto.',
        'first_name.regex' => 'El campo nombre solo debe contener letras, espacios, apóstrofes o guiones.',                
        'identity_card.regex' => 'El carnet de identidad solo debe contener dígitos y no puede comenzar con cero.',
        'identity_card.unique' => 'El numero de carnet ya se encuentra registrado',
        'complement.string' => 'El campo complemento debe ser una cadena de texto.',
        'complement.max' => 'El campo complemento no debe exceder los 3 caracteres.',
        'complement.regex' => 'El campo complemento debe tener 1 o 2 dígitos seguidos de una letra.',       
        'email.regex' => 'El correo electrónico tiene un formato inválido.',
        'email.unique' => 'El correo electrónico ingresado ya está registrado. Por favor, use uno diferente.',                  
    ];
}

protected function prepareForValidation()
{
    $this->merge([  
        'email' => mb_strtolower(trim($this->email)),
    ]);
}

}
