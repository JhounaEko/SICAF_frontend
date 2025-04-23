<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class HistoricNoteDetail extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    protected $fillable = [
        'note_id',
        'income_note_id',
        'payment_voucher',
        'expense_voucher',
        'voucher',
        'fdm_amount',
        'fdm_date',
        'state_id'
    ];

    public function state()
    {
        return $this->belongsTo(State::class, 'state_id');
    }

    public function scopeSort($query, $sortBy, $sortOrder = 'asc')
    {
        return $query->orderBy($sortBy, $sortOrder);
    }

    public function scopeFilterByState($query, $state)
    {
        if (!is_null($state)) {
            $query->where('historic_note_details.state_id', $state);
        }
    }

    public function scopeFilterByNote($query, $note)
    {
        if (!is_null($note)) {
            $query->where('historic_note_details.note_id', $note);
        }
    }

    public function scopeFilterByIncomeNote($query, $note)
    {
        if (!is_null($note)) {
            $query->where('historic_note_details.income_note_id', $note);
        }
    }

    public function scopeFilterByPaymentVoucher($query, $input)
    {
        $search = mb_strtoupper(trim($input));
        if (!is_null($search)) {
            $query->where('historic_note_details.payment_voucher', 'LIKE', "%{$search}%");
        }
    }
    
    public function scopeFilterByExpenseVoucher($query, $input)
    {
        $search = mb_strtoupper(trim($input));
        if (!is_null($search)) {
            $query->where('historic_note_details.expense_voucher', 'LIKE', "%{$search}%");
        }
    }
    
    public function scopeFilterByVoucher($query, $input)
    {
        $search = mb_strtoupper(trim($input));
        if (!is_null($search)) {
            $query->where('historic_note_details.voucher', 'LIKE', "%{$search}%");
        }
    }

    public function scopeFilterByFdmAmount($query, $amount)
    {
        if (!is_null($amount)) {
            $query->where('fdm_amount', $amount);
        }
    }

    public function scopeFilterByFdmDate($query, $date)
    {
        if (!is_null($date)) {
            $query->where('fdm_date', 'LIKE', $date);
        }
    }

    public function scopeFilterByStateName($query, $stateName)
    {
        if (!is_null($stateName)) {
            $query->join('states', 'historic_note_details.state_id', '=', 'states.id')
                ->where('states.name', 'LIKE', "%{$stateName}%")
                ->select('historic_note_details.*');
        }
    }

    public function scopeFilterByDates($query, $start, $end)
    {
        if ($start && $end) {
            $query->whereBetween('historic_note_details.created_at', [$start, $end]);
        }
    }
}
