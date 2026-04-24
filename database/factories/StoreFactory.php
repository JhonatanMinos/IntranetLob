<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Store>
 */
class StoreFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name'         => fake()->company() . ' Store',
            'code'         => fake()->unique()->bothify('####'),
            'brand_id'     => \App\Models\Brand::factory(), // Crea la marca automáticamente
            'type'         => fake()->randomElement(['Sucursal', 'Bodega', 'Oficina']),
            'address'      => fake()->streetAddress(),
            'neighborhood' => fake()->cityPrefix(), // O use 'suburb' si está disponible
            'city'         => fake()->city(),
            'postal_code'  => fake()->postcode(),
            'state'        => fake()->state(),
            'phone'        => fake()->phoneNumber(),
            'email'        => fake()->unique()->safeEmail(),
            'lat'          => fake()->latitude(),
            'lng'          => fake()->longitude(),
        ];
    }
}
