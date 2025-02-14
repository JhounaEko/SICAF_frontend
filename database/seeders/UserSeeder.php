<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

use function Pest\Laravel\withHeaders;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = User::factory(30)->make()->toArray();
        $apiUrl = 'http://127.0.0.1:8000/api/v1/users';
        foreach ($data as $user) {
            try {
                $response = Http::withHeaders([
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ])->post($apiUrl, [
                    'first_name' => $user['first_name'],
                    'last_name' => $user['last_name'],
                    'phone_number' => $user['phone_number'],
                    'username' => $user['username'],
                    'password' => "Danger3@",
                    'password_confirmation' => "Danger3@",

                    'email' => $user['email'],
                    'office_id' => $user['office_id'],
                    'state_id' => $user['state_id'],

                ]);
                if ($response->failed()) {
                    $statusCode = $response->status();
                    Log::error("Failed to register position (HTTP $statusCode): " . $response->body());
                } else {
                    Log::info("Successfully registered position: " . $user['first_name']. " ". $user['last_name']);
                }
            } catch (\Exception $e) {
                Log::error("An error occurred: " . $e->getMessage());
            }
        }

    }
}
