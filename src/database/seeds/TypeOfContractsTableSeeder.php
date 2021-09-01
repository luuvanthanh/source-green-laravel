<?php

use Illuminate\Database\Seeder;

class TypeOfContractsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {

        \DB::table('TypeOfContracts')->truncate();

        \DB::table('TypeOfContracts')->insert(array(
            0 => array(
                'Id' => '40e36b39-cbbc-48fd-9123-3db6365dc6b2',
                'Code' => 'TV',
                'Type' => 'THU_VIEC',
                'Name' => 'Thử việc',
                'Year' => 1,
                'Month' => 12,
                'CreationTime' => '2021-04-19 08:55:04',
                'LastModificationTime' => '2021-04-19 08:55:04',
            ),
            1 => array(
                'Id' => '5c864427-ec29-4562-aed6-048d68ac28da',
                'Code' => 'CT',
                'Type' => 'CHINH_THUC',
                'Name' => 'Chính thức',
                'Year' => 3,
                'Month' => 36,
                'CreationTime' => '2021-04-19 08:55:28',
                'LastModificationTime' => '2021-04-19 08:55:28',
            ),
        ));

    }
}
