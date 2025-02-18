<?php

namespace Database\Seeders;

use App\Models\Office;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Office::create([
            "name" => "active",
            "description" => "RegISTratiON is in use.",
            "code" => "ACT",
            "color" => "#FF0000",
            "order" => 1
        ]);
    }
}
