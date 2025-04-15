<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Menu extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    protected $fillable = [
        'label',
        'parent',
        'route',
        'icon',
        'level',
        'order',
        'state_id'
    ];

    public function state()
    {
        return $this->belongsTo(State::class, 'state_id');
    }

    public function roles (){
        return $this->belongsToMany(Role::class, 'role_menu', 'menu_id', 'role_id');
    }
    public function setLabelAttribute($value)
    {
        $this->attributes['label'] = mb_strtoupper(trim($value));
    }

    public function setRouteAttribute($value)
    {
        $this->attributes['route'] = mb_strtoupper(trim($value));
    }

    public function setIconAttribute($value)
    {
        $this->attributes['icon'] = mb_strtoupper(trim($value));
    }

    public function parent()
    {
        return $this->belongsTo(Menu::class, 'parent');
    }

    public function childMenus()
    {
        return $this->hasMany(Menu::class, 'parent')->with('childMenus');
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

    public function scopeFilterByIcon($query, $icon)
    {
        if (!is_null($icon)) {
            $query->where('icon',  'LIKE', "%{$icon}%");
        }
    }

    public function scopeFilterByParent($query, $parent)
    {
        if (!is_null($parent)) {
            $query->where('parent', $parent);
        }
    }

    public function scopeFilterByLabelOrRoute($query, $input)
    {
        $search = mb_strtoupper(trim($input));
        if (!is_null($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('label', 'LIKE', "%{$search}%")
                    ->orWhere('route', 'LIKE', "%{$search}%");
            });
        }
    }

    public function scopeFilterByStateName($query, $stateName)
    {
        if (!is_null($stateName)) {
            $query->join('states', 'menus.state_id', '=', 'states.id')
                  ->where('states.name', 'LIKE', "%{$stateName}%")
                  ->select('menus.*');
        }
    }
    
    public function scopeFilterByDates($query, $start, $end)
    {
        if ($start && $end) {
            $query->whereBetween('created_at', [$start, $end]);
        }
    }
}
