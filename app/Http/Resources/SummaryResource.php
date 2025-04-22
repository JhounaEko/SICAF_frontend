<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SummaryResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            'rubric' => $this->rubric,
            'acquisition_cost' => $this->acquisition_cost,
            'accumulated_depreciation' => $this->accumulated_depreciation,
            'asset_cost' => $this->asset_cost,
            'current_cost' => $this->current_cost,
            'annual_depreciation' => $this->annual_depreciation,
            'current_depreciation' => $this->current_depreciation,
            'total_accumulated_depreciation' => $this->total_accumulated_depreciation,
            'net_value' => $this->net_value,
            'state' => [
                'name' => $this->state->name,
                'code' => $this->state->code,
                'color' => $this->state->color
            ],
            'created_at' => $this->created_at->format('d-m-Y h:m'),
            'updated_at' => $this->updated_at->format('d-m-Y h:m')
        ];
    }
}
