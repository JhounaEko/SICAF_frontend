<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Correlative extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    protected $fillable = [
        'description',
        'limit_date',
        'current_number',
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
            $query->where('state_id', $state);
        }
    }

    public function scopeFilterByDescription($query, $description)
    {
        $search = mb_strtoupper(trim($description));
        if (!is_null($description)) {
            $query->where('correlatives.description', 'LIKE', "%{$description}%");
        }
    }

    public function scopeFilterByCurrentNumber($query, $number)
    {
        if (!is_null($number)) {
            $query->where('current_number', $number);
        }
    }
    public function scopeFilterByLimitDate($query, $date)
    {
        if (!is_null($date)) {
            $query->where('limit_date', 'LIKE', $date);
        }
    }

    public function scopeFilterByStateName($query, $stateName)
    {
        if (!is_null($stateName)) {
            $query->join('states', 'correlatives.state_id', '=', 'states.id')
                  ->where('states.name', 'LIKE', "%{$stateName}%")
                  ->select('correlatives.*');
        }
    }

    public function scopeFilterByDates($query, $start, $end)
    {
        if ($start && $end) {
            $query->whereBetween('created_at', [$start, $end]);
        }
    }
}
