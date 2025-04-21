<?php

namespace App\Models;

use OwenIt\Auditing\Contracts\Auditable;
use Spatie\Permission\Models\Permission as SpatiePermission;

class Permission extends SpatiePermission implements Auditable
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

    public function setNameAttribute($value){
        $this->attributes['name'] = mb_strtoupper(trim($value));
    }

    // public function setGuardNameAttribute($value){
    //     $this->attributes['guard_name'] = mb_strtoupper(trim($value));
    // }

    public function scopeSort($query, $sortBy, $sortOrder = 'asc')
    {
        return $query->orderBy($sortBy, $sortOrder);
    }

    public function scopeFilterByState($query, $state){
        if (!is_null($state)) {
            $query->where('state_id', $state);
        }
    }

    public function scopeFilterByName($query, $name){
<<<<<<< HEAD
        
        $search = mb_strtoupper(trim($name));

        if (!is_null($search)) {
            $query->where('name', 'LIKE',"%{$search}%");
=======
        if (!is_null($name)) {
            $query->where('name', 'LIKE', "%".$name."%");
>>>>>>> ActualizacionPermisos
        }
    }

    public function scopeFilterByStateName($query, $stateName)
    {
        if (!is_null($stateName)) {
            $query->join('states', 'permissions.state_id', '=', 'states.id')
                  ->where('states.name', 'LIKE', "%{$stateName}%")
                  ->select('permissions.*');
        }
    }

    public function scopeFilterByDates($query, $start, $end)
    {
        if ($start && $end) {
            $query->whereBetween('created_at', [$start, $end]);
        }
    }
}
