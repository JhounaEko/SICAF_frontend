<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OfficeLocationResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'office' => $this->office ? [
                'name' => $this->office->name,
                'id' => $this->office->id,
            ] : [],
            'place' => $this->place ? [
                'description' => $this->place->description,
                'code' => $this->place->code,
            ] : [],
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
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
