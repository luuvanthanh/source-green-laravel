<?php

use Illuminate\Database\Seeder;

class FingerprintTimekeepersTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('fingerprint_timekeepers')->delete();
        
        \DB::table('fingerprint_timekeepers')->insert(array (
            0 => 
            array (
                'id' => 'c7351f4a-de45-4587-960a-2eda5d865ce9',
                'name' => 'Máy chấm công 1',
                'serial_number' => 'CJRN200260001',
                'ip' => '192.168.1.40',
                'port' => 8000,
                'status' => true,
                'created_at' => '2021-04-02 07:33:30',
                'updated_at' => '2021-04-02 07:33:30',
            ),
        ));
        
        
    }
}