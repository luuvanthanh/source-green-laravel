<?php

use Illuminate\Database\Seeder;

class TypeOfContractParameterFormulaTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('TypeOfContractParameterFormula')->delete();
        
        \DB::table('TypeOfContractParameterFormula')->insert(array (
            0 => 
            array (
                'TypeOfContractId' => '40e36b39-cbbc-48fd-9123-3db6365dc6b2',
                'ParameterFormulaId' => 'fe1cc806-b704-404d-b2af-97cd0bf0cf7e',
            ),
            1 => 
            array (
                'TypeOfContractId' => '5c864427-ec29-4562-aed6-048d68ac28da',
                'ParameterFormulaId' => 'fe1cc806-b704-404d-b2af-97cd0bf0cf7e',
            ),
        ));
        
        
    }
}