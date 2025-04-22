<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class HistoricIncrement extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    protected $fillable = [
        'item_id',
        'date',
        'description',
        'is_active',
        'state_id'
    ];

    public function state()
    {
        return $this->belongsTo(State::class, 'state_id');
    }

    public function scopeSort($query, $sortBy, $sortOrder = 'asc')
    {
        return $query->orderBy($sortBy, $sortOrder);
    }

    public function scopeFilterByState($query, $state)
    {
        if (!is_null($state)) {
            $query->where('historic_increments.state_id', $state);
        }
    }

    public function scopeFilterByItem($query, $item)
    {
        if (!is_null($item)) {
            $query->where('historic_increments.item_id', $item);
        }
    }

    public function scopeFilterByDate($query, $date)
    {
        if (!is_null($date)) {
            $query->where('historic_increments.date', 'LIKE', $date);
        }
    }
    public function scopeFilterByDescription($query, $input)
    {
        $search = mb_strtoupper(trim($input));
        if (!is_null($search)) {
            $query->where('historic_increments.description', 'LIKE', "%{$search}%");
        }
    }
    
    public function scopeFilterByIsActive($query, $bool)
    {
        if (!is_null($bool)) {
            $query->where('historic_increments.is_active', $bool);
        }
    }
    
    public function scopeFilterByStateName($query, $stateName)
    {
        if (!is_null($stateName)) {
            $query->join('states', 'historic_increments.state_id', '=', 'states.id')
                ->where('states.name', 'LIKE', "%{$stateName}%")
                ->select('historic_increments.*');
        }
    }

    public function scopeFilterByDates($query, $start, $end)
    {
        if ($start && $end) {
            $query->whereBetween('historic_increments.created_at', [$start, $end]);
        }
    }
}
