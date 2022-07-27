<?php

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
        // $this->call(DegreesTableSeeder::class);
        // $this->call(TrainingMajorsTableSeeder::class);
        // $this->call(TrainingSchoolsTableSeeder::class);
        // $this->call(AbsentTypesTableSeeder::class);
        // $this->call(BranchesTableSeeder::class);
        // $this->call(PositionsTableSeeder::class);
        $this->call(ParameterFormulasTableSeeder::class);
    }
}
