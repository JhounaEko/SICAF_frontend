<?php

namespace App\Models;

use Spatie\Permission\Models\Permission as SpatiePermission;

class Permission extends SpatiePermission
{
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
        if (!is_null($name)) {
            $query->where('name', 'LIKE', $name);
        }
    }

    public function scopeFilterByDates($query, $start, $end)
    {
        if ($start && $end) {
            $query->whereBetween('created_at', [$start, $end]);
        }
    }
}
