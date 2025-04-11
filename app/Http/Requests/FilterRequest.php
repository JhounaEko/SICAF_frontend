<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class FilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    public function rules(): array
    {
        Validator::extend('model_exists', function ($attribute, $value, $parameters, $validator) {
            $modelNamespace = 'App\\Models\\'; // Ajusta si es necesario
            $modelClass = $modelNamespace . $value;
            return class_exists($modelClass) && is_subclass_of($modelClass, \Illuminate\Database\Eloquent\Model::class);
        });

        $sortableColumns = $this->input('sortable_columns', []);

        return [
            // Validaciones generales para los filtros
            'sort_by' => ['nullable', 'string', Rule::in($sortableColumns)],
            'sort_order' => ['nullable', 'string', 'in:ASC,DESC'],
            'state' => ['nullable', 'integer', 'exists:states,id'],
            'start_date' => ['nullable', 'date', 'before_or_equal:end_date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'search' => ['nullable', 'string', 'max:255', 'regex:/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s\-,.]+$/'],
            'row_num' => ['nullable', 'integer', 'min:1'],
            // Validaciones para los filtros de auditoria
            'model' => ['nullable', 'string', 'max:255', 'model_exists'], // Puedes refinar esta validación si conoces los posibles modelos
            'user' => ['nullable', 'integer', 'exists:users,id'], // Asumiendo que 'users' es tu tabla de usuarios y 'id' la columna primaria
            'event' => ['nullable', 'string', 'max:255', 'in:CREATED,UPDATED'], // Puedes refinar esta validación si tienes un conjunto limitado de eventos
            'auditable_id' => ['nullable', 'integer', 'min:1'],
            // Validaciones para filstros de estados
            'code' => ['nullable', 'string', 'max:10'],
            'color' => ['nullable', 'string', 'regex:/^#([0-9A-Fa-f]{3}){1,2}$/'],
            'order' => ['nullable', 'int', 'min:0'],
            // Validaciones para filtros de oficinas
            'level' => ['nullable', 'integer', 'in:1,2,3'],
            'parent' => ['nullable', 'integer'],
            // Util tanto para oficinas como para los menus
            'include_hierarchy' => ['nullable', 'boolean'],
            // Validaciones para filtros de usuarios
            // 'email' => ['nullable', 'string', 'email'],
            'phone_number' => ['nullable', 'string', 'regex:/^\[1-9]\d{1,14}$/'],
            'identity_card' => ['nullable', 'string', 'regex:/^[A-Za-z0-9-]+$/'],
            'issued_by' => ['nullable', 'string', 'in:LP,CH,CB,OR,PT,TJ,SC,BE,PD,S/E'],
            'username' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'string', 'email', 'regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/'],
            'office_name' => ['nullable', 'string', 'exists:offices,name'],
            'office_initials' => ['nullable', 'string', 'exists:offices,initials'],
            'office' => ['nullable', 'integer', 'exists:offices,id'],
            // Validacion para menus
            'simple_view' => ['nullable', 'boolean'],

        ];
    }

    public function messages()
    {
        return [
            'sort_order.in' => 'The sort_order field must be either ASC or DESC.',
            'start_date.before_or_equal' => 'The start_date must be before or equal to the end_date.',
            'end_date.after_or_equal' => 'The end_date must be after or equal to the start_date.',
            'search.regex' => 'The search field only allows characters.',
            'color.regex' => 'The color field must be hexadecimal values.',
            'level.in' => 'The level field must be either 1, 2 or 3.',
            'include_hierarchy.boolean' => 'The include hierarchy field must be 1 (true) or 0 (false).',
            'row_num.integer' => 'The row_num must be an integer.',
            'row_num.min' => 'The row_num must be at least 1.',
            'model.model_exists' => 'The selected model does not exist.',

        ];
    }

    public function prepareForValidation()
    {
        if ($this->has('sort_order')) {
            $this->merge([
                'sort_order' => mb_strtoupper($this->input('sort_order')),
            ]);
        }

        if ($this->has('search')) {
            $this->merge([
                'search' => mb_strtoupper($this->input('search')),
            ]);
        }

        if ($this->has('code')) {
            $this->merge([
                'code' => mb_strtoupper($this->input('code')),
            ]);
        }
    }

}
