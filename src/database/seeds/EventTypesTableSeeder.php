<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class EventTypesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('event_types')->delete();
        
        \DB::table('event_types')->insert(array (
            0 => 
            array (
                'id' => '15a4f3c1-0159-44a1-b53a-6bf1bd9c6fe4',
                'code' => 'HDVHP',
                'name' => 'Hướng dẫn viên hợp pháp',
                'type' => 'Đối tượng',
                'created_at' => '2021-11-17 16:00:36',
                'updated_at' => '2021-11-17 16:00:36',
                'deleted_at' => NULL,
            ),
            1 => 
            array (
                'id' => '9add3d41-6863-4ddc-a495-0a8edb846dc8',
                'code' => 'HDVBHP',
                'name' => 'Hướng dẫn viên bất hợp pháp',
                'type' => 'Đối tượng',
                'created_at' => '2021-11-17 16:00:56',
                'updated_at' => '2021-11-17 16:00:56',
                'deleted_at' => NULL,
            ),
            2 => 
            array (
                'id' => '27c15ea1-7197-4282-b69d-b06412ce61bc',
                'code' => 'NNHDV',
                'name' => 'Nghi ngờ là hướng dẫn viên',
                'type' => 'Đối tượng',
                'created_at' => '2021-11-17 16:01:08',
                'updated_at' => '2021-11-17 16:01:08',
                'deleted_at' => NULL,
            ),
            3 => 
            array (
                'id' => '43675f08-47a1-436f-805c-362e59578fd3',
                'code' => 'HVHD',
                'name' => 'Hành vi hướng dẫn',
                'type' => 'Hành vi',
                'created_at' => '2021-11-17 16:03:40',
                'updated_at' => '2021-11-17 16:03:40',
                'deleted_at' => NULL,
            ),
            4 => 
            array (
                'id' => 'e12763d5-127e-43c4-b74d-1d099daf2a8e',
                'code' => 'BHR',
                'name' => 'Bán hàng rong',
                'type' => 'Hành vi',
                'created_at' => '2021-11-17 16:04:18',
                'updated_at' => '2021-11-17 16:04:18',
                'deleted_at' => NULL,
            ),
            5 => 
            array (
                'id' => 'b72ee25e-5c27-4189-b522-87aca0f2f08b',
                'code' => 'RAC',
                'name' => 'Rác',
                'type' => 'Đối tượng',
                'created_at' => '2021-11-17 16:04:38',
                'updated_at' => '2021-11-17 16:04:38',
                'deleted_at' => NULL,
            ),
            6 => 
            array (
                'id' => '4aa58748-a62b-4b31-b303-7f5f6e03d037',
                'code' => 'BL',
                'name' => 'Đối tượng cần theo dõi',
                'type' => 'Đối tượng',
                'created_at' => '2021-11-17 16:04:03',
                'updated_at' => '2021-11-17 16:04:03',
                'deleted_at' => NULL,
            ),
        ));
        
        
    }
}