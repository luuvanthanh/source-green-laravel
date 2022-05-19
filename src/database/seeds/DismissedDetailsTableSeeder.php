<?php

use Illuminate\Database\Seeder;

class DismissedDetailsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('DismissedDetails')->delete();
        
        
        
    }
}