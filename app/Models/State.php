<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class State extends Model implements Auditable
{
    /** @use HasFactory<\Database\Factories\StateFactory> */
    use \OwenIt\Auditing\Auditable, HasFactory;

    protected $fillable = [
        'name',
        'description',
        'code',
        'color',
        'order'
    ];

    public function offices()
    {
        return $this->hasMany(Office::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function setNameAttribute($value)
    {
        $this->attributes['name'] = mb_strtoupper(trim($value));
    }

    public function setDescriptionAttribute($value)
    {
        $this->attributes['description'] = mb_strtoupper(trim($value));
    }

    public function setCodeAttribute($value)
    {
        $this->attributes['code'] = mb_strtoupper(trim($value));
    }

    public function setColorAttribute($value)
    {
        $this->attributes['color'] = mb_strtoupper(trim($value));
    }

    public function setOrderAttribute($value)
    {
        $this->attributes['order'] = mb_strtoupper(trim($value));
    }

    public function scopeSort($query, $sortBy, $sortOrder = 'asc')
    {
        return $query->orderBy($sortBy, $sortOrder);
    }

    public function scopeFilterByDescriptionOrName($query, $input)
    {
        $search = mb_strtoupper(trim($input));
        if (!is_null($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('description', 'LIKE', "%{$search}%")
                    ->orWhere('name', 'LIKE', "%{$search}%");
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
