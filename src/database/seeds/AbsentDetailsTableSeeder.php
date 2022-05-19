<?php

use Illuminate\Database\Seeder;

class AbsentDetailsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('AbsentDetails')->delete();
        
        \DB::table('AbsentDetails')->insert(array (
            0 => 
            array (
                'Id' => 'a5869bfa-298b-446c-9a9c-f8bb1a038129',
                'AbsentId' => '10925664-5b4d-47e4-a3bb-a5f75647c991',
                'Date' => '2022-05-11',
                'IsFullDate' => false,
                'ShiftCode' => 'Ca sáng',
                'StartTime' => '00:15:00',
                'EndTime' => '09:30:00',
                'ShiftId' => '8ca2eb1c-f02e-4e4f-b58b-50480aa3e482',
                'CreationTime' => '2022-05-11 02:38:51',
                'LastModificationTime' => '2022-05-11 02:38:51',
                'DeletionTime' => NULL,
            ),
            1 => 
            array (
                'Id' => 'ff77ccb2-139a-463c-9c55-a8ebbb8f151d',
                'AbsentId' => '10925664-5b4d-47e4-a3bb-a5f75647c991',
                'Date' => '2022-05-12',
                'IsFullDate' => true,
                'ShiftCode' => NULL,
                'StartTime' => '00:15:00',
                'EndTime' => '23:00:00',
                'ShiftId' => NULL,
                'CreationTime' => '2022-05-11 02:38:51',
                'LastModificationTime' => '2022-05-11 02:38:51',
                'DeletionTime' => NULL,
            ),
            2 => 
            array (
                'Id' => 'e82e5b48-482c-408a-a8d3-1ef8ba346de7',
                'AbsentId' => 'bdfffd8a-c43e-480d-9296-62ab3b13782f',
                'Date' => '2022-05-13',
                'IsFullDate' => true,
                'ShiftCode' => NULL,
                'StartTime' => '00:15:00',
                'EndTime' => '23:00:00',
                'ShiftId' => NULL,
                'CreationTime' => '2022-05-11 04:17:19',
                'LastModificationTime' => '2022-05-11 04:17:19',
                'DeletionTime' => NULL,
            ),
            3 => 
            array (
                'Id' => '05360542-ecb2-4c42-8513-884ee8dfa12d',
                'AbsentId' => 'bdfffd8a-c43e-480d-9296-62ab3b13782f',
                'Date' => '2022-05-16',
                'IsFullDate' => false,
                'ShiftCode' => 'Ca sáng',
                'StartTime' => '00:15:00',
                'EndTime' => '09:30:00',
                'ShiftId' => '8ca2eb1c-f02e-4e4f-b58b-50480aa3e482',
                'CreationTime' => '2022-05-11 04:17:19',
                'LastModificationTime' => '2022-05-11 04:17:19',
                'DeletionTime' => NULL,
            ),
            4 => 
            array (
                'Id' => '61b8e71e-477f-46b8-8950-1ee08d496cdc',
                'AbsentId' => '20383e13-4a19-41a1-8d63-7b28cb718dc4',
                'Date' => '2022-05-13',
                'IsFullDate' => true,
                'ShiftCode' => NULL,
                'StartTime' => '00:15:00',
                'EndTime' => '23:00:00',
                'ShiftId' => NULL,
                'CreationTime' => '2022-05-12 13:57:53',
                'LastModificationTime' => '2022-05-12 13:57:53',
                'DeletionTime' => NULL,
            ),
        ));
        
        
    }
}