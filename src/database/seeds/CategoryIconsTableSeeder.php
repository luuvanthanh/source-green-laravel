<?php

use Illuminate\Database\Seeder;

class CategoryIconsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('category_icons')->delete();
        
        \DB::table('category_icons')->insert(array (
            0 => 
            array (
                'id' => 'dcb84fb3-45d5-490f-80ef-957c6d6ffc8b',
                'name' => 'Mặt cười & hình người',
                'created_at' => '2021-11-29 07:09:21',
                'updated_at' => '2021-11-29 07:09:21',
            ),
            1 => 
            array (
                'id' => '0ca45c5d-dcdf-46b7-aeeb-3355547fe30f',
                'name' => 'Động vật & thiên nhiên',
                'created_at' => '2021-11-29 07:09:47',
                'updated_at' => '2021-11-29 07:09:47',
            ),
            2 => 
            array (
                'id' => '554d281f-9389-436d-9786-43026d94b09c',
                'name' => 'Ẩm thực',
                'created_at' => '2021-11-29 07:10:03',
                'updated_at' => '2021-11-29 07:10:03',
            ),
            3 => 
            array (
                'id' => '5ed2d21a-7121-4e29-aebc-9a323dad0442',
                'name' => 'Hoạt động',
                'created_at' => '2021-11-29 07:10:17',
                'updated_at' => '2021-11-29 07:10:17',
            ),
            4 => 
            array (
                'id' => '8e0f83f1-7479-4149-84f5-6aa8231a6ef6',
                'name' => 'Đi lại & địa điểm',
                'created_at' => '2021-11-29 07:10:37',
                'updated_at' => '2021-11-29 07:10:37',
            ),
            5 => 
            array (
                'id' => 'afd8aa98-59e4-4d36-a75f-e03c98a4749a',
                'name' => 'Đồ vật',
                'created_at' => '2021-11-29 07:10:51',
                'updated_at' => '2021-11-29 07:10:51',
            ),
            6 => 
            array (
                'id' => '2731baaf-0eb8-4862-875b-2e55bbf02419',
                'name' => 'Biểu tượng',
                'created_at' => '2021-11-29 07:11:10',
                'updated_at' => '2021-11-29 07:11:10',
            ),
            7 => 
            array (
                'id' => '7e464a45-3cce-4c19-a2a6-033e4f71bd0d',
                'name' => 'Cờ',
                'created_at' => '2021-11-29 07:11:20',
                'updated_at' => '2021-11-29 07:11:20',
            ),
        ));
        
        
    }
}