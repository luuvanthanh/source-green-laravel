<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ThirdPartyServicesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('third_party_services')->delete();
        
        \DB::table('third_party_services')->insert(array (
            0 => 
            array (
                'id' => '1c94a657-c400-45a8-a22e-8da46da5fc04',
                'name' => 'Đường dẫn AI',
                'code' => 'AI_URL',
                'value' => 'https://api-ai.greenlabs.ai/face_service',
                'created_at' => '2022-02-16 10:13:57',
                'updated_at' => '2022-02-16 10:13:57',
            ),
            1 => 
            array (
                'id' => 'f06f040a-0a80-49ad-a199-cb81d0326389',
                'name' => 'Đường dẫn vms-core',
                'code' => 'VMS_CORE_URL',
                'value' => 'http://192.168.111.147:7001',
                'created_at' => '2022-02-16 10:15:10',
                'updated_at' => '2022-02-16 10:15:10',
            ),
            2 => 
            array (
                'id' => 'b44eefef-ab8e-451a-830a-a1e0dcf14c45',
                'name' => 'Đường dẫn web app',
                'code' => 'WEB_APP_URL',
                'value' => 'https://gsdl-dev.greenglobal.vn',
                'created_at' => '2022-02-16 10:15:32',
                'updated_at' => '2022-02-16 10:15:32',
            ),
            3 => 
            array (
                'id' => '76f13696-9bf0-45d4-9e1f-111033f6a3ff',
                'name' => 'App onesignal id',
                'code' => 'ONESIGNAL_APP_ID',
                'value' => '0b735db4-f69e-46f4-8561-cdf2287f7fdd',
                'created_at' => '2022-02-16 10:16:20',
                'updated_at' => '2022-02-16 10:16:20',
            ),
            4 => 
            array (
                'id' => 'b373d481-6510-4f67-975d-8c4a7650c431',
                'name' => 'Rest api key onesignal',
                'code' => 'ONESIGNAL_REST_API_KEY',
                'value' => 'ZWU5YjZlODItMjUyZS00NjM2LWJiYmUtY2M1YTQyOTI2ODIx',
                'created_at' => '2022-02-16 10:20:40',
                'updated_at' => '2022-02-16 10:20:40',
            ),
            5 => 
            array (
                'id' => '37a21de6-4f5a-4421-b2b3-00f0d1b50090',
                'name' => 'User auth key onesignal',
                'code' => 'ONESIGNAL_USER_AUTH_KEY',
                'value' => 'YmFmY2Q5ZTItODRkMS00NTBiLTg4MWItMmQ0YTRlNTQ2NjA2',
                'created_at' => '2022-02-16 10:21:00',
                'updated_at' => '2022-02-16 10:21:00',
            ),
            6 => 
            array (
                'id' => '7362b97b-61fe-4abb-a35a-c5a3d16b41a4',
                'name' => 'Đường dẫn file',
                'code' => 'IMAGE_URL',
                'value' => 'https://gsdl-dev-storage.greenglobal.vn/dltm',
                'created_at' => '2022-02-16 11:08:38',
                'updated_at' => '2022-02-16 11:08:38',
            ),
            7 => 
            array (
                'id' => 'dff8931e-7a2b-4e09-a4ad-5b95809cce49',
                'name' => 'Đường dẫn login',
                'code' => 'LOGIN_URL',
                'value' => 'https://gsdl-dev.greenglobal.vn/login',
                'created_at' => '2022-02-16 11:08:53',
                'updated_at' => '2022-02-16 11:08:53',
            ),
            8 => 
            array (
                'id' => '5b8741b7-3301-4b2d-902b-4d0b7e93780d',
                'name' => 'Đường dẫn đặt lại mật khẩu',
                'code' => 'RESET_PASSWORD_URL',
                'value' => 'https://gsdl-dev.greenglobal.vn/reset-password',
                'created_at' => '2022-02-16 11:09:14',
                'updated_at' => '2022-02-16 11:09:14',
            ),
        ));
        
        
    }
}