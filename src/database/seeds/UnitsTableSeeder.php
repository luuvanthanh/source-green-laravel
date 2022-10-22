<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class UnitsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('units')->delete();
        
        \DB::table('units')->insert(array (
            0 => 
            array (
                'id' => '9c666a2d-018f-431a-b868-6231baaaae16',
                'name' => 'Toàn Cầu Xanh',
                'created_at' => '2022-09-16 11:06:57',
                'updated_at' => '2022-09-16 11:06:57',
                'deleted_at' => NULL,
            ),
        ));
        
        
    }
}