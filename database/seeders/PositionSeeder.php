<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PositionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonPath = database_path('seeders/data/positions-export.json');

        if (!File::exists($jsonPath)) {
            Log::error("File not found: $jsonPath");
            return;
        }

        $json = File::get($jsonPath);
        $data = json_decode($json, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            Log::error("Error decoding JSON: " . json_last_error_msg());
            return;
        }

        $apiUrl = 'http://127.0.0.1:8000/api/v1/positions';
        // dd($data, $apiUrl);
        foreach ($data as $position) {
            // var_dump ($position['NAME'], $position['DESCRIPTION']);
            try {
                $response = Http::withHeaders([
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                    'Authorization' => 'Bearer 84|cVw5FrCHsz5aoprS9yFiDtDuGHBxJM3s9s3pFAFE2ceb6b40'

                ])->post($apiUrl, [
                    'name' => strtoupper(trim($position['NAME'])),
                    'description' => strtoupper(trim($position['DESCRIPTION']))
                ]);

                if ($response->failed()) {
                    $statusCode = $response->status();
                    Log::error("Failed to register position (HTTP $statusCode): " . $response->body());
                } else {
                    Log::info("Successfully registered position: " . $position['NAME']);
                }
            } catch (\Exception $e) {
                Log::error("An error occurred: " . $e->getMessage());
            }
        }
    }
}
