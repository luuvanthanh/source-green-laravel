<?php

use Illuminate\Database\Seeder;

class HolidayDetailsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('HolidayDetails')->delete();
        
        \DB::table('HolidayDetails')->insert(array (
            0 => 
            array (
                'Id' => 'bc4a13d3-1281-42cd-a091-c195507e0308',
                'Name' => 'test',
                'HolidayId' => 'fb6ee68f-a7e5-4496-acd0-3767a1eeca59',
                'StartDate' => '2020-10-16',
                'EndDate' => '2020-11-22',
                'CreationTime' => '2022-04-29 07:37:28',
                'LastModificationTime' => '2022-04-29 07:41:26',
                'DeletionTime' => '2022-04-29 07:41:26',
            ),
            1 => 
            array (
                'Id' => '3d455109-983f-4df2-afa9-ef4d8c197d51',
                'Name' => 'test',
                'HolidayId' => 'fb6ee68f-a7e5-4496-acd0-3767a1eeca59',
                'StartDate' => '2022-04-07',
                'EndDate' => '2022-04-30',
                'CreationTime' => '2022-04-29 08:34:21',
                'LastModificationTime' => '2022-04-29 08:34:21',
                'DeletionTime' => NULL,
            ),
            2 => 
            array (
                'Id' => 'e76cbbdd-0298-49ad-90e3-a00eee165985',
                'Name' => 'test',
                'HolidayId' => 'de0a1c1a-d838-4f67-8948-5fae9640d42a',
                'StartDate' => '2022-04-14',
                'EndDate' => '2022-12-31',
                'CreationTime' => '2022-04-29 08:15:27',
                'LastModificationTime' => '2022-05-10 07:11:30',
                'DeletionTime' => '2022-05-10 07:11:30',
            ),
            3 => 
            array (
                'Id' => '31e6af4c-0215-4560-ae35-ec444c8055b9',
                'Name' => 'good',
                'HolidayId' => 'de0a1c1a-d838-4f67-8948-5fae9640d42a',
                'StartDate' => '2022-04-22',
                'EndDate' => '2022-04-29',
                'CreationTime' => '2022-04-29 08:26:01',
                'LastModificationTime' => '2022-05-10 07:11:31',
                'DeletionTime' => '2022-05-10 07:11:31',
            ),
            4 => 
            array (
                'Id' => '4df77779-752e-4084-9b54-ae8f06ede801',
                'Name' => 'Quốc Tế Thiếu Nhi',
                'HolidayId' => 'de0a1c1a-d838-4f67-8948-5fae9640d42a',
                'StartDate' => '2022-05-31',
                'EndDate' => '2022-04-30',
                'CreationTime' => '2022-04-29 07:56:26',
                'LastModificationTime' => '2022-05-10 07:12:23',
                'DeletionTime' => '2022-05-10 07:12:23',
            ),
            5 => 
            array (
                'Id' => '01bf9066-ab08-4ae0-bb27-69c814aa868f',
                'Name' => 'Quốc khánh',
                'HolidayId' => 'de0a1c1a-d838-4f67-8948-5fae9640d42a',
                'StartDate' => '2022-04-30',
                'EndDate' => '2022-05-01',
                'CreationTime' => '2022-05-11 07:55:13',
                'LastModificationTime' => '2022-05-11 07:55:13',
                'DeletionTime' => NULL,
            ),
            6 => 
            array (
                'Id' => '1a321671-dff6-4a0f-8759-b4e03584e1e0',
                'Name' => 'test',
                'HolidayId' => 'de0a1c1a-d838-4f67-8948-5fae9640d42a',
                'StartDate' => '2022-05-31',
                'EndDate' => '2022-06-02',
                'CreationTime' => '2022-05-10 07:12:38',
                'LastModificationTime' => '2022-05-12 13:42:01',
                'DeletionTime' => '2022-05-12 13:42:01',
            ),
        ));
        
        
    }
}