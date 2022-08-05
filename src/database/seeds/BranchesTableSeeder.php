<?php

use Illuminate\Database\Seeder;

class BranchesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('Branches')->delete();
        
        \DB::table('Branches')->insert(array (
            0 => 
            array (
                'Id' => '8e24619d-4e01-4714-b62f-c341b22af022',
                'Code' => 'code2',
                'Name' => 'cơ sở 2',
                'Address' => 'đà nẵng',
                'BranchIdCrm' => NULL,
                'CreationTime' => '2022-03-21 02:05:11',
                'LastModificationTime' => '2022-03-21 02:05:25',
                'DeletionTime' => '2022-03-21 02:05:25',
            ),
            1 => 
            array (
                'Id' => 'fb103c94-59f8-41a3-b11a-6cb57d221e01',
                'Code' => 'Cơ sở 01',
                'Name' => 'Trường Trần Đại Nghĩa',
                'Address' => 'Cơ sở 01',
                'BranchIdCrm' => NULL,
                'CreationTime' => '2022-03-22 06:42:18',
                'LastModificationTime' => '2022-03-28 09:08:06',
                'DeletionTime' => NULL,
            ),
            2 => 
            array (
                'Id' => 'd61fbd0c-7b7d-4c91-baa2-9f0d64429d32',
                'Code' => 'Q7',
                'Name' => 'Cơ sở quận 7',
                'Address' => 'Quận 7 - Thành phố Hồ Chí Minh',
                'BranchIdCrm' => NULL,
                'CreationTime' => '2022-04-08 02:19:19',
                'LastModificationTime' => '2022-04-08 02:19:19',
                'DeletionTime' => NULL,
            ),
        ));
        
        
    }
}