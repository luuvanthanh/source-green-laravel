<?php

use Illuminate\Database\Seeder;

class ParameterFormulasTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('ParameterFormulas')->delete();
        
        \DB::table('ParameterFormulas')->insert(array (
            0 => 
            array (
                'Id' => 'fe1cc806-b704-404d-b2af-97cd0bf0cf7e',
                'Code' => 'CT1',
                'Name' => 'Công thức 1',
                'ApplyDate' => '2021-07-01',
                'Recipe' => 'HD',
                'CreationTime' => '2021-04-19 08:46:07',
                'LastModificationTime' => '2021-04-19 08:46:07',
            ),
        ));
        
        
    }
}