<?php

use Illuminate\Database\Seeder;

class AppointsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('Appoints')->delete();
        
        
        
    }
}