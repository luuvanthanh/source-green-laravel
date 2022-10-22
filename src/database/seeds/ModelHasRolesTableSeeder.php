<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ModelHasRolesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('model_has_roles')->delete();
        
        \DB::table('model_has_roles')->insert(array (
            0 => 
            array (
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
                'model_type' => 'GGPHP\\Users\\Models\\User',
                'model_id' => '3ac43330-535d-4079-bbc1-767b3c91fe00',
            ),
        ));
        
        
    }
}