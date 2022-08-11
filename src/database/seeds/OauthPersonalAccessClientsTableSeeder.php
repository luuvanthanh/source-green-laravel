<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class OauthPersonalAccessClientsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {


        \DB::table('oauth_personal_access_clients')->delete();

        \DB::table('oauth_personal_access_clients')->insert(array(
            0 =>
            array(
                'id' => 1,
                'client_id' => '94f79c4e-5619-4ced-ba43-d150fd8d9449',
                'created_at' => '2021-11-26 14:33:22',
                'updated_at' => '2021-11-26 14:33:22',
            ),
        ));
    }
}
