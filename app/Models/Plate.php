<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Plate extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    protected $fillable = [
        'item_id',
        'description',
        'serie',
        'state_id'
    ];

    public function state()
    {
        return $this->belongsTo(State::class, 'state_id');
    }

    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id');
    }

    public function setDescriptionAttribute($value)
    {
        $this->attributes['description'] = mb_strtoupper(trim($value));
    }

    public function setSerieAttribute($value)
    {
        $this->attributes['serie'] = mb_strtoupper(trim($value));
    }

    public function scopeSort($query, $sortBy, $sortOrder = 'asc')
    {
        return $query->orderBy($sortBy, $sortOrder);
    }

    public function scopeFilterByItem($query, $item)
    {
        if (!is_null($item)) {
            $query->where('plates.item_id', $item);
        }
    }

    public function scopeFilterByState($query, $state)
    {
        if (!is_null($state)) {
            $query->where('plates.state_id', $state);
        }
    }

    public function scopeFilterByDescription($query, $description)
    {
        $search = mb_strtoupper(trim($description));
        if (!is_null($search)) {
            $query->where('plates.description', 'LIKE', "%{$search}%");
        }
    }

    public function scopeFilterBySerie($query, $serie)
    {
        $search = mb_strtoupper(trim($serie));
        if (!is_null($search)) {
            $query->where('plates.serie', 'LIKE', "%{$search}%");
        }
    }

    public function scopeFilterByStateName($query, $stateName)
    {
        if (!is_null($stateName)) {
            $query->join('states', 'plates.state_id', '=', 'states.id')
                ->where('states.name', 'LIKE', "%{$stateName}%")
                ->select('plates.*');
        }
    }

    public function scopeFilterByItemName($query, $itemName)
    {
        if (!is_null($itemName)) {
            $query->join('items', 'plates.item_id', '=', 'items.id')
                ->where('items.description', 'LIKE', "%{$itemName}%")
                ->select('plates.*');
        }
    }

    public function scopeFilterByDates($query, $start, $end)
    {
        if ($start && $end) {
            $query->whereBetween('plates.created_at', [$start, $end]);
        }
    }
}
