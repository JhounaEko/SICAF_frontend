<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class HistoricReg extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    protected $fillable = [
        'ni',
        'cp',
        'ce',
        'cc',
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
            $query->where('historic_regs.state_id', $state);
        }
    }

    public function scopeFilterByNi($query, $input)
    {
        if (!is_null($input)) {
            $query->where('ni', $input);
        }
    }

    public function scopeFilterByCp($query, $input)
    {
        $search = mb_strtoupper(trim($input));
        if (!is_null($search)) {
            $query->where('cp', 'LIKE', "%{$search}%");
        }
    }

    public function scopeFilterByCe($query, $input)
    {
        if (!is_null($input)) {
            $query->where('ce', $input);
        }
    }

    public function scopeFilterByCc($query, $input)
    {
        if (!is_null($input)) {
            $query->where('cc', $input);
        }
    }

    public function scopeFilterByStateName($query, $stateName)
    {
        if (!is_null($stateName)) {
            $query->join('states', 'historic_regs.state_id', '=', 'states.id')
                ->where('states.name', 'LIKE', "%{$stateName}%")
                ->select('historic_regs.*');
        }
    }

    public function scopeFilterByDates($query, $start, $end)
    {
        if ($start && $end) {
            $query->whereBetween('historic_regs.created_at', [$start, $end]);
        }
    }

}
