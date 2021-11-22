<?php

use Illuminate\Database\Seeder;

class SearchSourcesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {


        \DB::table('search_sources')->delete();

        \DB::table('search_sources')->insert(array(
            0 =>
            array(
                'id' => 'ff00ee32-6b24-4726-8122-d0de25f57326',
                'code' => 'N1',
                'name' => 'Data marketing',
                'created_at' => '2021-11-18 03:26:30',
                'updated_at' => '2021-11-18 03:26:30',
                'deleted_at' => NULL,
                'type' => 'DATA_MKT',
            ),
            1 =>
            array(
                'id' => '9fb5c396-eef6-46fa-93b0-6d1f75ffa4d7',
                'code' => 'N2',
                'name' => 'Website',
                'created_at' => '2021-11-18 03:26:52',
                'updated_at' => '2021-11-18 03:26:52',
                'deleted_at' => NULL,
                'type' => 'WEBSITE',
            ),
            2 =>
            array(
                'id' => '7a6b9f7f-c8d1-4fb9-acfa-025e0d828f45',
                'code' => 'N3',
                'name' => 'Fanpage',
                'created_at' => '2021-11-18 03:27:04',
                'updated_at' => '2021-11-18 03:27:04',
                'deleted_at' => NULL,
                'type' => 'FANPAGE',
            ),
            3 =>
            array(
                'id' => '550a574c-eaf4-4738-936e-65b204e4b933',
                'code' => 'N4',
                'name' => 'KiddiHub',
                'created_at' => '2021-11-18 03:27:18',
                'updated_at' => '2021-11-18 03:27:18',
                'deleted_at' => NULL,
                'type' => 'KIDDIHUB',
            ),
            4 =>
            array(
                'id' => '1483f9b1-dd21-4ac1-b25d-3dbcb29ceacd',
                'code' => 'N5',
                'name' => 'Đi ngang',
                'created_at' => '2021-11-18 03:27:37',
                'updated_at' => '2021-11-18 03:27:37',
                'deleted_at' => NULL,
                'type' => 'DI_NGANG',
            ),
            5 =>
            array(
                'id' => 'a3432ad0-110c-4ece-99de-a22bf41ab4fb',
                'code' => 'N6',
                'name' => 'Người quen giới thiệu',
                'created_at' => '2021-11-18 03:27:52',
                'updated_at' => '2021-11-18 03:27:52',
                'deleted_at' => NULL,
                'type' => 'NQGT',
            ),
            6 =>
            array(
                'id' => '3251ec47-208b-46c6-92d6-67aa6453c641',
                'code' => 'N7',
                'name' => 'Data tiềm năng',
                'created_at' => '2021-11-18 03:28:23',
                'updated_at' => '2021-11-18 03:28:23',
                'deleted_at' => NULL,
                'type' => 'DATA_TIEM_NANG',
            ),
            7 =>
            array(
                'id' => '9c85bab0-adac-4578-a1cc-f807ac50d1ea',
                'code' => 'N8',
                'name' => 'Data khác',
                'created_at' => '2021-11-18 03:28:57',
                'updated_at' => '2021-11-18 03:28:57',
                'deleted_at' => NULL,
                'type' => 'DATA_KHAC',
            ),
            8 =>
            array(
                'id' => '6c885e13-5c2d-4fda-9b67-23ea4e5f6eea',
                'code' => 'N9',
                'name' => 'Youtube',
                'created_at' => '2021-11-18 03:29:10',
                'updated_at' => '2021-11-18 03:29:10',
                'deleted_at' => NULL,
                'type' => 'YOUTUBE',
            ),
            9 =>
            array(
                'id' => '399b4654-49a2-4c00-9b92-1e5db33b5a2e',
                'code' => 'N10',
                'name' => 'Tiktok',
                'created_at' => '2021-11-18 03:29:24',
                'updated_at' => '2021-11-18 03:29:24',
                'deleted_at' => NULL,
                'type' => 'TIKTOK',
            ),
            10 =>
            array(
                'id' => '08434a44-78d7-4e55-b133-642287264367',
                'code' => 'N11',
                'name' => 'Zalo',
                'created_at' => '2021-11-18 03:29:35',
                'updated_at' => '2021-11-18 03:29:35',
                'deleted_at' => NULL,
                'type' => 'ZALO',
            ),
        ));
    }
}
