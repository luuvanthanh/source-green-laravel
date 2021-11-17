<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use Faker\Generator as Faker;
use GGPHP\Users\Models\User;
use Illuminate\Support\Str;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/

$factory->define(User::class, function (Faker $faker) {
    return [
        'id' => Str::uuid(),
        'full_name' => $faker->name,
        'email' => $faker->unique()->safeEmail,
        'email_verified_at' => null,
        'password' => '$2y$10$AOlcwnrf5b/m6ynqcSZ.gOGfauVLw3Cwm1W9gGhwQ20/wHgB7KGpG',
        'remember_token' => null,
        'created_at' => '2021-11-17 13:59:37',
        'updated_at' => '2021-11-17 10:45:16',
        'status' => 0,
    ];
});
