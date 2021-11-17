<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

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

        \DB::table('users')->insert(array(
            0 => array(
                'id' => Str::uuid(),
                'email' => 'admin@gmail.com',
                'email_verified_at' => null,
                'password' => '$2y$10$AOlcwnrf5b/m6ynqcSZ.gOGfauVLw3Cwm1W9gGhwQ20/wHgB7KGpG',
                'remember_token' => null,
                'created_at' => '2020-06-04 13:59:37',
                'updated_at' => '2020-11-09 10:45:16',
                'full_name' => 'admin',
                'status' => 0,
            ),
        ));
    }
}
