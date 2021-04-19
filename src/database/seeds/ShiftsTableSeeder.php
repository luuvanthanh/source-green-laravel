<?php

use Illuminate\Database\Seeder;

class ShiftsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('Shifts')->delete();
        
        \DB::table('Shifts')->insert(array (
            0 => 
            array (
                'Id' => '9d31a263-98b0-463d-b931-8fd8a5d2e695',
                'ShiftCode' => 'C-A1',
                'Description' => 'ca sáng',
                'Status' => 'ON',
                'CreationTime' => '2021-04-19 08:51:22',
                'LastModificationTime' => '2021-04-19 08:51:22',
            ),
            1 => 
            array (
                'Id' => 'e32735b6-a383-40dd-93df-843b0fe49d09',
                'ShiftCode' => 'C-A2',
                'Description' => 'ca chiều',
                'Status' => 'ON',
                'CreationTime' => '2021-04-19 08:51:40',
                'LastModificationTime' => '2021-04-19 08:51:40',
            ),
        ));
        
        
    }
}