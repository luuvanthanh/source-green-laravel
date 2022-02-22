<?php

use Illuminate\Database\Seeder;

class FeesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {

        \DB::table('fee.Fees')->truncate();

        \DB::table('fee.Fees')->insert(array(
            0 => array(
                'Id' => 'df8d3acc-566b-4f56-850e-af3f4c48e6a4',
                'Name' => 'Tiền học phí',
                'Code' => 'HP',
                'Type' => null,
                'CreationTime' => '2021-06-17 03:04:29',
                'LastModificationTime' => '2021-06-17 03:04:29',
            ),
            1 => array(
                'Id' => '287cdee5-e4f2-480f-add9-b14c4dd0ddae',
                'Name' => 'Phí Tiền Ăn',
                'Code' => 'TIENAN',
                'Type' => null,
                'CreationTime' => '2021-06-17 03:04:57',
                'LastModificationTime' => '2021-06-17 03:04:57',
            ),
            2 => array(
                'Id' => '14bfa6f6-f412-4448-8851-8bb988b731e1',
                'Name' => 'Phí Học Anh Văn',
                'Code' => 'ANHVAN',
                'Type' => 'K',
                'CreationTime' => '2021-06-17 03:06:30',
                'LastModificationTime' => '2021-06-17 03:06:30',
            ),
            3 => array(
                'Id' => '293be267-fd9d-4344-ad85-8a97664bc3ed',
                'Name' => 'Phí Stream Và Tư Duy',
                'Code' => 'TUDUY',
                'Type' => 'K',
                'CreationTime' => '2021-06-17 03:06:52',
                'LastModificationTime' => '2021-06-17 03:06:52',
            ),
            4 => array(
                'Id' => '422d745c-a027-4e03-99f6-d1afcc0320e6',
                'Name' => 'Phí Xe Bus',
                'Code' => 'BUS',
                'Type' => 'K',
                'CreationTime' => '2021-06-17 03:07:02',
                'LastModificationTime' => '2021-06-17 03:07:02',
            ),
            5 => array(
                'Id' => 'f7d72aba-41c0-48c4-b4f1-26d63c859b61',
                'Name' => 'Phí ngoài giờ',
                'Code' => 'NG',
                'Type' => 'K',
                'CreationTime' => '2021-06-17 03:07:17',
                'LastModificationTime' => '2021-06-17 03:07:17',
            ),
        ));

    }
}
