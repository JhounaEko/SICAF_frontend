<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SimpleMenuResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'label' => $this->label,
            'icon' => $this->icon,
            'route' => $this->route,
            'level' => $this->level,
            'children' => SimpleMenuResource::collection($this->whenLoaded('childMenus')),
        ];
    }
}
