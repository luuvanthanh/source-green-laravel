<?php

use Illuminate\Database\Seeder;

class FingerprintTimekeepersTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('FingerprintTimekeepers')->delete();
        
        \DB::table('FingerprintTimekeepers')->insert(array (
            0 => 
            array (
                'Id' => 'a6524642-e8cb-4f1e-9ec1-08fd76ea1ec0',
                'Name' => 'test',
                'SerialNumber' => '00000',
                'Ip' => '00000',
                'Port' => 0,
                'Status' => false,
                'CreationTime' => '2022-05-11 09:02:23',
                'LastModificationTime' => '2022-05-11 09:06:50',
                'DeletionTime' => '2022-05-11 09:06:50',
            ),
            1 => 
            array (
                'Id' => '51fcb316-50af-4f2e-b7f7-9d8ac4eac743',
                'Name' => 'test',
                'SerialNumber' => 'ADA',
                'Ip' => 'ÁDAS',
                'Port' => 123123,
                'Status' => false,
                'CreationTime' => '2022-05-11 09:06:47',
                'LastModificationTime' => '2022-05-11 09:12:37',
                'DeletionTime' => '2022-05-11 09:12:37',
            ),
            2 => 
            array (
                'Id' => '81ca455d-0212-4e2a-af02-6a6b28b3fdd9',
                'Name' => 'thành',
                'SerialNumber' => '00000',
                'Ip' => '00000',
                'Port' => 0,
                'Status' => true,
                'CreationTime' => '2022-05-11 09:10:13',
                'LastModificationTime' => '2022-05-12 01:31:03',
                'DeletionTime' => '2022-05-12 01:31:03',
            ),
            3 => 
            array (
                'Id' => '43dd52dc-3559-4f17-8125-c2aa38fa01e9',
                'Name' => 'Máy chấm công',
                'SerialNumber' => '00000',
                'Ip' => '00000',
                'Port' => 8000,
                'Status' => true,
                'CreationTime' => '2022-05-12 01:25:46',
                'LastModificationTime' => '2022-05-12 14:03:13',
                'DeletionTime' => NULL,
            ),
        ));
        
        
    }
}