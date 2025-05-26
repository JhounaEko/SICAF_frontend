<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use OwenIt\Auditing\Contracts\Auditable;
use App\Models\Role as AppRoleModel;

class User extends Authenticatable implements Auditable
{
    use \OwenIt\Auditing\Auditable;

    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'phone_number',
        'identity_card',
        'issued_by',
        'username',
        'password',
        // 'password_change_count',
        'email',
        'office_location_id',
        'state_id'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // public function roles()
    // {

    //     return $this->belongsToMany(AppRoleModel::class, 'model_has_roles', 'model_id', 'role_id');
    // }

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

    public function setFirstNameAttribute($value)
    {
        $this->attributes['first_name'] = mb_strtoupper(trim($value));
    }

    public function setLastNameAttribute($value)
    {
        $this->attributes['last_name'] = mb_strtoupper(trim($value));
    }

    public function setUsernameAttribute($value)
    {
        $this->attributes['username'] = mb_strtoupper(trim($value));
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
                ->join('office_locations', 'users.office_location_id', '=', 'office_locations.id')
                ->join('offices', 'office_locations.office_id', '=', 'offices.id')
                ->orderBy("offices.{$officeField}", $sortOrder)
                ->select('users.*');
        }
    
        if (in_array($sortBy, ['place_name'])) {
            return $query
                ->join('office_locations', 'users.office_location_id', '=', 'office_locations.id')
                ->join('places', 'office_locations.place_id', '=', 'places.id')
                ->orderBy("places.description", $sortOrder)
                ->select('users.*');
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
            $query->where('office_id', $office);
        }
    }

    public function scopeFilterByOfficeName($query, $officeName)
    {
        if ($officeName) {
            $query->whereHas('officeLocation.office', function ($q) use ($officeName) {
                $q->where('name', 'ILIKE', "%{$officeName}%");
            });
        }
    }
    
    public function scopeFilterByStateName($query, $stateName)
    {
        if (!is_null($stateName)) {
            $query->join('states', 'users.state_id', '=', 'states.id')
                  ->where('states.name', 'LIKE', "%{$stateName}%")
                  ->select('users.*');
        }
    }

    public function scopeFilterByPlaceName($query, $placeName)
    {
        if ($placeName) {
            $query->whereHas('officeLocation.place', function ($q) use ($placeName) {
                $q->where('description', 'ILIKE', "%{$placeName}%");
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

    public function scopeFilterByName($query, $input)
    {
        $search = mb_strtoupper(trim($input));
        if (!is_null($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('users.first_name', 'LIKE', "%{$search}%")
                    ->orWhere('users.last_name', 'LIKE', "%{$search}%");
            });
        }
    }

    public function scopeFilterByEmail($query, $email)
    {     
        if (!is_null($email)) {
            $query->where('users.email', 'LIKE', $email);
        }
    }

    

    public function scopeFilterByIdentityCard($query, $identityCard)
    {
        $search = mb_strtoupper(trim($identityCard));
        if (!is_null($search)) {
            $query->where('users.identity_card', 'LIKE', "%{$search}%");
        }
    }

    public function scopeFilterByIssuedBy($query, $issuedBy)
    {
        $search = mb_strtoupper(trim($issuedBy));
        if (!is_null($search)) {
            $query->where('users.issued_by', 'LIKE', "%{$search}%");
        }
    }
    public function scopeFilterByDates($query, $start, $end)
    {
        if ($start && $end) {
            $query->whereBetween('users.created_at', [$start, $end]);
        }
    }

    public function scopeFilterByUsername($query, $username)
    {
        $search = mb_strtoupper(trim($username));
        if (!is_null($username)) {        
            $query->where('username', 'LIKE', "%{$search}%");
        }
    }
}
