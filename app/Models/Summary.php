<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Summary extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    protected $fillable = [
        'rubric',
        'acquisition_cost',
        'accumulated_depreciation',
        'asset_cost',
        'current_cost',
        'annual_depreciation',
        'current_depreciation',
        'total_accumulated_depreciation',
        'net_value',
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

    public function scopeSort($query, $sortBy, $sortOrder = 'asc')
    {
        return $query->orderBy($sortBy, $sortOrder);
    }

    public function scopeFilterByState($query, $state)
    {
        if (!is_null($state)) {
            $query->where('summaries.state_id', $state);
        }
    }

    public function scopeFilterByRubric($query, $rubric)
    {
        $search = mb_strtoupper(trim($rubric));
        if (!is_null($search)) {
            $query->where('summaries.rubric', 'LIKE', "%{$search}%");
        }
    }

    public function scopeFilterByAcquisitionCost($query, $value_decimal)
    {
        $search = trim($value_decimal);
        if (!is_null($search)) {
            $query->where('acquisition_cost', 'LIKE', "%{$search}%");
        }
    }
    public function scopeFilterByAccumulatedDepreciation($query, $value_decimal)
    {
        $search = trim($value_decimal);
        if (!is_null($search)) {
            $query->where('accumulated_depreciation', 'LIKE', "%{$search}%");
        }
    }
    public function scopeFilterByAssetCost($query, $value_decimal)
    {
        $search = trim($value_decimal);
        if (!is_null($search)) {
            $query->where('asset_cost', 'LIKE', "%{$search}%");
        }
    }
    public function scopeFilterByCurrentCost($query, $value_decimal)
    {
        $search = trim($value_decimal);
        if (!is_null($search)) {
            $query->where('current_cost', 'LIKE', "%{$search}%");
        }
    }
    public function scopeFilterByAnnualDepreciation($query, $value_decimal)
    {
        $search = trim($value_decimal);
        if (!is_null($search)) {
            $query->where('annual_depreciation', 'LIKE', "%{$search}%");
        }
    }
    public function scopeFilterByCurrentDepreciation($query, $value_decimal)
    {
        $search = trim($value_decimal);
        if (!is_null($search)) {
            $query->where('current_depreciation', 'LIKE', "%{$search}%");
        }
    }
    public function scopeFilterByTotalAcumulatedDepreciation($query, $value_decimal)
    {
        $search = trim($value_decimal);
        if (!is_null($search)) {
            $query->where('total_accumulated_depreciation', 'LIKE', "%{$search}%");
        }
    }
    public function scopeFilterByNetValue($query, $value_decimal)
    {
        $search = trim($value_decimal);
        if (!is_null($search)) {
            $query->where('net_value', 'LIKE', "%{$search}%");
        }
    }

    public function scopeFilterByStateName($query, $stateName)
    {
        if (!is_null($stateName)) {
            $query->join('states', 'summaries.state_id', '=', 'states.id')
                ->where('states.name', 'LIKE', "%{$stateName}%")
                ->select('summaries.*');
        }
    }

    public function scopeFilterByDates($query, $start, $end)
    {
        if ($start && $end) {
            $query->whereBetween('summaries.created_at', [$start, $end]);
        }
    }
}
