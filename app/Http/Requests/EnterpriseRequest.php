<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EnterpriseRequest extends FormRequest
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
                'name' => ['sometimes', 'string'],
                'initials' => ['sometimes', 'string'],
                'branch_name' => ['sometimes', 'string'],
                'address' => ['sometimes', 'string'],
                'country' => ['sometimes', 'string'],
                'phone_number' => ['sometimes',  'regex:/^(6|7)[0-9]{7}$/', 'max:8'],
                'other_phone_number' => ['sometimes',  'regex:/^(6|7)[0-9]{7}$/', 'max:8'],
                'email' => ['sometimes', 'email'],
                'enterprise_rubric_id' => ['sometimes', 'integer', 'exists:enterprise_rubrics,id'],
                'state_id' => ['nullable', 'integer', 'exists:states,id'],
                'representative_name' => ['nullable', 'string'],
                'contact_name' => ['nullable', 'string']
            ];
        }
        return [

            'name' => ['required', 'string'],
            'initials' => ['required', 'string'],
            'branch_name' => ['required', 'string'],
            'address' => ['required', 'string'],
            'country' => ['required', 'string'],
            'phone_number' => ['required',  'regex:/^(6|7)[0-9]{7}$/', 'max:8'],
            'other_phone_number' => ['nullable',  'regex:/^(6|7)[0-9]{7}$/', 'max:8'],
            'email' => ['nullable', 'email'],
            'enterprise_rubric_id' => ['required', 'integer', 'exists:enterprise_rubrics,id'],
            'state_id' => ['nullable', 'integer', 'exists:states,id'],
            'representative_name' => ['nullable', 'string'],
            'contact_name' => ['nullable', 'string']
        ];
    }
}
