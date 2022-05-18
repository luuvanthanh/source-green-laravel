<?php

use Illuminate\Database\Seeder;

class TrainingMajorsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('TrainingMajors')->delete();
        
        \DB::table('TrainingMajors')->insert(array (
            0 => 
            array (
                'Id' => '610e7e68-ae32-4b44-98b0-d7bc92dd1c98',
                'Code' => 'TA',
                'Name' => 'Tiếng Anh sư phạm',
                'CreationTime' => '2022-03-23 03:36:36',
                'LastModificationTime' => '2022-03-29 03:04:05',
                'DeletionTime' => NULL,
            ),
            1 => 
            array (
                'Id' => '69b15ee6-9c3d-4453-b860-aeb176c1ba1a',
                'Code' => 'NV',
                'Name' => 'Ngữ Văn',
                'CreationTime' => '2022-03-29 03:04:17',
                'LastModificationTime' => '2022-03-29 03:04:17',
                'DeletionTime' => NULL,
            ),
            2 => 
            array (
                'Id' => '803de363-4368-43c9-8e08-322c147dda4b',
                'Code' => 'CNTT',
                'Name' => 'Công nghệ thông tin',
                'CreationTime' => '2022-03-29 03:04:29',
                'LastModificationTime' => '2022-03-29 03:04:29',
                'DeletionTime' => NULL,
            ),
            3 => 
            array (
                'Id' => '41026444-1d76-48ff-a1dc-6c2e6ba6d459',
                'Code' => 'MT',
                'Name' => 'Mỹ Thuật',
                'CreationTime' => '2022-03-29 03:05:18',
                'LastModificationTime' => '2022-03-29 03:05:18',
                'DeletionTime' => NULL,
            ),
        ));
        
        
    }
}