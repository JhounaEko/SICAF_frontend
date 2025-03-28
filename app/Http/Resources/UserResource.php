<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'phone_number' => $this->phone_number,
            'username' => $this->username,
            'email' => $this->email,
            'roles' => $this->roles ? $this->roles->map(function ($role) {
                return [
                    'name' => $role->name,
                    'id' => $role->id,
                    'permissions' => $role->permissions->map(function ($permission) {
                        return [
                            'id' => $permission->id,
                            'name' => $permission->name,
                        ];
                    }),
                    'menus' => $role->menus->map(function ($menu) {
                        return [
                            'id' => $menu->id,
                            'label' => $menu->label,
                            'route' => $menu->route,
                            'icon' => $menu->icon,
                            'level' => $menu->level,
                            'parent' => $menu->parent,
                            // Puedes incluir más detalles del menú si es necesario
                        ];
                    }),
                ];
            }) : [],
            'office' => [
                'name' => $this->office->name,
                'initials' => $this->office->initials,
            ],
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
