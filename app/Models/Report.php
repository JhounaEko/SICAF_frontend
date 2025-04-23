<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Report extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    protected $fillable = [
        'title',
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

    public function setTitleAttribute($value)
    {
        $this->attributes['title'] = mb_strtoupper(trim($value));
    }

    public function scopeSort($query, $sortBy, $sortOrder = 'asc')
    {
        return $query->orderBy($sortBy, $sortOrder);
    }

    public function scopeFilterByState($query, $state)
    {
        if (!is_null($state)) {
            $query->where('reports.state_id', $state);
        }
    }

    public function scopeFilterByDescriptionsOrTitle($query, $input)
    {
        $search = mb_strtoupper(trim($input));
        if (!is_null($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('reports.description', 'LIKE', "%{$search}%")
                    ->orWhere('reports.title', 'LIKE', "%{$search}%");
            });
        }
    }

    public function scopeFilterByStateName($query, $stateName)
    {
        if (!is_null($stateName)) {
            $query->join('states', 'reports.state_id', '=', 'states.id')
                ->where('states.name', 'LIKE', "%{$stateName}%")
                ->select('reports.*');
        }
    }

    public function scopeFilterByDates($query, $start, $end)
    {
        if ($start && $end) {
            $query->whereBetween('reports.created_at', [$start, $end]);
        }
    }
}
