<?php

namespace App\Models;

use Spatie\Permission\Models\Role as SpatieRole;
use OwenIt\Auditing\Contracts\Auditable;


class Role extends SpatieRole implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    protected $fillable = [
        'name',
        'guard_name',
        'state_id'
    ];

    public function state()
    {
        return $this->belongsTo(State::class, 'state_id');
    }

    public function menus()
    {
        return $this->belongsToMany(Menu::class, 'role_menu', 'role_id', 'menu_id');
    }

    public function setNameAttribute($value)
    {
        $this->attributes['name'] = mb_strtoupper(trim($value));
    }

    // public function setGuardNameAttribute($value){
    //     $this->attributes['guard_name'] = mb_strtoupper(trim($value));
    // }

    public function scopeSort($query, $sortBy, $sortOrder = 'asc')
    {
        return $query->orderBy($sortBy, $sortOrder);
    }

    public function scopeFilterByState($query, $state)
    {
        if (!is_null($state)) {
            $query->where('roles.state_id', $state);
        }
    }

    public function scopeFilterByName($query, $name){
        $search = mb_strtoupper(trim($name));
        if (!is_null($search)) {
            $query->where('roles.name', 'LIKE', "%{$search}%");
        }
    }


    public function scopeFilterByStateName($query, $stateName)
    {
        if (!is_null($stateName)) {
            $query->join('states', 'roles.state_id', '=', 'states.id')
                  ->where('states.name', 'LIKE', "%{$stateName}%")
                  ->select('roles.*');
        }
    }

 

    public function scopeFilterByDates($query, $start, $end)
    {
        if ($start && $end) {
            $query->whereBetween('roles.created_at', [$start, $end]);
        }
    }
}
