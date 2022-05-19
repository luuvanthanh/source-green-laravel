<?php

use Illuminate\Database\Seeder;

class FingerprintsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('Fingerprints')->delete();
        
        
        
    }
}