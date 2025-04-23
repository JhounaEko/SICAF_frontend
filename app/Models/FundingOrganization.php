<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class FundingOrganization extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    protected $fillable  = [
        'code',
        'description',
        'abbreviation',
        'year',
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

    public function setAbbreviationAttribute($value)
    {
        $this->attributes['abbreviation'] = mb_strtoupper(trim($value));
    }

    public function scopeSort($query, $sortBy, $sortOrder = 'asc')
    {
        return $query->orderBy($sortBy, $sortOrder);
    }

    public function scopeFilterByState($query, $state)
    {
        if (!is_null($state)) {
            $query->where('funding_organizations.state_id', $state);
        }
    }

    public function scopeFilterByDescriptionOrAbbreviation($query, $input)
    {
        $search = mb_strtoupper(trim($input));
        if (!is_null($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('funding_organizations.description', 'LIKE', "%{$search}%")
                    ->orWhere('funding_organizations.abbreviation', 'LIKE', "%{$search}%");
            });
        }
    }

    public function scopeFilterByCode($query, $code)
    {
        $search = trim($code);
        if (!is_null($search)) {
            $query->where('funding_organizations.code', 'LIKE', "%{$search}%");
        }
    }

    public function scopeFilterByYear($query, $year)
    {
        if (!is_null($year)) {
            $query->where('funding_organizations.year', $year);
        }
    }

    public function scopeFilterByStateName($query, $stateName)
    {
        if (!is_null($stateName)) {
            $query->join('states', 'funding_organizations.state_id', '=', 'states.id')
                ->where('states.name', 'LIKE', "%{$stateName}%")
                ->select('funding_organizations.*');
        }
    }

    public function scopeFilterByDates($query, $start, $end)
    {
        if ($start && $end) {
            $query->whereBetween('funding_organizations.created_at', [$start, $end]);
        }
    }
}
