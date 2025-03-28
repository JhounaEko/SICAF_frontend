<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuResource extends JsonResource
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
            'label' => $this->label,
            'route' => $this->route,
            'icon' => $this->icon,
            'parent' => $this->parent,
            'children' => MenuResource::collection($this->whenLoaded('childMenus')),
            'level' => $this->level,
            'order' => $this->order,
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
