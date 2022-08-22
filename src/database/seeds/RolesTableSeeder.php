<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class RolesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {


        \DB::table('roles')->delete();

        \DB::table('roles')->insert(array(
            0 =>
            array(
                'id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
                'name' => 'Super Admin',
                'guard_name' => 'api',
                'created_at' => '2021-12-01 01:24:18',
                'updated_at' => '2021-12-01 01:24:18',
                'is_unlimited' => "0",
            ),
            1 =>
            array(
                'id' => 'ca51fc71-abfd-4fcf-be10-0757485206ca',
                'name' => 'Lãnh đạo Sở',
                'guard_name' => 'api',
                'created_at' => '2022-06-21 15:54:47',
                'updated_at' => '2022-06-21 15:54:47',
                'is_unlimited' => "0",
            ),
            2 =>
            array(
                'id' => '4caf3b03-d6c8-4361-95a4-57b88fafc054',
                'name' => 'Thanh tra Sở',
                'guard_name' => 'api',
                'created_at' => '2022-06-21 15:57:12',
                'updated_at' => '2022-06-21 15:57:12',
                'is_unlimited' => "0",
            ),
            3 =>
            array(
                'id' => '9e5e87e2-72ac-4592-9add-c8f3722151dc',
                'name' => 'Ban quản lý khu điểm',
                'guard_name' => 'api',
                'created_at' => '2022-06-21 15:59:10',
                'updated_at' => '2022-06-21 15:59:10',
                'is_unlimited' => "0",
            ),
            4 =>
            array(
                'id' => '2a8faa4f-23bb-420f-aefe-ff5c7c11490d',
                'name' => 'Chuyên viên',
                'guard_name' => 'api',
                'created_at' => '2022-06-30 14:16:58',
                'updated_at' => '2022-06-30 14:16:58',
                'is_unlimited' => "0",
            ),
            5 =>
            array(
                'id' => '84d0477f-9cb9-4572-989a-33abb94d19ff',
                'name' => 'Văn thư',
                'guard_name' => 'api',
                'created_at' => '2022-06-30 14:17:41',
                'updated_at' => '2022-06-30 14:17:41',
                'is_unlimited' => "0",
            ),
            6 =>
            array(
                'id' => 'b41a13b3-26fd-4de1-a34b-1fabd87cc2a7',
                'name' => 'Chuyên viên 1',
                'guard_name' => 'api',
                'created_at' => '2022-06-30 14:20:03',
                'updated_at' => '2022-06-30 14:20:03',
                'is_unlimited' => "0",
            ),
            7 =>
            array(
                'id' => 'dac3a932-5915-47a7-8568-40063d5bdb6a',
                'name' => 'Chuyên viên 2',
                'guard_name' => 'api',
                'created_at' => '2022-06-30 14:20:12',
                'updated_at' => '2022-06-30 14:20:12',
                'is_unlimited' => "0",
            ),
            8 =>
            array(
                'id' => 'de961f82-4b5c-465d-8c99-9939c3a91e71',
                'name' => 'Chuyên viên 3',
                'guard_name' => 'api',
                'created_at' => '2022-06-30 14:20:19',
                'updated_at' => '2022-06-30 14:20:19',
                'is_unlimited' => "0",
            ),
            9 =>
            array(
                'id' => '2d1dcf41-bb0c-4087-af1d-99b2482e3a09',
                'name' => 'Chuyên viên 4',
                'guard_name' => 'api',
                'created_at' => '2022-06-30 14:20:26',
                'updated_at' => '2022-06-30 14:20:26',
                'is_unlimited' => "0",
            ),
            10 =>
            array(
                'id' => '08b42d4b-be80-4363-a356-d5d350e04524',
                'name' => 'Văn thư 2',
                'guard_name' => 'api',
                'created_at' => '2022-06-30 14:20:34',
                'updated_at' => '2022-06-30 14:20:34',
                'is_unlimited' => "0",
            ),
            11 =>
            array(
                'id' => '1338ede6-fe84-4eaf-a0c0-e0d0f90104be',
                'name' => 'Văn thư 3',
                'guard_name' => 'api',
                'created_at' => '2022-06-30 14:20:47',
                'updated_at' => '2022-06-30 14:20:47',
                'is_unlimited' => "0",
            ),
        ));
    }
}
