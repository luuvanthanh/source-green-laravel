<?php

use Illuminate\Database\Seeder;

class BlocksTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('Blocks')->delete();
        
        \DB::table('Blocks')->insert(array (
            0 => 
            array (
                'Id' => '56e08ee8-95aa-499e-a2c1-0de4b01c2a2f',
                'Code' => 'K6',
                'Name' => 'KHỐI 6',
                'Note' => 'KHỐI 6',
                'CreationTime' => '2022-03-29 02:44:47',
                'LastModificationTime' => '2022-03-29 02:44:47',
                'DeletionTime' => NULL,
            ),
            1 => 
            array (
                'Id' => 'e369f298-9386-4eef-bf71-531b5687cdc6',
                'Code' => 'K7',
                'Name' => 'KHỐI 7',
                'Note' => 'KHỐI 7',
                'CreationTime' => '2022-03-29 02:45:05',
                'LastModificationTime' => '2022-03-29 02:45:05',
                'DeletionTime' => NULL,
            ),
            2 => 
            array (
                'Id' => '469b8bc4-4aa1-42e9-a43f-a59544462e8b',
                'Code' => 'K10',
                'Name' => 'KHỐI 10',
                'Note' => 'KHỐI 10',
                'CreationTime' => '2022-03-29 02:45:18',
                'LastModificationTime' => '2022-03-29 02:45:18',
                'DeletionTime' => NULL,
            ),
            3 => 
            array (
                'Id' => '85fcc837-7fbc-4369-911e-7ac07270c5c5',
                'Code' => 'K11',
                'Name' => 'KHỐI 11',
                'Note' => 'KHỐI 11',
                'CreationTime' => '2022-03-29 02:45:35',
                'LastModificationTime' => '2022-03-29 02:45:35',
                'DeletionTime' => NULL,
            ),
        ));
        
        
    }
}