<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlaceResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'description' => $this->description,
            'code' => $this->code,
            'abbreviation' => $this->abbreviation,
            'details' => $this->details,
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
