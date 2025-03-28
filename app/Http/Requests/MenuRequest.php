<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MenuRequest extends FormRequest
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
                'label' => ['sometimes', 'string', Rule::unique('menus', 'label')->ignore($this->menu), 'min:4'],
                'parent' => ['nullable', 'integer', 'exists:menus,id'],
                'route' => ['nullable', 'string', 'regex:/^\/[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*$/'],
                'icon' => ['nullable', 'string', 'regex:/^(fa[srlb]? fa-|pi-)[a-zA-Z0-9-]+$/'],
                'level' => ['sometimes', 'int', 'regex:/^[1-9][0-9]*$/'],
                'order' => ['sometimes', 'integer'],
                'state_id' => ['nullable', 'integer', 'exists:states,id']
            ];
        }
        return [
            'label' => ['required', 'string', Rule::unique('menus', 'label')->ignore($this->menu), 'min:4'],
            'parent' => ['nullable', 'integer', 'exists:menus,id'],
            'route' => ['nullable', 'string', 'regex:/^\/[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*$/'],
            'icon' => ['nullable', 'string', 'regex:/^(fa[srlb]? fa-|pi-)[a-zA-Z0-9-]+$/'],
            'level' => ['required', 'int', 'regex:/^[1-9][0-9]*$/'],
            'order' => ['nullable', 'integer'],
            'state_id' => ['nullable', 'integer', 'exists:states,id']
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
