<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HistoricNoteDetailResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'note_id' => $this->note_id,
            'income_note_id' => $this->income_note_id,
            'payment_voucher' => $this->payment_voucher,
            'expense_voucher' => $this->expense_voucher,
            'voucher' => $this->voucher,
            'fdm_amount' => $this->fdm_amount,
            'fdm_date' => $this->fdm_date,
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
