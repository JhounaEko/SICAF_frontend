<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Document extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    protected $fillable = [
        'item_id',
        'year',
        'original_value',
        'date',
        'useful_months',
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
            $query->where('documents.state_id', $state);
        }
    }

    public function scopeFilterByItem($query, $item)
    {
        if (!is_null($item)) {
            $query->where('documents.item_id', $item);
        }
    }

    public function scopeFilterByYear($query, $year)
    {
        if (!is_null($year)) {
            $query->where('documents.year', $year);
        }
    }

    public function scopeFilterByOriginalValue($query, $original_value)
    {
        if (!is_null($original_value)) {
            $query->where('documents.original_value', $original_value);
        }
    }

    public function scopeFilterByDate($query, $date)
    {
        if (!is_null($date)) {
            $query->where('documents.date', 'LIKE', $date);
        }
    }

    public function scopeFilterByUsefulMonths($query, $useful_months)
    {
        if (!is_null($useful_months)) {
            $query->where('documents.useful_months', $useful_months);
        }
    }

    public function scopeFilterByStateName($query, $stateName)
    {
        if (!is_null($stateName)) {
            $query->join('states', 'documents.state_id', '=', 'states.id')
                ->where('states.name', 'LIKE', "%{$stateName}%")
                ->select('documents.*');
        }
    }

    public function scopeFilterByDates($query, $start, $end)
    {
        if ($start && $end) {
            $query->whereBetween('documents.created_at', [$start, $end]);
        }
    }
}
