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
        $this->call(BranchesTableSeeder::class);
        $this->call(DegreesTableSeeder::class);
        $this->call(DivisionsTableSeeder::class);
        $this->call(EducationalLevelsTableSeeder::class);
        $this->call(ParameterFormulasTableSeeder::class);
        $this->call(ParameterValuesTableSeeder::class);
        $this->call(PositionsTableSeeder::class);
        $this->call(TrainingMajorsTableSeeder::class);
        $this->call(TrainingSchoolsTableSeeder::class);
        $this->call(TypeOfContractsTableSeeder::class);
        $this->call(LateEarlyTimeConfigsTableSeeder::class);
        $this->call(ShiftsTableSeeder::class);
        $this->call(ShiftDetailsTableSeeder::class);
        $this->call(ConfigsTableSeeder::class);
        $this->call(TypeOfContractParameterValueTableSeeder::class);
        $this->call(TypeOfContractParameterFormulaTableSeeder::class);
        $this->call(AbsentTypesTableSeeder::class);
    }
}
