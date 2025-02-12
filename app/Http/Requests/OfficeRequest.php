<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OfficeRequest extends FormRequest
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
                'name' => ['sometimes', 'string', 'max:100', 'regex:/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s\-,.]{0,98}[0-9]{0,2}$/'],
                'initials' => ['sometimes', 'string', 'max:12', 'regex:/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\-]{0,10}[0-9]{0,2}$/'],
                'state_id' => ['sometimes', 'int', 'exists:states,id'],
                'parent' => ['nullable', 'int', 'regex:/^(?:null|[1-9][0-9]*)$/'],
                'level' => ['sometimes', 'int', 'regex:/^[1-9][0-9]*$/']
            ];
        }
        return [
            'name' => ['required', 'string', 'max:100', 'regex:/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s\-,.]{0,98}[0-9]{0,2}$/'],
            'initials' => ['required', 'string', 'max:12', 'regex:/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\-]{0,10}[0-9]{0,2}$/'],
            'state_id' => ['nullable', 'int', 'exists:states,id'],
            'parent' => ['nullable', 'int', 'regex:/^(?:null|[1-9][0-9]*)$/'],
            'level' => ['required', 'int', 'regex:/^[1-9][0-9]*$/']
        ];
    }

    public function messages(): array
    {
        return [
            'name.regex' => 'The name field only allows characters and two digits',
            'initials.regex' => 'The initials field only allows characters and two digits'
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->input('level') == 1) {
            $this->merge(['parent' => null]);
        }
    }

    public function withValidator($validator)
    {
        $validator->sometimes('parent', 'required', function ($input) {
            return $input->level > 1;
        });
    }
}
