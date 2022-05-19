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
                'Id' => '6fefc15b-3f4a-4dee-80ac-66cc9c81f86b',
                'Code' => 'LUONG_CB',
                'Name' => 'Lương cơ bản',
                'ApplyDate' => '2021-03-11',
                'ValueDefault' => '4000000',
                'Note' => 'Không',
                'Type' => 'CONTRACT',
                'CreationTime' => '2022-03-30 07:58:10',
                'LastModificationTime' => '2022-03-30 07:58:10',
                'DeletionTime' => NULL,
            ),
        ));
        
        
    }
}