<?php

use Database\Seeders\StatusParentPotentialsTableSeeder;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(CitysTableSeeder::class);
        $this->call(DistrictsTableSeeder::class);
        $this->call(TownWardsTableSeeder::class);
        $this->call(SearchSourcesTableSeeder::class);
        $this->call(CategoryIconsTableSeeder::class);
        $this->call(IconsTableSeeder::class);
        $this->call(StatusParentPotentialsTableSeeder::class);
    }
}
