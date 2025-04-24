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
                'identity_card' => ['sometimes', 'string', 'min:6', 'max:8', 'regex:/^[1-9]\d*$/'],
                'complement' => ['nullable', 'string', 'max:3', 'regex:/^\d{1,2}[A-Za-z]$/'],
                'issued_by' => ['sometimes', 'string', 'in:LP,CH,CB,OR,PT,TJ,SC,BE,PD,S/E'],
                'username' => ['sometimes', 'string', 'max:30', Rule::unique('users', 'username')->ignore($this->user)],
                'password' => ['sometimes', 'string', 'min:8', 'confirmed'],
                'password_change_count' => ['sometimes', 'integer'],
                'email' => ['sometimes', 'string', 'email', 'regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/', Rule::unique('users', 'email')->ignore($this->user)],
                'office_id' => ['sometimes', 'integer', 'exists:offices,id'],
                'place_id' => ['sometimes', 'integer', 'exists:places,id'],
                
                'state_id' => ['sometimes', 'integer', 'exists:states,id'],
                'roles' => ['sometimes', 'array'],
                'roles.*' => ['exists:roles,id']
            ];
        }
        return [
            'first_name' => ['required', 'string', "regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/u", 'max:30'],
            'last_name' => ['required', 'string', "regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/u", 'max:30'],
            'phone_number' => ['required', 'regex:/^(6|7)[0-9]{7}$/', 'max:8'],
            'identity_card' => ['required', 'string', 'min:6', 'max:8', 'regex:/^[1-9]\d*$/'],
            'complement' => ['nullable', 'string', 'max:3', 'regex:/^\d{1,2}[A-Za-z]$/'],
            'issued_by' => ['required', 'string', 'in:LP,CH,CB,OR,PT,TJ,SC,BE,PD,S/E'],
            'username' => ['required', 'string', 'max:30', Rule::unique('users', 'username')->ignore($this->user)],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'password_change_count' => ['nullable', 'integer'],
            'email' => ['required', 'string', 'email', 'regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/', Rule::unique('users', 'email')->ignore($this->user)],
            'office_id' => ['required', 'integer', 'exists:offices,id'],
            'place_id' => ['required', 'integer', 'exists:places,id'],
            
            'state_id' => ['nullable', 'integer', 'exists:states,id'],
            'roles' => ['sometimes', 'array'],
            'roles.*' => ['exists:roles,id']
        ];
    }

    public function messages()
    {
        return [
            'first_name.regex' => 'El campo nombre solo debe contener letras, espacios, apóstrofes o guiones.',
            'last_name.regex' => 'El campo apellido solo debe contener letras, espacios, apóstrofes o guiones.',
            'phone_number.regex' => 'El campo número de teléfono debe ser válido (comienza con 6 o 7 y tiene 8 dígitos).',
            'identity_card.regex' => 'El campo carnet de identidad solo permite dígitos.',
            'complement.regex' => 'El campo complemento solo permite 1 o 2 dígitos y 1 carácter.',
            'issued_by.in' => 'El campo expedido debe ser uno de los siguientes: LP (LA PAZ), CH (CHUQUISACA), CB (COCHABAMBA), OR (ORURO), PT (POTOSÍ), TJ (TARIJA), SC (SANTA CRUZ), BE (BENI), PD (PANDO), S/E (SIN EXPEDIDO).',
            'password.regex' => 'El campo contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial (@$!%*?&).',
            'email.regex' => 'El campo correo electrónico debe ser válido.',
            'email.unique' => 'El correo electrónico ingresado ya está registrado. Por favor, use uno diferente.',
            'username.unique' => 'El nombre de usuario ingresado ya está registrado. Por favor, use uno diferente.',
        ];
        
    }
    
    protected function prepareForValidation()
    {
        $this->merge([
            'username' => mb_strtoupper(trim($this->username)),
            'email' => mb_strtolower(trim($this->email)),
        ]);
    }

}
