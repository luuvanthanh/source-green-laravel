<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class SystemConfigsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('system_configs')->delete();
        
        \DB::table('system_configs')->insert(array (
            0 => 
            array (
                'id' => 'fa19e2b6-fa02-47d8-90ec-017e79bf893f',
                'language' => 'vi',
                'account_send_email' => 'sdl@egov.vn',
                'created_at' => '2022-02-24 14:18:14',
                'updated_at' => '2022-02-24 14:18:14',
            ),
        ));
        
        
    }
}