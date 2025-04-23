<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Enterprise extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    protected $fillable = [
        'name',
        'initials',
        'branch_name',
        'address',
        'country',
        'phone_number',
        'other_phone_number',
        'email',
        'state_id',
        'enterprise_rubric_id',
        'representative_name',
        'contact_name'
    ];

    public function state()
    {
        return $this->belongsTo(State::class, 'state_id');
    }

    public function enterprise_rubric()
    {
        return $this->belongsTo(EnterpriseRubric::class, 'enterprise_rubric_id');
    }

    public function setNameAttribute($value)
    {
        $this->attributes['name'] = mb_strtoupper(trim($value));
    }

    public function setInitialsAttribute($value)
    {
        $this->attributes['initials'] = mb_strtoupper(trim($value));
    }

    public function setBranchNameAttribute($value)
    {
        $this->attributes['branch_name'] = mb_strtoupper(trim($value));
    }

    public function setAddressAttribute($value)
    {
        $this->attributes['address'] = mb_strtoupper(trim($value));
    }

    public function setCountryAttribute($value)
    {
        $this->attributes['country'] = mb_strtoupper(trim($value));
    }

    public function setRepresentativeNameAttribute($value)
    {
        $this->attributes['representative_name'] = mb_strtoupper(trim($value));
    }

    public function setContactNameAttribute($value)
    {
        $this->attributes['contact_name'] = mb_strtoupper(trim($value));
    }

    public function scopeSort($query, $sortBy, $sortOrder = 'asc')
    {
        return $query->orderBy($sortBy, $sortOrder);
    }

    public function scopeFilterByState($query, $state)
    {
        if (!is_null($state)) {
            $query->where('enterprises.state_id', $state);
        }
    }

    public function scopeFilterByEnterpriseRubric($query, $enterprise_rubric)
    {
        if (!is_null($enterprise_rubric)) {
            $query->where('enterprises.enterprise_rubric_id', $enterprise_rubric);
        }
    }

    public function scopeFilterByNameOrInitialsOrAddress($query, $input)
    {
        $search = mb_strtoupper(trim($input));
        if (!is_null($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('enterprises.name', 'LIKE', "%{$search}%")
                    ->orWhere('enterprises.initials', 'LIKE', "%{$search}%")
                    ->orWhere('enterprises.address', 'LIKE', "%{$search}%");
            });
        }
    }

    public function scopeFilterByBranchName($query, $branch_name)
    {
        
        if (!is_null($branch_name)) {
            $query->where('branch_name', 'LIKE', "%{$branch_name}%");
        }
    }

    public function scopeFilterByCountry($query, $country)
    {
        if (!is_null($country)) {
            $query->where('enterprises.country', 'LIKE', "%{$country}%");
        }
    }

    public function scopeFilterByPhoneNumber($query, $phone_number)
    {
        if (!is_null($phone_number)) {
            $query->where('enterprises.phone_number', 'LIKE', "%{$phone_number}%");
        }
    }

    public function scopeFilterByEmail($query, $email)
    {
        if (!is_null($email)) {
            $query->where('enterprises.email', 'LIKE', "%{$email}%");
        }
    }

    public function scopeFilterByContactOrRepresentativeName($query, $input)
    {
        $search = mb_strtoupper(trim($input));
        if (!is_null($search) && !empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('enterprises.representative_name', 'LIKE', "%{$search}%")
                    ->orWhere('enterprises.contact_name', 'LIKE', "%{$search}%");
            });
        }
    }

    public function scopeFilterByStateName($query, $stateName)
    {
        if (!is_null($stateName)) {
            $query->join('states', 'enterprises.state_id', '=', 'states.id')
                ->where('states.name', 'LIKE', "%{$stateName}%")
                ->select('enterprises.*');
        }
    }

    public function scopeFilterByDates($query, $start, $end)
    {
        if ($start && $end) {
            $query->whereBetween('enterprises.created_at', [$start, $end]);
        }
    }

}

