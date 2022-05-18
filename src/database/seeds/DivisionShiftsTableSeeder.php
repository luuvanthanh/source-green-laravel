<?php

use Illuminate\Database\Seeder;

class DivisionShiftsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('DivisionShifts')->delete();
        
        \DB::table('DivisionShifts')->insert(array (
            0 => 
            array (
                'Id' => '746a222c-78d1-48f4-b408-f5a2e2fc0f53',
                'EmployeeCreateId' => '13d5fddd-ec5e-43d3-bdff-700da7639603',
                'DivisionId' => '17e25906-81e9-43b0-ab97-9ebb78502c4e',
                'ShiftId' => '2369f6bd-5a8d-4b7d-9a73-c288ca38bc1f',
                'StartDate' => '2022-04-15',
                'EndDate' => '2022-04-29',
                'CreationTime' => '2022-04-29 06:37:13',
                'LastModificationTime' => '2022-04-29 06:37:13',
                'DeletionTime' => NULL,
            ),
            1 => 
            array (
                'Id' => 'b0648d2e-ca7a-4b21-8b8b-aa8af40e017d',
                'EmployeeCreateId' => '13d5fddd-ec5e-43d3-bdff-700da7639603',
                'DivisionId' => '1b014f07-cda8-40f9-bb67-64b013317501',
                'ShiftId' => '2369f6bd-5a8d-4b7d-9a73-c288ca38bc1f',
                'StartDate' => '2022-04-13',
                'EndDate' => '2022-04-30',
                'CreationTime' => '2022-04-29 07:24:34',
                'LastModificationTime' => '2022-04-29 07:24:34',
                'DeletionTime' => NULL,
            ),
        ));
        
        
    }
}