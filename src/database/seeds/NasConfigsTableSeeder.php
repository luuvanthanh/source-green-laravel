<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class NasConfigsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('nas_configs')->delete();
        
        \DB::table('nas_configs')->insert(array (
            0 => 
            array (
                'id' => '2ed4a57e-6643-48ab-a5ed-84afe73a84f4',
                'ip' => '13',
                'username' => '13',
                'password' => '113',
                'folder' => '13',
                'created_at' => '2022-03-24 10:02:31',
                'updated_at' => '2022-04-15 16:34:46',
            ),
        ));
        
        
    }
}