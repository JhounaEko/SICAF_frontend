<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Office extends Model implements Auditable
{
    /** @use HasFactory<\Database\Factories\OfficeFactory> */
    use \OwenIt\Auditing\Auditable, HasFactory;

    protected $fillable = [
        'name',
        'initials',
        'parent',
        'level',
        'state_id'
    ];

    public function state()
    {
        return $this->belongsTo(State::class, 'state_id');
    }

    public function setNameAttribute($value)
    {
        $this->attributes['name'] = mb_strtoupper(trim($value));
    }

    public function setInitialsAttribute($value)
    {
        $this->attributes['initials'] = mb_strtoupper(trim($value));
    }

    public function parent()
    {
        return $this->belongsTo(Office::class, 'parent');
    }

    public function officeName($parent)
    {
        try {
            if (!is_null($parent)) {
                $respose = Office::find($parent);
                return $respose->name;
            } else {
                return "Sin dependencia";
            } 
        } catch (\Throwable $th) {
            return "Sin dependencia";
        }
     
    }    

    public function childOffices()
    {
        return $this->hasMany(Office::class, 'parent')->with('childOffices');
    }

    public function scopeSort($query, $sortBy, $sortOrder = 'asc')
    {
        return $query->orderBy($sortBy, $sortOrder);
    }

    public function scopeFilterByState($query, $state)
    {
        if (!is_null($state)) {
            $query->where('offices.state_id', $state);
        }
    }

    public function scopeFilterByLevel($query, $level)
    {
        if (!is_null($level)) {
            $query->where('offices.level', $level);
        }
    }

    public function scopeFilterByParent($query, $parent)
    {
        if (!is_null($parent)) {
            $query->where('offices.parent', $parent);
        }
    }

    public function scopeFilterByInitialsOrName($query, $input)
    {
        $search = mb_strtoupper(trim($input));
        if (!is_null($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('offices.initials', 'LIKE', "%{$search}%")
                    ->orWhere('offices.name', 'LIKE', "%{$search}%");
            });
        }
    }

    public function scopeFilterByStateName($query, $stateName)
    {
        if (!is_null($stateName)) {
            $query->join('states', 'offices.state_id', '=', 'states.id')
                ->where('states.name', 'LIKE', "%{$stateName}%")
                ->select('offices.*');
        }
    }

    public function scopeFilterByParentName($query, $name)
    {
        if ($name) {
            $query->whereHas('parent', function ($q) use ($name) {
                $q->where('name', 'ILIKE', "%{$name}%");
            });
        }
    }

    public function scopeFilterByDates($query, $start, $end)
    {
        if ($start && $end) {
            $query->whereBetween('offices.created_at', [$start, $end]);
        }
    }
}
