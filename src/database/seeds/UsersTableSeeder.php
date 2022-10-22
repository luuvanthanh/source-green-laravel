<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('users')->delete();
        
        \DB::table('users')->insert(array (
            0 => 
            array (
                'id' => '3ac43330-535d-4079-bbc1-767b3c91fe00',
                'full_name' => 'admin',
                'email' => 'admin@gmail.com',
                'email_verified_at' => NULL,
                'password' => '$2y$10$Bwr2KiR/vK20s0CDg/8Sp.qw4LOpMIOOC/cUQ.hC0mqzr9vogRqu.',
                'status' => 0,
                'remember_token' => NULL,
                'created_at' => '2020-06-04 13:59:37',
                'updated_at' => '2022-09-16 11:07:04',
                'is_first_login' => false,
                'phone' => NULL,
                'deleted_at' => NULL,
                'unit_id' => '9c666a2d-018f-431a-b868-6231baaaae16',
                'is_all_tourist_destination' => true,
                'is_all_camera' => true,
            ),
        ));
        
        
    }
}