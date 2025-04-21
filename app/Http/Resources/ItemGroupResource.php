<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemGroupResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'item_description' => $this->item_description,
            'item_group_type_id' => $this->item_group_type_id,
            'alphanumeric_code' => $this->alphanumeric_code,
            'item_group_description' => $this->item_group_description,
            'material' => $this->material,
            'type' => $this->type,
            'is_intangible' => $this->is_intangible,
            'useful_months' => $this->useful_months,
            'state' => [
                'name' => $this->state->name,
                'code' => $this->state->code,
                'color' => $this->state->color
            ],
            'budget_rubric' => [
                'rubric' => $this->budget_rubric->rubric,
                'description' => $this->budget_rubric->description
            ],
            'created_at' => $this->created_at->format('d-m-Y h:m'),
            'updated_at' => $this->updated_at->format('d-m-Y h:m')
        ];
    }
}
