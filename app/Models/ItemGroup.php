<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class ItemGroup extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    protected $fillable = [
        'item_description',
        'item_group_type_id',
        'alphanumeric_code',
        'item_group_description',
        'material',
        'type',
        'is_intangible',
        'useful_months',
        'budget_rubric_id',
        'state_id'
    ];

    public function state()
    {
        return $this->belongsTo(State::class, 'state_id');
    }

    public function budget_rubric()
    {
        return $this->belongsTo(BudgetRubric::class, 'budget_rubric_id');
    }

    public function setItemDescriptionAttribute($value)
    {
        $this->attributes['item_description'] = mb_strtoupper(trim($value));
    }

    public function setAlphanumericCodeAttribute($value)
    {
        $this->attributes['alphanumeric_code'] = mb_strtoupper(trim($value));
    }

    public function setItemGroupDescriptionAttribute($value)
    {
        $this->attributes['item_group_description'] = mb_strtoupper(trim($value));
    }

    public function setMaterialAttribute($value)
    {
        $this->attributes['material'] = mb_strtoupper(trim($value));
    }

    public function setTypeAttribute($value)
    {
        $this->attributes['type'] = mb_strtoupper(trim($value));
    }

    public function scopeSort($query, $sortBy, $sortOrder = 'asc')
    {
        return $query->orderBy($sortBy, $sortOrder);
    }

    public function scopeFilterByState($query, $state)
    {
        if (!is_null($state)) {
            $query->where('item_groups.state_id', $state);
        }
    }

    public function scopeFilterByBudgetRubric($query, $budget_rubric)
    {
        if (!is_null($budget_rubric)) {
            $query->where('item_groups.budget_rubric_id', $budget_rubric);
        }
    }

    public function scopeFilterByDescriptionsOrMaterial($query, $input)
    {
        $search = mb_strtoupper(trim($input));
        if (!is_null($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('item_groups.item_description', 'LIKE', "%{$search}%")
                    ->orWhere('item_groups.item_group_description', 'LIKE', "%{$search}%")
                    ->orWhere('item_groups.material', 'LIKE', "%{$search}%");
            });
        }
    }

    public function scopeFilterByItemGroupType($query, $item_group_type)
    {
        if (!is_null($item_group_type)) {
            $query->where('item_group_type_id', $item_group_type);
        }
    }

    public function scopeFilterByAlphanumericCode($query, $alphanumeric_code)
    {
        $search = mb_strtoupper(trim($alphanumeric_code));
        if (!is_null($search)) {
            $query->where('item_groups.alphanumeric_code', 'LIKE', "%{$search}%");
        }
    }

    public function scopeFilterByType($query, $type)
    {
        $search = mb_strtoupper(trim($type));
        if (!is_null($search)) {
            $query->where('item_groups.type', 'LIKE', "%{$search}%");
        }
    }

    public function scopeFilterByIsIntangible($query, $is_intangible)
    {
        if (!is_null($is_intangible)) {
            $query->where('is_intangible', $is_intangible);
        }
    }

    public function scopeFilterByUsefulMonths($query, $useful_months)
    {
        if (!is_null($useful_months)) {
            $query->where('useful_months', $useful_months);
        }
    }

    public function scopeFilterByStateName($query, $stateName)
    {
        if (!is_null($stateName)) {
            $query->join('states', 'item_groups.state_id', '=', 'states.id')
                ->where('states.name', 'LIKE', "%{$stateName}%")
                ->select('item_groups.*');
        }
    }

    public function scopeFilterByDates($query, $start, $end)
    {
        if ($start && $end) {
            $query->whereBetween('item_groups.created_at', [$start, $end]);
        }
    }
}
