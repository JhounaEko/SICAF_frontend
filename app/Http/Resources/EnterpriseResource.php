<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EnterpriseResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'initials' => $this->initials,
            'branch_name' => $this->branch_name,
            'address' => $this->address,
            'country' => $this->country,
            'phone_number' => $this->phone_number,
            'other_phone_number' => $this->other_phone_number,
            'email' => $this->email,
            'representative_name' => $this->representative_name,
            'contact_name' => $this->contact_name,
            'state' => [
                'name' => $this->state->name,
                'code' => $this->state->code,
                'color' => $this->state->color
            ],
            'enterprise_rubric' => [
                'description' => $this->enterprise_rubric->description,
            ],
            'created_at' => $this->created_at->format('d-m-Y h:m'),
            'updated_at' => $this->updated_at->format('d-m-Y h:m')

        ];
    }
}
