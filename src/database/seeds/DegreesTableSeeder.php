<?php

use Illuminate\Database\Seeder;

class DegreesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        \DB::table('Degrees')->delete();

        \DB::table('Degrees')->insert(array(
            0 =>
            array(
                'Id' => '978be04d-5dbc-41b8-96a5-c07da638f125',
                'Code' => 'Trungcap',
                'Name' => 'Trung cấp',
                'CreationTime' => '2022-03-23 03:36:14',
                'LastModificationTime' => '2022-03-29 02:55:26',
                'DeletionTime' => NULL,
            ),
            1 =>
            array(
                'Id' => 'f9891e53-81d5-4105-a005-a6fc8e1feeec',
                'Code' => 'CaoDang',
                'Name' => 'Cao Đẳng',
                'CreationTime' => '2022-03-29 02:55:52',
                'LastModificationTime' => '2022-03-29 02:55:52',
                'DeletionTime' => NULL,
            ),
            2 =>
            array(
                'Id' => 'f046c0a8-f80d-44e8-b198-3e8f07854e64',
                'Code' => 'DaiHoc',
                'Name' => 'Đại Học',
                'CreationTime' => '2022-03-29 02:56:17',
                'LastModificationTime' => '2022-03-29 02:56:17',
                'DeletionTime' => NULL,
            ),
            3 =>
            array(
                'Id' => 'dd0f85e1-63a0-475a-bb7f-ec51c1a369f4',
                'Code' => 'TienSi',
                'Name' => 'Tiến sĩ',
                'CreationTime' => '2022-03-29 02:57:05',
                'LastModificationTime' => '2022-03-29 02:57:05',
                'DeletionTime' => NULL,
            ),
            4 =>
            array(
                'Id' => '43c7e6cf-d771-4495-b14a-68aa58e90a56',
                'Code' => 'ThacSi',
                'Name' => 'Thạc sĩ',
                'CreationTime' => '2022-03-29 02:57:22',
                'LastModificationTime' => '2022-03-29 02:57:46',
                'DeletionTime' => NULL,
            ),
            5 =>
            array(
                'Id' => '49f2b165-20b8-444e-95c1-f2a0295f5985',
                'Code' => 'KySu',
                'Name' => 'Kỹ sư',
                'CreationTime' => '2022-03-29 02:58:08',
                'LastModificationTime' => '2022-03-29 02:58:08',
                'DeletionTime' => NULL,
            ),
            6 =>
            array(
                'Id' => '4fb495b0-2d5c-4637-9f5d-e926905d02b8',
                'Code' => 'SauDaiHoc',
                'Name' => 'Sau đại học',
                'CreationTime' => '2022-03-29 02:58:24',
                'LastModificationTime' => '2022-03-29 02:58:24',
                'DeletionTime' => NULL,
            ),
        ));
    }
}
