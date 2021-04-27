<?php

use Illuminate\Database\Seeder;

class ParameterValuesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('ParameterValues')->delete();
        
        \DB::table('ParameterValues')->insert(array (
            0 => 
            array (
                'Id' => '11a9dafc-320d-463a-a4e0-24fcb9de2e73',
                'Code' => 'LUONG',
                'Name' => 'Lương',
                'ApplyDate' => '2021-04-12',
                'ValueDefault' => '100000',
                'Note' => '100000',
                'Type' => 'HD',
                'CreationTime' => '2021-04-19 08:45:02',
                'LastModificationTime' => '2021-04-19 08:45:02',
            ),
            1 => 
            array (
                'Id' => '17d8c9cf-49a2-4813-bafc-228a56dc4105',
                'Code' => 'BHXH',
                'Name' => 'Bảo hiểm xã hội',
                'ApplyDate' => '2021-04-12',
                'ValueDefault' => '10',
                'Note' => 'asdsds',
                'Type' => 'HD',
                'CreationTime' => '2021-04-19 08:45:29',
                'LastModificationTime' => '2021-04-19 08:45:29',
            ),
        ));
        
        
    }
}