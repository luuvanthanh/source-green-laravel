<?php

use Illuminate\Database\Seeder;

class EducationalLevelsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('EducationalLevels')->delete();
        
        \DB::table('EducationalLevels')->insert(array (
            0 => 
            array (
                'Id' => '947c6b67-03e4-45f9-9169-2156518097f2',
                'Code' => 'DH',
                'Name' => 'Đại học',
                'CreationTime' => '2022-03-29 03:15:42',
                'LastModificationTime' => '2022-03-29 03:15:42',
                'DeletionTime' => NULL,
            ),
            1 => 
            array (
                'Id' => '39c284d2-37d2-4bd0-afff-d521c4fd0df7',
                'Code' => '12/12',
                'Name' => '12/12',
                'CreationTime' => '2022-03-29 03:15:51',
                'LastModificationTime' => '2022-03-29 03:15:51',
                'DeletionTime' => NULL,
            ),
        ));
        
        
    }
}