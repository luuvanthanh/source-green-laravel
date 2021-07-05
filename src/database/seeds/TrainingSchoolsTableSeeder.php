<?php

use Illuminate\Database\Seeder;

class TrainingSchoolsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {

        \DB::table('TrainingSchools')->truncate();

        \DB::table('TrainingSchools')->insert(array(
            0 => array(
                'Id' => '7df02b46-2d89-402f-9a75-3f73405c3147',
                'Code' => 'ĐHSP',
                'Name' => 'Đại học sư phạm',
                'Address' => 'Tôn Đức Thăng',
                'CreationTime' => '2021-04-19 08:49:30',
                'LastModificationTime' => '2021-04-19 08:49:30',
            ),
            1 => array(
                'Id' => 'a9d30779-9084-4cfa-99c0-d7bd0d29a0c0',
                'Code' => 'ĐHBK',
                'Name' => 'Đại học Bách Khoa',
                'Address' => 'Tôn Đức Thăng',
                'CreationTime' => '2021-04-19 08:49:49',
                'LastModificationTime' => '2021-04-19 08:49:49',
            ),
        ));

    }
}
