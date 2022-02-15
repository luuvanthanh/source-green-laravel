<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ApiSharesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('api_shares')->delete();
        
        \DB::table('api_shares')->insert(array (
            0 => 
            array (
                'id' => '2ed4a57e-6643-48ab-a5ed-84afe73a84f4',
                'name' => 'API chia sẻ thông tin hướng dẫn viên du lịch theo họ tên',
                'name_route' => 'tour-guides-share',
                'link' => 'https://gsdl-dev-api.greenglobal.vn/api/v1/tour-guides',
                'is_share' => true,
                'created_at' => '2022-02-16 14:03:25',
                'updated_at' => '2022-02-16 14:03:25',
            ),
            1 => 
            array (
                'id' => 'a9da5282-58e5-4456-a5da-783972afb653',
                'name' => 'API chia sẻ bản đồ các camera giám sát',
                'name_route' => 'cameras-share',
                'link' => 'https://gsdl-dev-api.greenglobal.vn/api/v1/share/cameras',
                'is_share' => true,
                'created_at' => '2022-02-17 09:28:06',
                'updated_at' => '2022-02-17 09:28:06',
            ),
            2 => 
            array (
                'id' => '4ba430d4-7911-4aed-962d-df630b03aa3e',
                'name' => 'API chia sẻ thông tin nhận dạng hướng dẫn viên du lịch theo Họ tên',
                'name_route' => 'tour-guides-identification-share',
                'link' => 'https://gsdl-dev-api.greenglobal.vn/api/v1/share/tour-guides-identification',
                'is_share' => true,
                'created_at' => '2022-02-17 09:34:00',
                'updated_at' => '2022-02-17 09:34:00',
            ),
        ));
        
        
    }
}