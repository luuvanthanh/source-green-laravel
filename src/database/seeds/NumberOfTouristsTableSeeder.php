<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class NumberOfTouristsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('number_of_tourists')->delete();
        
        \DB::table('number_of_tourists')->insert(array (
            0 => 
            array (
                'id' => 'd09177e9-c738-41e8-b736-8374f5f3c46b',
                'camera_id' => '55ef5ba5-b5a7-482b-a513-85594ff99266',
                'tourist_destination_id' => '55ef5ba5-b5a7-482b-a513-85594ff99266',
                'time' => '2021-12-01 08:00:00',
                'number_of_guest' => 10,
                'created_at' => '2021-12-01 13:10:21',
                'updated_at' => '2021-12-01 13:10:21',
            ),
            1 => 
            array (
                'id' => 'b59a75ae-5e1f-4946-ad11-0387f2e5e020',
                'camera_id' => '55ef5ba5-b5a7-482b-a513-85594ff99266',
                'tourist_destination_id' => '55ef5ba5-b5a7-482b-a513-85594ff99266',
                'time' => '2021-12-01 10:00:00',
                'number_of_guest' => 10,
                'created_at' => '2021-12-01 13:14:53',
                'updated_at' => '2021-12-01 13:14:53',
            ),
            2 => 
            array (
                'id' => '83ff3b08-c242-4de1-83ed-e3a84ac18bc0',
                'camera_id' => '55ef5ba5-b5a7-482b-a513-85594ff99266',
                'tourist_destination_id' => '55ef5ba5-b5a7-482b-a513-85594ff99266',
                'time' => '2021-12-01 11:00:00',
                'number_of_guest' => 10,
                'created_at' => '2021-12-01 13:14:57',
                'updated_at' => '2021-12-01 13:14:57',
            ),
            3 => 
            array (
                'id' => '4d5fe42f-2680-4932-954e-e5b4ab37a1d5',
                'camera_id' => '55ef5ba5-b5a7-482b-a513-85594ff99266',
                'tourist_destination_id' => '55ef5ba5-b5a7-482b-a513-85594ff99266',
                'time' => '2021-12-01 12:00:00',
                'number_of_guest' => 10,
                'created_at' => '2021-12-01 13:15:01',
                'updated_at' => '2021-12-01 13:15:01',
            ),
            4 => 
            array (
                'id' => '7b3b0cac-7434-41cd-a5dc-129c9fad7d0c',
                'camera_id' => '55ef5ba5-b5a7-482b-a513-85594ff99266',
                'tourist_destination_id' => '55ef5ba5-b5a7-482b-a513-85594ff99266',
                'time' => '2021-12-01 13:00:00',
                'number_of_guest' => 10,
                'created_at' => '2021-12-01 13:15:04',
                'updated_at' => '2021-12-01 13:15:04',
            ),
            5 => 
            array (
                'id' => 'd1d0e0ee-50c7-43bc-9706-784de61b23e6',
                'camera_id' => '55ef5ba5-b5a7-482b-a513-85594ff99266',
                'tourist_destination_id' => '55ef5ba5-b5a7-482b-a513-85594ff99266',
                'time' => '2021-12-01 08:10:00',
                'number_of_guest' => 10,
                'created_at' => '2021-12-01 14:53:27',
                'updated_at' => '2021-12-01 14:53:27',
            ),
            6 => 
            array (
                'id' => '2d15e744-7fdd-4d73-9cbb-212d7e2953ce',
                'camera_id' => '55ef5ba5-b5a7-482b-a513-85594ff99266',
                'tourist_destination_id' => '55ef5ba5-b5a7-482b-a513-85594ff99266',
                'time' => '2021-12-01 08:20:00',
                'number_of_guest' => 10,
                'created_at' => '2021-12-01 14:53:33',
                'updated_at' => '2021-12-01 14:53:33',
            ),
            7 => 
            array (
                'id' => 'e253e48c-5cbf-42d4-9fdf-58939a15f342',
                'camera_id' => '55ef5ba5-b5a7-482b-a513-85594ff99266',
                'tourist_destination_id' => '55ef5ba5-b5a7-482b-a513-85594ff99266',
                'time' => '2021-12-01 08:30:00',
                'number_of_guest' => 10,
                'created_at' => '2021-12-01 14:53:36',
                'updated_at' => '2021-12-01 14:53:36',
            ),
            8 => 
            array (
                'id' => '4508951e-3aa8-4406-860c-746e436b1db3',
                'camera_id' => '55ef5ba5-b5a7-482b-a513-85594ff99266',
                'tourist_destination_id' => '55ef5ba5-b5a7-482b-a513-85594ff99266',
                'time' => '2021-12-03 08:30:00',
                'number_of_guest' => 10,
                'created_at' => '2021-12-01 15:03:40',
                'updated_at' => '2021-12-01 15:03:40',
            ),
            9 => 
            array (
                'id' => '9c82729b-2971-4e78-9054-19f6125af66c',
                'camera_id' => '55ef5ba5-b5a7-482b-a513-85594ff99266',
                'tourist_destination_id' => 'cf25bd07-e1ca-4fa6-8250-145bf0bfb4c3',
                'time' => '2021-12-01 08:30:00',
                'number_of_guest' => 10,
                'created_at' => '2021-12-01 15:04:40',
                'updated_at' => '2021-12-01 15:04:40',
            ),
            10 => 
            array (
                'id' => '4201e27c-fff9-473f-bd50-ce10f8cb3f27',
                'camera_id' => '55ef5ba5-b5a7-482b-a513-85594ff99266',
                'tourist_destination_id' => 'cf25bd07-e1ca-4fa6-8250-145bf0bfb4c3',
                'time' => '2021-12-03 08:30:00',
                'number_of_guest' => 10,
                'created_at' => '2021-12-01 15:04:45',
                'updated_at' => '2021-12-01 15:04:45',
            ),
        ));
        
        
    }
}