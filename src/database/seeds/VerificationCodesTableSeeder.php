<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class VerificationCodesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('verification_codes')->delete();
        
        \DB::table('verification_codes')->insert(array (
            0 => 
            array (
                'id' => '002411b7-2ac9-4d69-8cfc-34d154d73c5f',
                'name' => 'Mã truy cập',
                'code' => 'Sz0JqPfh5e',
                'created_at' => '2022-06-27 11:28:21',
                'updated_at' => '2022-06-27 11:28:21',
            ),
        ));
        
        
    }
}