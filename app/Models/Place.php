<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Place extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    protected $fillable = [
        'code',
        'description',
        'abbreviation',
        'details',
        'state_id'
    ];

    public function state()
    {
        return $this->belongsTo(State::class, 'state_id');
    }

    public function setDescriptionAttribute($value){
        $this->attributes['description'] = mb_strtoupper(trim($value));
    }

    public function setCodeAttribute($value) {
        $this->attributes['code'] = mb_strtoupper(trim($value));
    }

    public function setAbbreviationAttribute($value) {
        $this->attributes['abbreviation'] = mb_strtoupper(trim($value));
    }

    public function setDetailsAttribute($value) {
        $this->attributes['details'] = mb_strtoupper(trim($value));
    }

    public function scopeSort($query, $sortBy, $sortOrder = 'asc')
    {
        return $query->orderBy($sortBy, $sortOrder);
    }
    
    public function scopeFilterByState($query, $state)
    {
        if (!is_null($state)) {
            $query->where('places.state_id', $state);
        }
    }

    public function scopeFilterByAbbreviationOrDescriptionOrDetails($query, $input)
    {
        $search = mb_strtoupper(trim($input));
        if (!is_null($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('places.description', 'LIKE', "%{$search}%")
                    ->orWhere('places.abbreviation', 'LIKE', "%{$search}%")
                    ->orWhere('places.details', 'LIKE', "%{$search}%");
            });
        }
    }

    public function scopeFilterByCode($query, $input)
    {
        $search = mb_strtoupper(trim($input));
        if (!is_null($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('places.code', 'LIKE', "%{$search}%");
            });
        }
    }

    public function scopeFilterByStateName($query, $stateName)
    {
        if (!is_null($stateName)) {
            $query->join('states', 'places.state_id', '=', 'states.id')
                  ->where('states.name', 'LIKE', "%{$stateName}%")
                  ->select('places.*');
        }
    }

    public function scopeFilterByDates($query, $start, $end)
    {
        if ($start && $end) {
            $query->whereBetween('places.created_at', [$start, $end]);
        }
    }


}
