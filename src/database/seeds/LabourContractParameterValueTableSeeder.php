<?php

use Illuminate\Database\Seeder;

class LabourContractParameterValueTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('LabourContractParameterValue')->delete();
        
        \DB::table('LabourContractParameterValue')->insert(array (
            0 => 
            array (
                'Value' => '4000000',
                'LabourContractId' => '1f43ada7-1f5f-4f34-80cb-3e1b382878c5',
                'ParameterValueId' => '6fefc15b-3f4a-4dee-80ac-66cc9c81f86b',
            ),
        ));
        
        
    }
}