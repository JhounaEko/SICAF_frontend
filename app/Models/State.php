<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class State extends Model
{
    /** @use HasFactory<\Database\Factories\StateFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'code',
        'color',
        'order'
    ];

    public function setNameAttribute ($value){
        $this->attributes['name'] = mb_strtoupper(trim($value));
    }

    public function setDescriptionAttribute ($value){
        $this->attributes['description'] = mb_strtoupper(trim($value));
    }

    public function setCodeAttribute ($value){
        $this->attributes['code'] = mb_strtoupper(trim($value));
    }

    public function setColorAttribute ($value){
        $this->attributes['color'] = mb_strtoupper(trim($value));
    }

    public function setOrderAttribute ($value){
        $this->attributes['order'] = mb_strtoupper(trim($value));
    }

}
