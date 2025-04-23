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
            'phone_number' => ['nullable', 'regex:/^(6|7)[0-9]{7}$/'],
            'identity_card' => ['nullable', 'string', 'regex:/^[A-Za-z0-9-]+$/'],
            'issued_by' => ['nullable', 'string', 'in:LP,CH,CB,OR,PT,TJ,SC,BE,PD,S/E'],
            'username' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'string', 'email', 'regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/'],
            'office_name' => ['nullable', 'string'],
            'state_name' => ['nullable', 'string'],
            'office_initials' => ['nullable', 'string', 'exists:offices,initials'],
            'office' => ['nullable', 'integer', 'exists:offices,id'],
            // Validacion para menus
            'simple_view' => ['nullable', 'boolean'],
            // Validaciones para tipos de cambio
            'ufv' => ['nullable', 'decimal:2'],
            'exchange_rate' => ['nullable', 'decimal:2'],
            'date' => ['nullable', 'date'],
            // Validaciones para el correlativo
            'value_number' => ['nullable', 'integer', 'min:0'],
            // Validaciones para el detalle historico de las notas
            'note' => ['nullable', 'integer'],
            'income_note' => ['nullable', 'integer'],
            'payment_voucher' => ['nullable', 'string'],
            'expense_voucher' => ['nullable', 'string'],
            'voucher' => ['nullable', 'string'],
            // Validaciones para el incremento
            'item' => ['nullable', 'integer'],
            'is_active' => ['nullable', 'boolean'],
            // Validaciones para regs
            'ni' => ['nullable', 'integer'],
            'cp' => ['nullable', 'string'],
            'ce' => ['nullable', 'integer'],
            'cc' => ['nullable', 'integer'],
            // Validaciones para empresas
            'enterprise_rubric' => ['nullable', 'integer', 'exists:enterprise_rubrics,id'],
            'branch_name' => ['nullable', 'string'],
            'country' => ['nullable', 'string'],
            'representative' => ['nullable', 'string'],
            // Validaciones para pres_rubro
            'lifespan' => ['nullable', 'integer'],
            'rubric' => ['nullable', 'string'],
            'is_depreciated' => ['nullable', 'boolean'],
            // Validaciones para grupo items
            'item_group_type' => ['nullable', 'integer'],
            'alphanumeric_code' => ['nullable', 'string'],
            'type' => ['nullable', 'string' ],
            'is_intangible' => ['nullable',  'boolean'],
            'useful_months' => ['nullable', 'integer'],
            'budget_rubric_id' => ['nullable', 'integer', 'exists:budget_rubrics,id'],
        ];
    }

    public function messages()
    {
        return [
            'sort_order.in' => 'El campo sort_order debe ser ASC o DESC.',
            'start_date.before_or_equal' => 'La fecha de inicio debe ser anterior o igual a la fecha de fin.',
            'end_date.after_or_equal' => 'La fecha de fin debe ser posterior o igual a la fecha de inicio.',
            'search.regex' => 'El campo de búsqueda solo permite caracteres.',
            'color.regex' => 'El campo color debe contener valores hexadecimales.',
            'level.in' => 'El campo nivel debe ser 1, 2 o 3.',
            'include_hierarchy.boolean' => 'El campo incluir jerarquía debe ser 1 (verdadero) o 0 (falso).',
            'row_num.integer' => 'El campo row_num debe ser un número entero.',
            'row_num.min' => 'El campo row_num debe ser al menos 1.',
            'model.model_exists' => 'El modelo seleccionado no existe.',
        ];
        
    }

    public function prepareForValidation()
    {
        if ($this->has('sort_order')) {
            $this->merge([
                'sort_order' => mb_strtoupper(trim($this->input('sort_order'))),
            ]);
        }

        if ($this->has('search')) {
            $this->merge([
                'search' => mb_strtoupper(trim($this->input('search'))),
            ]);
        }

        if ($this->has('code')) {
            $this->merge([
                'code' => mb_strtoupper(trim($this->input('code'))),
            ]);
        }

        if ($this->has('state_name')) {
            $this->merge([
                'state_name' => mb_strtoupper(trim($this->input('state_name'))),
            ]);
        }

        if ($this->has('country')) {
            $this->merge([
                'country' => mb_strtoupper(trim($this->input('country'))),
            ]);
        }

        if ($this->has('branch_name')) {
            $this->merge([
                'branch_name' => mb_strtoupper(trim($this->input('branch_name'))),
            ]);
        }

        if ($this->has('rubric')) {
            $this->merge([
                'rubric' => mb_strtoupper(trim($this->input('rubric'))),
            ]);
        }

        if ($this->has('email')) {
            $this->merge([
                'email' => trim($this->input('email')),
            ]);
        }
    }

}
