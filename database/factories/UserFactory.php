<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Facade;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $gender = fake()->randomElement([1, 2]);
        return [
            'first_name' => $gender === 1 ? fake('es_ES')->firstName('male') : fake('es_ES')->firstName('female'),
            'last_name' => fake('es_ES')->lastName(),
            'phone_number' => fake()->regexify('/^(6|7)[0-9]{7}$/'),
            'username' => fake('es_ES')->unique()->userName(),
            // 'password' => static::$password ??= Hash::make('password'),
            
            'email' => fake('es_ES')->unique()->safeEmail(),
            // 'email_verified_at' => now(),
            'office_id' => 126,
            'state_id' => fake()->randomElement([2, 1])
            // 'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
