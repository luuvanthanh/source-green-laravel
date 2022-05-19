<?php

use Illuminate\Database\Seeder;

class DismissedsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('Dismisseds')->delete();
        
        
        
    }
}