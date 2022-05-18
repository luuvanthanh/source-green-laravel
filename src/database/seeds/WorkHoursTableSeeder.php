<?php

use Illuminate\Database\Seeder;

class WorkHoursTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('WorkHours')->delete();
        
        \DB::table('WorkHours')->insert(array (
            0 => 
            array (
                'Id' => '2c44a90a-400f-4011-9cca-46f700bc814c',
                'EmployeeId' => '21e460f7-351b-4f30-adce-7876cad3c572',
                'Date' => '2022-05-12',
                'Hours' => '[{"in":"2022-05-11T13:00:00.000Z","out":"2022-05-11T16:15:00.000Z"}]',
                'Reason' => '123123',
                'AbsentTypeId' => '5010e623-7e74-4600-9c07-32420914384a',
                'CreationTime' => '2022-05-11 03:18:25',
                'LastModificationTime' => '2022-05-11 03:38:36',
                'DeletionTime' => '2022-05-11 03:38:36',
            ),
            1 => 
            array (
                'Id' => '7baaa6fc-5bc4-40d0-810e-8da5ce8e23b9',
                'EmployeeId' => '226c70aa-b385-4d21-9f6a-e9f0cd63a4a0',
                'Date' => '2022-05-12',
                'Hours' => '[{"in":"2022-05-10T21:45:00.981Z","out":"2022-05-10T22:30:00.557Z"}]',
                'Reason' => 'sdfsdf',
                'AbsentTypeId' => '5010e623-7e74-4600-9c07-32420914384a',
                'CreationTime' => '2022-05-11 03:38:52',
                'LastModificationTime' => '2022-05-11 03:38:52',
                'DeletionTime' => NULL,
            ),
        ));
        
        
    }
}