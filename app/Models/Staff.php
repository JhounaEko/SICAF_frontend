<?php

namespace App\Models;

use OwenIt\Auditing\Contracts\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Staff extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    /** @use HasFactory<\Database\Factories\EmployeeFactory> */
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'identity_card',
        'issued_by',
        'phone_number',
        'office_phone_number',
        'other_phone_number',
        'email',
        'position_id',
        'office_id',
        'place_id',
        'state_id'
    ];

    public function office()
    {
        return $this->belongsTo(Office::class, 'office_id');
    }

    public function place()
    {
        return $this->belongsTo(Place::class, 'place_id');
    }

    public function state()
    {
        return $this->belongsTo(State::class, 'state_id');
    }

    public function setFirstNameAttribute($value)
    {
        $this->attributes['first_name'] = mb_strtoupper(trim($value));
    }

    public function setLastNameAttribute($value)
    {
        $this->attributes['last_name'] = mb_strtoupper(trim($value));
    }

    public function setPhoneNumberAttribute($value)
    {
        $this->attributes['phone_number'] = trim($value);
    }

    public function setIdentityCardAttribute($value)
    {
        $this->attributes['identity_card'] = mb_strtoupper(trim($value));
    }

    public function setIssuedByAttribute($value)
    {
        $this->attributes['issued_by'] = mb_strtoupper(trim($value));
    }

    public function setEmailAttribute($value)
    {
        $this->attributes['email'] = trim($value);
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

    public function scopeFilterByOffice($query, $office)
    {
        if (!is_null($office)) {
            $query->where('office_id', $office);
        }
    }

    public function scopeFilterByPlace($query, $office)
    {
        if (!is_null($office)) {
            $query->where('place_id', $office);
        }
    }

    public function scopeFilterByPosition($query, $office)
    {
        if (!is_null($office)) {
            $query->where('position_id', $office);
        }
    }


    public function scopeFilterByName($query, $input)
    {
        $search = mb_strtoupper(trim($input));
        if (!is_null($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('staff.first_name', 'LIKE', "%{$search}%")
                    ->orWhere('staff.last_name', 'LIKE', "%{$search}%");
            });
        }
    }

    public function scopeFilterByOfficeName($query, $officeName)
    {
        if (!is_null($officeName)) {
            $query->join('offices', 'staff.office_id', '=', 'offices.id')
                ->where('offices.name', 'LIKE', "%{$officeName}%")
                ->select('staff.*');
        }
    }

    public function scopeFilterByOfficeInitials($query, $officeInitials)
    {
        if (!is_null($officeInitials)) {
            $query->join('offices', 'staff.office_id', '=', 'offices.id')
                ->where('offices.initials', 'LIKE', "%{$officeInitials}%")
                ->select('staff.*');
        }
    }

    public function scopeFilterByPlaceName($query, $placeName)
    {
        if (!is_null($placeName)) {
            $query->join('places', 'staff.place_id', '=', 'places.id')
                ->where('places.description', 'LIKE', "%{$placeName}%")
                ->select('staff.*');
        }
    }

    public function scopeFilterByPositionName($query, $positionName)
    {
        if (!is_null($positionName)) {
            $query->join('positions', 'staff.position_id', '=', 'positions.id')
                ->where('positions.name', 'LIKE', "%{$positionName}%")
                ->select('staff.*');
        }
    }
    
    public function scopeFilterByStateName($query, $stateName)
    {
        if (!is_null($stateName)) {
            $query->join('states', 'staff.state_id', '=', 'states.id')
                  ->where('states.name', 'LIKE', "%{$stateName}%")
                  ->select('staff.*');
        }
    }

    public function scopeFilterByEmail($query, $email)
    {
        if (!is_null($email)) {
            $query->where('staff.email', 'LIKE', $email);
        }
    }

    public function scopeFilterByIdentityCard($query, $identityCard)
    {
        $search = mb_strtoupper(trim($identityCard));
        if (!is_null($search)) {
            $query->where('staff.identity_card', 'LIKE', "%{$search}%");
        }
    }

    public function scopeFilterByIssuedBy($query, $issuedBy)
    {
        $search = mb_strtoupper(trim($issuedBy));
        if (!is_null($search)) {
            $query->where('staff.issued_by', 'LIKE', "%{$search}%");
        }
    }

    public function scopeFilterByDates($query, $start, $end)
    {
        if ($start && $end) {
            $query->whereBetween('staff.created_at', [$start, $end]);
        }
    }
}
