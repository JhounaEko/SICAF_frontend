<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class EnterpriseRubric extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    protected $fillable = [
        'description',
        'state_id'
    ];

    public function state()
    {
        return $this->belongsTo(State::class, 'state_id');
    }

    public function setDescriptionAttribute($value)
    {
        $this->attributes['description'] = mb_strtoupper(trim($value));
    }

    public function scopeSort($query, $sortBy, $sortOrder = 'asc')
    {
        return $query->orderBy($sortBy, $sortOrder);
    }

    public function scopeFilterByState($query, $state)
    {
        if (!is_null($state)) {
            $query->where('enterprise_rubrics.state_id', $state);
        }
    }

  
    public function scopeFilterByDescription($query, $input)
    {
        $search = mb_strtoupper(trim($input));
        if (!is_null($search)) {
            $query->where('enterprise_rubrics.description', 'LIKE', "%{$search}%");
        }
    }

    public function scopeFilterByStateName($query, $stateName)
    {
        if (!is_null($stateName)) {
            $query->join('states', 'enterprise_rubrics.state_id', '=', 'states.id')
                ->where('states.name', 'LIKE', "%{$stateName}%")
                ->select('enterprise_rubrics.*');
        }
    }

    public function scopeFilterByDates($query, $start, $end)
    {
        if ($start && $end) {
            $query->whereBetween('enterprise_rubrics.created_at', [$start, $end]);
        }
    }
}
