<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class HistoricExchangeRate extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    protected $fillable = [
        'exchange_rate',
        'exchange_rate_date',
        'ufv',
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
            $query->where('state_id', $state);
        }
    }

    public function scopeFilterByUfv($query, $ufv)
    {
        if (!is_null($ufv)) {
            $query->where('ufv', 'LIKE', $ufv);
        }
    }

    public function scopeFilterByExchangeRate($query, $exchange_rate)
    {
        if (!is_null($exchange_rate)) {
            $query->where('exchange_rate', 'LIKE', $exchange_rate);
        }
    }

    public function scopeFilterByExchangeRateDate($query, $date)
    {
        if (!is_null($date)) {
            $query->where('exchange_rate_date', 'LIKE', $date);
        }
    }

    public function scopeFilterByStateName($query, $stateName)
    {
        if (!is_null($stateName)) {
            $query->join('states', 'historic_exchange_rates.state_id', '=', 'states.id')
                  ->where('states.name', 'LIKE', "%{$stateName}%")
                  ->select('historic_exchange_rates.*');
        }
    }

    public function scopeFilterByDates($query, $start, $end)
    {
        if ($start && $end) {
            $query->whereBetween('created_at', [$start, $end]);
        }
    }

    
}
