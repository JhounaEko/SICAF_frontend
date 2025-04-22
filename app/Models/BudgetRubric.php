<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class BudgetRubric extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    protected $fillable = [
        'rubric',
        'description',
        'lifespan',
        'is_depreciated',
        'state_id'
    ];

    public function state()
    {
        return $this->belongsTo(State::class, 'state_id');
    }

    public function setRubricAttribute($value)
    {
        $this->attributes['rubric'] = mb_strtoupper(trim($value));
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
            $query->where('budget_rubrics.state_id', $state);
        }
    }

    public function scopeFilterByDescription($query, $description)
    {
        $search = mb_strtoupper(trim($description));
        if (!is_null($search)) {
            $query->where('budget_rubrics.description', 'LIKE', "%{$search}%");
        }
    }

    public function scopeFilterByRubric($query, $rubric)
    {
        if (!is_null($rubric)) {
            $query->where('budget_rubrics.rubric', 'LIKE', "%{$rubric}%");
        }
    }

    public function scopeFilterByLifespan($query, $lifespan)
    {
        if (!is_null($lifespan)) {
            $query->where('budget_rubrics.lifespan', $lifespan);
        }
    }

    public function scopeFilterByIsDepreciated($query, $is_depreciated)
    {
        if (!is_null($is_depreciated)) {
            $query->where('budget_rubrics.is_depreciated', $is_depreciated);
        }
    }

    public function scopeFilterByStateName($query, $stateName)
    {
        if (!is_null($stateName)) {
            $query->join('states', 'budget_rubrics.state_id', '=', 'states.id')
                ->where('states.name', 'LIKE', "%{$stateName}%")
                ->select('budget_rubrics.*');
        }
    }

    public function scopeFilterByDates($query, $start, $end)
    {
        if ($start && $end) {
            $query->whereBetween('budget_rubrics.created_at', [$start, $end]);
        }
    }

}
