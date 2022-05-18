<?php

use Illuminate\Database\Seeder;

class SchedulesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('Schedules')->delete();
        
        \DB::table('Schedules')->insert(array (
            0 => 
            array (
                'Id' => '3b989709-58d0-4d4b-8c4d-d86dd07a0847',
                'StartDate' => '2022-05-11',
                'EndDate' => '2022-12-31',
                'ShiftId' => '2369f6bd-5a8d-4b7d-9a73-c288ca38bc1f',
                'EmployeeId' => '9b1e5e80-7f00-4478-8ec9-10793ad202a4',
                'CreationTime' => '2022-05-10 07:12:58',
                'LastModificationTime' => '2022-05-10 07:12:58',
                'DeletionTime' => NULL,
            ),
            1 => 
            array (
                'Id' => 'af45b53b-c7d5-4d9b-8848-e4282a4e0756',
                'StartDate' => '2022-05-13',
                'EndDate' => '2022-12-31',
                'ShiftId' => '2369f6bd-5a8d-4b7d-9a73-c288ca38bc1f',
                'EmployeeId' => '21e460f7-351b-4f30-adce-7876cad3c572',
                'CreationTime' => '2022-05-11 07:07:17',
                'LastModificationTime' => '2022-05-11 07:07:17',
                'DeletionTime' => NULL,
            ),
            2 => 
            array (
                'Id' => 'c5f08ab1-11b3-4667-a51d-79f6c8236f68',
                'StartDate' => '2022-05-12',
                'EndDate' => '2022-05-12',
                'ShiftId' => '2369f6bd-5a8d-4b7d-9a73-c288ca38bc1f',
                'EmployeeId' => '21e460f7-351b-4f30-adce-7876cad3c572',
                'CreationTime' => '2022-05-11 07:07:08',
                'LastModificationTime' => '2022-05-11 07:07:17',
                'DeletionTime' => NULL,
            ),
            3 => 
            array (
                'Id' => 'b422112f-6654-48ff-9be5-80c6a1b67ef5',
                'StartDate' => '2022-05-12',
                'EndDate' => '2022-12-31',
                'ShiftId' => 'c0df8690-8686-4aa5-bd6f-f76749a7b4d6',
                'EmployeeId' => '226c70aa-b385-4d21-9f6a-e9f0cd63a4a0',
                'CreationTime' => '2022-05-11 10:31:55',
                'LastModificationTime' => '2022-05-11 10:31:55',
                'DeletionTime' => NULL,
            ),
            4 => 
            array (
                'Id' => 'ff00d435-ca84-4e32-a51b-3135a8d61156',
                'StartDate' => '2022-05-13',
                'EndDate' => '2022-12-31',
                'ShiftId' => '2369f6bd-5a8d-4b7d-9a73-c288ca38bc1f',
                'EmployeeId' => '6846d859-deb4-43dc-9e0d-67a9b9e5a5f6',
                'CreationTime' => '2022-05-12 01:14:45',
                'LastModificationTime' => '2022-05-12 01:14:45',
                'DeletionTime' => NULL,
            ),
            5 => 
            array (
                'Id' => 'c8c87d4e-3f03-42a1-9703-1e276cf5239a',
                'StartDate' => '2022-05-13',
                'EndDate' => '2022-12-31',
                'ShiftId' => 'c0df8690-8686-4aa5-bd6f-f76749a7b4d6',
                'EmployeeId' => 'b205917d-dd2a-41a4-9c4c-d68e6d76552a',
                'CreationTime' => '2022-05-12 01:22:31',
                'LastModificationTime' => '2022-05-12 01:22:31',
                'DeletionTime' => NULL,
            ),
            6 => 
            array (
                'Id' => 'e4eb2bdf-9a30-4bcd-9bfe-4fa4d166d54f',
                'StartDate' => '2022-05-13',
                'EndDate' => '2022-05-13',
                'ShiftId' => '2369f6bd-5a8d-4b7d-9a73-c288ca38bc1f',
                'EmployeeId' => 'fba95caf-5e37-49cc-a5f8-46490e2e00e3',
                'CreationTime' => '2022-05-12 09:18:24',
                'LastModificationTime' => '2022-05-12 09:18:24',
                'DeletionTime' => NULL,
            ),
            7 => 
            array (
                'Id' => '7badb8a8-2e3c-4641-bd37-cec451863153',
                'StartDate' => '2022-05-13',
                'EndDate' => '2022-12-31',
                'ShiftId' => 'a5a5fbaa-79c3-443c-aaeb-b96662f8c958',
                'EmployeeId' => '46e8a4af-3fd3-4904-a04f-219859aa20e1',
                'CreationTime' => '2022-05-12 13:36:43',
                'LastModificationTime' => '2022-05-12 13:36:43',
                'DeletionTime' => NULL,
            ),
        ));
        
        
    }
}