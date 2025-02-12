<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OfficeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonPath = database_path('seeders/data/offices-export.json');

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

        $apiUrl = 'http://127.0.0.1:8000/api/v1/offices';
        // dd($data, $apiUrl);
        foreach ($data as $office) {
            try {
                $parent = isset($office['parent']) ? $office['parent'] : null;
                $response = Http::withHeaders([
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                    'Authorization' => 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAiLCJpYXQiOjE3Mzg5MzM5MzUsImV4cCI6MTczODkzNDIzNSwibmJmIjoxNzM4OTMzOTM1LCJqdGkiOiI2N2E2MDZhZjQyMzc0Iiwic3ViIjoiYXBpLWNsaWVudCJ9.YemfVuL_AhJlbIwQa46EKj34qr5_y1ORuI4pR1yfdvk'

                ])->post($apiUrl, [
                    'name' => strtoupper(trim($office['name'])),
                    'initials' => strtoupper(trim($office['initials'])),
                    'status' => $office['status'],
                    'parent' => $parent,
                    'level' => $office['level'],
                ]);

                if ($response->failed()) {
                    $statusCode = $response->status();
                    Log::error("Failed to register office (HTTP $statusCode): " . $response->body());
                } else {
                    Log::info("Successfully registered office: " . $office['name']);
                }
            } catch (\Exception $e) {
                Log::error("An error occurred: " . $e->getMessage());
            }
        }
    }
}
