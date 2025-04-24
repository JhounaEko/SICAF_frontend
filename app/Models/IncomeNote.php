<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class IncomeNote extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    protected $fillable = [
        'note',
        'payment_receipt',
        'expense_receipt',
        'voucher_number',
        'dfm_amount',
        'dfm_date',
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
            $query->where('income_notes.state_id', $state);
        }
    }

    public function scopeFilterByNote($query, $note)
    {
        $search = trim($note);

        if (!is_null($search)) {
            $query->where('income_notes.note', 'LIKE', "%{$search}%");
        }
    }

    public function scopeFilterByPaymentReceipt($query, $payment_receipt)
    {
        $search = trim($payment_receipt);

        if (!is_null($search)) {
            $query->where('income_notes.payment_receipt', 'LIKE', "%{$search}%");
        }
    }

    public function scopeFilterByExpenseReceipt($query, $expense_receipt)
    {
        $search = trim($expense_receipt);

        if (!is_null($search)) {
            $query->where('income_notes.expense_receipt', 'LIKE', "%{$search}%");
        }
    }

    public function scopeFilterByVoucherNumber($query, $voucher_number)
    {
        $search = trim($voucher_number);

        if (!is_null($search)) {
            $query->where('income_notes.voucher_number', 'LIKE', "%{$search}%");
        }
    }

    public function scopeFilterByDfmAmount($query, $dfm_amount)
    {
        $search = trim($dfm_amount);

        if (!is_null($search)) {
            $query->where('income_notes.dfm_amount', 'LIKE', "%{$search}%");
        }
    }

    public function scopeFilterByDfmDate($query, $dfm_date)
    {
        $search = trim($dfm_date);

        if (!is_null($search)) {
            $query->where('income_notes.dfm_date', 'LIKE', "%{$search}%");
        }
    }

    public function scopeFilterByStateName($query, $stateName)
    {
        if (!is_null($stateName)) {
            $query->join('states', 'income_notes.state_id', '=', 'states.id')
                ->where('states.name', 'LIKE', "%{$stateName}%")
                ->select('income_notes.*');
        }
    }

    public function scopeFilterByDates($query, $start, $end)
    {
        if ($start && $end) {
            $query->whereBetween('item_groups.created_at', [$start, $end]);
        }
    }
}
