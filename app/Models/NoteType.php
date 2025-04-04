<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class NoteType extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    protected $fillable = [
        'name',
        'description',
        'state_id'
    ];

    public function state()
    {
        return $this->belongsTo(State::class, 'state_id');
    }

    public function setNameAttribute($value)
    {
        $this->attributes['name'] = mb_strtoupper(trim($value));
    }

    public function setDescriptionAttribute($value)
    {
        $this->attributes['description'] = mb_strtoupper(trim($value));
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

    public function scopeFilterByNameOrDescription($query, $input)
    {
        $search = mb_strtoupper(trim($input));
        if (!is_null($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%");
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
