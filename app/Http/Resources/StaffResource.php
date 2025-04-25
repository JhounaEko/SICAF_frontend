<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StaffResource extends JsonResource
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
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'identity_card' => $this->identity_card,
            'issued_by' => $this->issued_by,
            'phone_number' => $this->phone_number,
            'other_phone_number' => $this->other_phone_number,
            'office_phone_number' => $this->office_phone_number,
            'email' => $this->email,
            'position' => [
                'name' => $this->position->name,
                'id' => $this->position->id,
            ],
            'office' => [
                'name' => $this->office->name,
                'initials' => $this->office->initials,
            ],
            'place' => $this->place ? [
                'name' => $this->place->description,
                'initials' => $this->place->abbreviation,
            ] : [],
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
