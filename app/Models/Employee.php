<?php

namespace App\Models;

use OwenIt\Auditing\Contracts\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    /** @use HasFactory<\Database\Factories\EmployeeFactory> */
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'phone_number',
        'position',
        'office_id',
        'state_id'
    ];

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

    public function setPhoneNumberAttribute($value)
    {
        $this->attributes['phone_number'] = trim($value);
    }

    public function setPositionAttribute($value)
    {
        $this->attributes['position'] = trim($value);
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

    public function scopeFilterByPosition($query, $position)
    {
        if (!is_null($position)) {
            $query->where('position', 'LIKE', "%{$position}%");
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

    public function scopeFilterByDates($query, $start, $end)
    {
        if ($start && $end) {
            $query->whereBetween('created_at', [$start, $end]);
        }
    }

}
