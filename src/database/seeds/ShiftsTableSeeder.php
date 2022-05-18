
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
                'Id' => '6063893f-2735-46f3-a6ac-caf06f5545ea',
                'ShiftCode' => '001',
                'Description' => '1233',
                'Status' => 'ON',
                'Name' => 'test 02',
                'CreationTime' => '2022-04-29 03:07:41',
                'LastModificationTime' => '2022-04-29 03:07:51',
                'DeletionTime' => '2022-04-29 03:07:51',
            ),
            1 => 
            array (
                'Id' => 'e9a69785-0aea-436a-b6a7-45e984d7ee98',
                'ShiftCode' => '000',
                'Description' => '123',
                'Status' => 'OFF',
                'Name' => 'test',
                'CreationTime' => '2022-04-29 03:06:38',
                'LastModificationTime' => '2022-04-29 03:31:31',
                'DeletionTime' => '2022-04-29 03:31:31',
            ),
            2 => 
            array (
                'Id' => '03cc51e4-31a9-472f-8816-a172e3ee006f',
                'ShiftCode' => '001',
                'Description' => 'gg',
                'Status' => 'ON',
                'Name' => 'ok',
                'CreationTime' => '2022-04-29 03:29:12',
                'LastModificationTime' => '2022-04-29 03:32:48',
                'DeletionTime' => '2022-04-29 03:32:48',
            ),
            3 => 
            array (
                'Id' => 'e67e560f-caff-40eb-952e-ae833b535440',
                'ShiftCode' => '002',
                'Description' => 'q',
                'Status' => 'ON',
                'Name' => 'test',
                'CreationTime' => '2022-04-29 03:32:42',
                'LastModificationTime' => '2022-04-29 04:24:04',
                'DeletionTime' => '2022-04-29 04:24:04',
            ),
            4 => 
            array (
                'Id' => '2369f6bd-5a8d-4b7d-9a73-c288ca38bc1f',
                'ShiftCode' => '0000',
                'Description' => 'ádasdasd',
                'Status' => 'ON',
                'Name' => '0000',
                'CreationTime' => '2022-04-29 04:23:49',
                'LastModificationTime' => '2022-04-29 04:32:22',
                'DeletionTime' => NULL,
            ),
            5 => 
            array (
                'Id' => 'c0df8690-8686-4aa5-bd6f-f76749a7b4d6',
                'ShiftCode' => '000s',
                'Description' => 'ád',
                'Status' => 'ON',
                'Name' => 'test',
                'CreationTime' => '2022-04-29 04:05:19',
                'LastModificationTime' => '2022-04-29 08:25:46',
                'DeletionTime' => NULL,
            ),
            6 => 
            array (
                'Id' => 'a5a5fbaa-79c3-443c-aaeb-b96662f8c958',
                'ShiftCode' => 'CA001',
                'Description' => NULL,
                'Status' => 'ON',
                'Name' => 'Ca hành chính',
                'CreationTime' => '2022-05-12 13:35:51',
                'LastModificationTime' => '2022-05-12 13:35:51',
                'DeletionTime' => NULL,
            ),
        ));
        
        
    }
}