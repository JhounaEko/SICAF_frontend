<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SummaryRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        if ($this->method() === 'PATCH') {
            return [
                'rubric' => ['sometimes', 'string'],
                'acquisition_cost' => ['sometimes', 'decimal:0,2'],
                'accumulated_depreciation' => ['sometimes', 'decimal:0,2'],
                'asset_cost' => ['sometimes', 'decimal:0,2'],
                'current_cost' => ['sometimes', 'decimal:0,2'],
                'annual_depreciation' => ['sometimes', 'decimal:0,2' ],
                'current_depreciation' => ['sometimes',  'decimal:0,2'],
                'total_accumulated_depreciation' => ['sometimes', 'decimal:0,2'],
                'net_value' => ['sometimes', 'decimal:0,2'],
                'state_id' => ['nullable', 'integer', 'exists:states,id'],
            ];
        }
        return [

            'rubric' => ['required', 'string'],
            'acquisition_cost' => ['required', 'decimal:0,2'],
            'accumulated_depreciation' => ['required', 'decimal:0,2'],
            'asset_cost' => ['required', 'decimal:0,2'],
            'current_cost' => ['required', 'decimal:0,2'],
            'annual_depreciation' => ['required', 'decimal:0,2'],
            'current_depreciation' => ['required',  'decimal:0,2'],
            'total_accumulated_depreciation' => ['required', 'decimal:0,2'],
            'net_value' => ['required', 'decimal:0,2'],
            'state_id' => ['nullable', 'integer', 'exists:states,id'],
        ];
    }
}
