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
                'Id' => '9315c5c0-9786-4f81-85e1-da3e1393e7d0',
                'Code' => '12/12',
                'Name' => '12/12',
                'CreationTime' => '2021-04-19 08:46:40',
                'LastModificationTime' => '2021-04-19 08:46:40',
            ),
            1 => 
            array (
                'Id' => 'ac3419ca-8f1b-435a-b740-a01b2c60859d',
                'Code' => 'ĐH',
                'Name' => 'Đại học',
                'CreationTime' => '2021-04-19 08:46:57',
                'LastModificationTime' => '2021-04-19 08:46:57',
            ),
        ));
        
        
    }
}