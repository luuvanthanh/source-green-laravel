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
                'Id' => 'd64f2741-b904-4f7f-bf6a-a8e4fa42d27d',
                'Code' => 'CNTT',
                'Name' => 'Công nhệ thông tin',
                'CreationTime' => '2021-04-19 08:48:31',
                'LastModificationTime' => '2021-04-19 08:48:31',
            ),
            1 => 
            array (
                'Id' => 'c318963f-82f3-4e97-84b9-27a60071660a',
                'Code' => 'TEST',
                'Name' => 'Test',
                'CreationTime' => '2021-04-19 08:48:54',
                'LastModificationTime' => '2021-04-19 08:48:54',
            ),
        ));
        
        
    }
}