<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class OfficeLocation extends Model  implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    protected $fillable = [
        'office_id',
        'place_id',
        'state_id',
        'latitude',
        'longitude'
    ];

    // protected $casts = [
    //     'latitude' => 'decimal:7', // Asegura que se castea a decimal al recuperar
    //     'longitude' => 'decimal:7',
    // ];

    public function office()
    {
        return $this->belongsTo(Office::class);
    }

    public function place()
    {
        return $this->belongsTo(Place::class);
    }

    public function state()
    {
        return $this->belongsTo(State::class);
    }

    public function scopeSort($query, $sortBy, $sortOrder = 'asc')
    {
        return $query->orderBy($sortBy, $sortOrder);
    }

    public function scopeFilterByState($query, $state)
    {
        if (!is_null($state)) {
            $query->where('office_locations.state_id', $state);
        }
    }

    public function scopeFilterByOffice($query, $office)
    {
        if (!is_null($office)) {
            $query->where('office_locations.office_id', $office);
        }
    }

    public function scopeFilterByPlace($query, $place)
    {
        if (!is_null($place)) {
            $query->where('office_locations.place_id', $place);
        }
    }

    public function scopeFilterByCoordinates($query, $input)
    {
        $search = trim($input);
        if (!is_null($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('office_locations.latitude', 'LIKE', "%{$search}%")
                    ->orWhere('office_locations.longitude', 'LIKE', "%{$search}%");
            });
        }
    }

    public function scopeFilterByStateName($query, $stateName)
    {
        if (!is_null($stateName)) {
            $query->join('states', 'office_locations.state_id', '=', 'states.id')
                ->where('states.name', 'LIKE', "%{$stateName}%")
                ->select('office_locations.*');
        }
    }

    public function scopeFilterByOfficeName($query, $officeName)
    {
        if (!is_null($officeName)) {
            $query->join('offices', 'office_locations.office_id', '=', 'offices.id')
                ->where('offices.name', 'LIKE', "%{$officeName}%")
                ->select('office_locations.*');
        }
    }

    public function scopeFilterByPlaceName($query, $placeName)
    {
        if (!is_null($placeName)) {
            $query->join('places', 'office_locations.place_id', '=', 'places.id')
                ->where('places.description', 'LIKE', "%{$placeName}%")
                ->select('office_locations.*');
        }
    }

    public function scopeFilterByDates($query, $start, $end)
    {
        if ($start && $end) {
            $query->whereBetween('office_locations.created_at', [$start, $end]);
        }
    }
}
