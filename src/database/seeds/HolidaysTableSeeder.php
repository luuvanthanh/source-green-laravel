<?php

use Illuminate\Database\Seeder;

class HolidaysTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('Holidays')->delete();
        
        \DB::table('Holidays')->insert(array (
            0 => 
            array (
                'Id' => 'fb6ee68f-a7e5-4496-acd0-3767a1eeca59',
                'Name' => '2020',
                'CreationTime' => '2022-04-29 07:37:27',
                'LastModificationTime' => '2022-04-29 07:37:27',
                'DeletionTime' => NULL,
            ),
            1 => 
            array (
                'Id' => 'de0a1c1a-d838-4f67-8948-5fae9640d42a',
                'Name' => '2022',
                'CreationTime' => '2022-04-29 07:41:26',
                'LastModificationTime' => '2022-04-29 07:41:26',
                'DeletionTime' => NULL,
            ),
        ));
        
        
    }
}