<?php

use Illuminate\Database\Seeder;

class MaternityLeavesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('MaternityLeaves')->delete();
        
        \DB::table('MaternityLeaves')->insert(array (
            0 => 
            array (
                'Id' => 'd75e3f49-95db-4bb8-ae41-2a40b639b048',
                'EmployeeId' => '157d5658-50e3-4cba-8a6c-911aed296575',
                'StartDate' => '2022-04-14',
                'EndDate' => '2022-04-21',
                'CreationTime' => '2022-04-07 07:03:34',
                'LastModificationTime' => '2022-04-07 07:03:34',
                'DeletionTime' => NULL,
            ),
        ));
        
        
    }
}