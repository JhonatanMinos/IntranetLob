<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('now', '+1 month');

        return [
            'title'      => $this->faker->sentence(3),
            'type'       => $this->faker->randomElement([
                \App\Models\Event::TYPE_CUMPLE,
                \App\Models\Event::TYPE_FESTIVO,
                \App\Models\Event::TYPE_CAMPANIA,
                \App\Models\Event::TYPE_LANZAMIENTO,
                \App\Models\Event::TYPE_EVENT,
            ]),
            'start_date' => $startDate,
            'end_date'   => $this->faker->dateTimeBetween($startDate, $startDate->format('Y-m-d H:i:s') . ' +2 days'),
            'all_day'    => $this->faker->boolean(20),
        ];
    }
}
