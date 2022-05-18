<?php

use Illuminate\Database\Seeder;

class TypeOfContractParameterValueTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('TypeOfContractParameterValue')->delete();
        
        \DB::table('TypeOfContractParameterValue')->insert(array (
            0 => 
            array (
                'TypeOfContractId' => '35c5dd23-8385-4cf0-a960-e3ba835fe9ac',
                'ParameterValueId' => '6fefc15b-3f4a-4dee-80ac-66cc9c81f86b',
            ),
        ));
        
        
    }
}