<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class AiServicesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('ai_services')->delete();
        
        \DB::table('ai_services')->insert(array (
            0 => 
            array (
                'id' => 'fd6e2c07-7996-4ac2-bcf2-0ba4d8037885',
                'name' => 'Phát hiện đối tượng hướng dẫn viên hợp pháp',
                'number' => '1',
                'created_at' => '2022-04-18 14:00:12',
                'updated_at' => '2022-04-18 14:00:12',
            ),
            1 => 
            array (
                'id' => '824e3272-7f83-4217-8213-17d2c61d226f',
                'name' => 'Phát hiện đối tượng hướng dẫn viên bất hợp pháp',
                'number' => '2',
                'created_at' => '2022-04-18 14:00:36',
                'updated_at' => '2022-04-18 14:00:36',
            ),
            2 => 
            array (
                'id' => 'a638ec63-8522-478d-bba6-789e32bd533b',
                'name' => 'Phát hiện đối tượng cần theo dõi',
                'number' => '3',
                'created_at' => '2022-04-18 14:00:45',
                'updated_at' => '2022-04-18 14:00:45',
            ),
            3 => 
            array (
                'id' => 'a1c993ba-91e3-4d8a-8aff-71243a7abb18',
                'name' => 'Phát hiện đối tượng nghi ngờ là hướng dẫn viên',
                'number' => '4',
                'created_at' => '2022-04-18 14:00:59',
                'updated_at' => '2022-04-18 14:00:59',
            ),
            4 => 
            array (
                'id' => '0abc4da5-85d8-48f3-b88c-5fc469281308',
                'name' => 'Phát hiện rác',
                'number' => '5',
                'created_at' => '2022-04-18 14:01:08',
                'updated_at' => '2022-04-18 14:01:08',
            ),
            5 => 
            array (
                'id' => '5a3f2c11-0783-492a-82a2-2ef8eb461499',
                'name' => 'Phát hiện hành vi bán hàng rong',
                'number' => '6',
                'created_at' => '2022-04-18 14:01:25',
                'updated_at' => '2022-04-18 14:01:25',
            ),
            6 => 
            array (
                'id' => 'dcf6f366-c77f-46c9-a0b8-d28854f256cf',
                'name' => 'Phát hiện hành vi hướng dẫn',
                'number' => '7',
                'created_at' => '2022-04-18 14:01:42',
                'updated_at' => '2022-04-18 14:01:42',
            ),
            7 => 
            array (
                'id' => '0e705ba7-597b-4d19-b32c-aab8eb731ace',
                'name' => 'Đếm khách',
                'number' => '8',
                'created_at' => '2022-04-18 14:02:01',
                'updated_at' => '2022-04-18 14:02:01',
            ),
        ));
        
        
    }
}