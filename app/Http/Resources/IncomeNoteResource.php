<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IncomeNoteResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            'note' => $this->note,
            'payment_receipt' => $this->payment_receipt,
            'expense_receipt' => $this->expense_receipt,
            'voucher_number' => $this->voucher_number,
            'dfm_amount' => $this->dfm_amount,
            'dfm_date' => $this->dfm_date,
            'state' => [
                'name' => $this->state->name,
                'code' => $this->state->code,
                'color' => $this->state->color
            ],
            'created_at' => $this->created_at->format('d-m-Y h:m'),
            'updated_at' => $this->updated_at->format('d-m-Y h:m')
        ];
    }
}
