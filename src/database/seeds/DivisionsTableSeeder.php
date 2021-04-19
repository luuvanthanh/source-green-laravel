<?php

use Illuminate\Database\Seeder;

class DivisionsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('Divisions')->delete();
        
        \DB::table('Divisions')->insert(array (
            0 => 
            array (
                'Id' => 'd5e67ce9-955c-4e6a-98d7-efb3e6bb6a3a',
                'Code' => 'DH',
                'Name' => 'Dạy học',
                'CreationTime' => '2021-04-19 08:43:33',
                'LastModificationTime' => '2021-04-19 08:43:33',
            ),
            1 => 
            array (
                'Id' => 'eac09d57-080e-4bc7-b892-9e2084cd27e7',
                'Code' => 'KT',
                'Name' => 'Kế toán',
                'CreationTime' => '2021-04-19 08:43:44',
                'LastModificationTime' => '2021-04-19 08:43:44',
            ),
        ));
        
        
    }
}