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
        'office_location_id',
        'state_id'
    ];

    public function officeLocation()
    {
        return $this->belongsTo(OfficeLocation::class, 'office_location_id');
    }

    public function office()
    {
        return $this->hasOneThrough(
            Office::class,         // Modelo final
            OfficeLocation::class, // Modelo intermedio
            'id',                  // FK en office_locations → aquí coincide con office_location_id de users
            'id',                  // PK en offices
            'office_location_id',  // FK en users
            'office_id'            // FK en office_locations
        );
    }

    public function place()
    {
        return $this->hasOneThrough(
            Place::class,
            OfficeLocation::class,
            'id',
            'id',
            'office_location_id',
            'place_id'
        );
    }

    public function state()
    {
        return $this->belongsTo(State::class, 'state_id');
    }

    public function position()
    {
        return $this->belongsTo(Position::class, 'position_id');
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
        if (in_array($sortBy, ['office_name', 'office_initials'])) {
            $officeField = $sortBy === 'office_name' ? 'name' : 'initials';

            return $query
                ->join('office_locations', 'staff.office_location_id', '=', 'office_locations.id')
                ->join('offices', 'office_locations.office_id', '=', 'offices.id')
                ->orderBy("offices.{$officeField}", $sortOrder)
                ->select('staff.*');
        }

        if (in_array($sortBy, ['place_name'])) {
            return $query
                ->join('office_locations', 'staff.office_location_id', '=', 'office_locations.id')
                ->join('places', 'office_locations.place_id', '=', 'places.id')
                ->orderBy("places.description", $sortOrder)
                ->select('staff.*');
        }

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
            $query->join('office_locations', 'staff.office_location_id', '=', 'office_locations.id')
                ->where('office_locations.office_id', $office)
                ->select('staff.*');
        }
        return $query;
    }

    public function scopeFilterByPlace($query, $place)
    {
        if (!is_null($place)) {
            $query->join('office_locations', 'staff.office_location_id', '=', 'office_locations.id')
                ->where('office_locations.place_id', $place)
                ->select('staff.*');
        }
        return $query;
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
        if ($officeName) {
            $query->whereHas('officeLocation.office', function ($q) use ($officeName) {
                $q->where('name', 'LIKE', "%{$officeName}%");
            });
        }
    }



    public function scopeFilterByOfficeInitials($query, $officeInitials)
    {
        if (!is_null($officeInitials)) {
            $query->whereHas('officeLocation.office', function ($q) use ($officeInitials) {
                $search = mb_strtoupper(trim($officeInitials));
                $q->where('initials', 'LIKE', "%{$search}%");
            });
        }
        return $query;
    }

    public function scopeFilterByPlaceName($query, $placeName)
    {
        if ($placeName) {
            $query->whereHas('officeLocation.place', function ($q) use ($placeName) {
                $q->where('description', 'ILIKE', "%{$placeName}%");
            });
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
        if ($stateName) {
            $query->whereHas(
                'state',
                fn($q) =>
                $q->where('name', 'ILIKE', "%{$stateName}%")
            );
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
