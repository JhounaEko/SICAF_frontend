<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StateResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'code' => $this->code,
            'color' => $this->color,
            'order' => $this->order,
            'created_at' => $this->created_at->format('d-m-Y H:m'),
            'upates_at' => $this->updated_at->format('d-m-Y H:m') 
        ];
    }
}
