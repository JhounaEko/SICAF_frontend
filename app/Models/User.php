<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles, HasApiTokens, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'phone_number',
        'username',
        'password',
        'email',
        'office_id',
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

    public function office()
    {
        return $this->belongsTo(Office::class, 'office_id');
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
    
    public function scopeFilterByOffice($query, $office) {
        if (!is_null($office)){
            $query->where('office_id', $office);
        }
    }

    public function scopeFilterByName($query, $input)
    {
        $search = mb_strtoupper(trim($input));
        if (!is_null($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'LIKE', "%{$search}%")
                    ->orWhere('last_name', 'LIKE', "%{$search}%");
            });
        }
    }

    public function scopeFilterByEmail($query, $email){
        if (!is_null($email)){
            $query->where('email', 'LIKE', $email);
        }
    }

    public function scopeFilterByDates($query, $start, $end)
    {
        if ($start && $end) {
            $query->whereBetween('created_at', [$start, $end]);
        }
    }

    public function scopeFilterByUsername($query, $username) {
        if (!is_null($username)) {
            $query->where('username', $username);
        }
    }

}
