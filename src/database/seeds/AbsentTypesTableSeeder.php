<?php

use Illuminate\Database\Seeder;

class AbsentTypesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {

        \DB::table('AbsentTypes')->truncate();

        \DB::table('AbsentTypes')->insert(array(
            0 => array(
                'Id' => '245c003c-c88a-4c75-a25d-64c0251b7e5f',
                'Name' => 'Nghỉ phép',
                'Status' => 'ON',
                'Type' => 'ABSENT',
                'CreationTime' => '2021-04-22 02:12:46',
                'LastModificationTime' => '2021-04-22 02:12:46',
                'Code' => 'F',
            ),
            1 => array(
                'Id' => '2ee21279-fb27-44fb-b0f3-a8eb6f8ad620',
                'Name' => 'Nghỉ không phép',
                'Status' => 'ON',
                'Type' => 'ABSENT',
                'CreationTime' => '2021-04-22 02:12:35',
                'LastModificationTime' => '2021-04-22 02:12:35',
                'Code' => 'K',
            ),
            2 => array(
                'Id' => '37bc24d8-f25b-4939-b54b-df9bbfb3e182',
                'Name' => 'Nhân viên nghỉ thai sản',
                'Status' => 'ON',
                'Type' => 'MATERNITY_LEAVE',
                'CreationTime' => '2021-05-12 05:11:31',
                'LastModificationTime' => '2021-05-12 05:11:31',
                'Code' => 'TS',
            ),
            3 => array(
                'Id' => '1816e2c6-95a2-41d7-8944-72965d3a2a1d',
                'Name' => 'Công tác',
                'Status' => 'ON',
                'Type' => 'BUSINESS_TRAVEL',
                'CreationTime' => '2021-05-12 05:11:56',
                'LastModificationTime' => '2021-05-12 05:11:56',
                'Code' => 'CT',
            ),
            4 => array(
                'Id' => '7674d46f-96d1-4232-a295-0f194f06e1d4',
                'Name' => 'Đi ra ngoài',
                'Status' => 'ON',
                'Type' => 'GO_OUT',
                'CreationTime' => '2021-05-12 05:12:42',
                'LastModificationTime' => '2021-05-12 05:12:42',
                'Code' => 'RN',
            ),
            5 => array(
                'Id' => 'b8c2ab59-b1e7-4091-b071-a865b8caf2d0',
                'Name' => 'Làm thêm giờ',
                'Status' => 'ON',
                'Type' => 'ADD_TIME',
                'CreationTime' => '2021-05-12 05:13:09',
                'LastModificationTime' => '2021-05-12 05:13:09',
                'Code' => 'OT',
            ),
        ));

    }
}
