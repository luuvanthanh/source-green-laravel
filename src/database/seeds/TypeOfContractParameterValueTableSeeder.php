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
                'TypeOfContractId' => '40e36b39-cbbc-48fd-9123-3db6365dc6b2',
                'ParameterValueId' => '11a9dafc-320d-463a-a4e0-24fcb9de2e73',
            ),
            1 => 
            array (
                'TypeOfContractId' => '40e36b39-cbbc-48fd-9123-3db6365dc6b2',
                'ParameterValueId' => '17d8c9cf-49a2-4813-bafc-228a56dc4105',
            ),
            2 => 
            array (
                'TypeOfContractId' => '5c864427-ec29-4562-aed6-048d68ac28da',
                'ParameterValueId' => '11a9dafc-320d-463a-a4e0-24fcb9de2e73',
            ),
            3 => 
            array (
                'TypeOfContractId' => '5c864427-ec29-4562-aed6-048d68ac28da',
                'ParameterValueId' => '17d8c9cf-49a2-4813-bafc-228a56dc4105',
            ),
        ));
        
        
    }
}