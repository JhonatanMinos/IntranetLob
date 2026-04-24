<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Notification>
 */
class NotificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title'        => $this->faker->sentence(),
            'subject'      => $this->faker->words(3, true),
            'content'      => $this->faker->paragraph(),
            'priority'     => \App\Models\Notification::PRIORITY_NORMAL,
            'type'         => \App\Models\Notification::TYPE_AVISO,
            'created_by'   => \App\Models\User::factory(), // Genera un usuario automáticamente
            'published_at' => null,
        ];
    }
}
