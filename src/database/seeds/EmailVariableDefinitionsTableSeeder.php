<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class EmailVariableDefinitionsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('email_variable_definitions')->delete();
        
        \DB::table('email_variable_definitions')->insert(array (
            0 => 
            array (
                'id' => '62dbaf88-1f5a-486b-96e8-0bf0382eaad5',
                'name' => 'Tên người dùng',
                'code' => 'tennguoidung',
                'description' => 'Là tên của người nhận email',
                'created_at' => '2022-02-24 14:12:06',
                'updated_at' => '2022-02-24 14:12:06',
            ),
            1 => 
            array (
                'id' => '06e5f52d-f532-460b-a8bf-023c2d7ddfaa',
                'name' => 'Tên đối tượng',
                'code' => 'tendoituong',
                'description' => 'Là tên của đối tượng mà hệ thống nhận dạng được',
                'created_at' => '2022-02-24 14:12:42',
                'updated_at' => '2022-02-24 14:12:42',
            ),
            2 => 
            array (
                'id' => 'd8526067-c52e-4f74-9fb2-5c94915ff7fd',
                'name' => 'Đường dẫn',
                'code' => 'duongdan',
                'description' => 'Là đường dẫn truy cập trang chi tiết sự kiện',
                'created_at' => '2022-02-24 14:13:31',
                'updated_at' => '2022-02-24 14:13:31',
            ),
            3 => 
            array (
                'id' => 'e4eca688-08b8-4a94-a7f5-fde0225e48c9',
                'name' => 'Tên khu điểm',
                'code' => 'tenkhudiem',
                'description' => 'Là vị trí nơi đối tượng được nhận dạng',
                'created_at' => '2022-02-24 14:15:02',
                'updated_at' => '2022-02-24 14:15:02',
            ),
        ));
        
        
    }
}