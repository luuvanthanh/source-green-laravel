<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class OauthClientsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('oauth_clients')->delete();
        
        \DB::table('oauth_clients')->insert(array (
            0 => 
            array (
                'id' => '94f79c4e-5619-4ced-ba43-d150fd8d9449',
                'user_id' => NULL,
                'name' => 'Laravel Personal Access Client',
                'secret' => 'xs35K3VhqyI9uEENBO97wgkNvUI6gggEWhL4kaBQ',
                'provider' => NULL,
                'redirect' => 'http://localhost',
                'personal_access_client' => 1,
                'password_client' => 0,
                'revoked' => 0,
                'created_at' => '2021-11-26 14:33:22',
                'updated_at' => '2021-11-26 14:33:22',
            ),
            1 => 
            array (
                'id' => '94f79c4e-af07-4557-9342-420bdb8be78c',
                'user_id' => NULL,
                'name' => 'Laravel Password Grant Client',
                'secret' => 'gNwkLr7QOpKCSLVULb812K3zhqcezLSkZsIHh381',
                'provider' => 'users',
                'redirect' => 'http://localhost',
                'personal_access_client' => 0,
                'password_client' => 1,
                'revoked' => 0,
                'created_at' => '2021-11-26 14:33:22',
                'updated_at' => '2021-11-26 14:33:22',
            ),
        ));
        
        
    }
}