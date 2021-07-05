<?php

use Illuminate\Database\Seeder;

class ClassTypesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {

        \DB::table('fee.ClassTypes')->truncate();

        \DB::table('fee.ClassTypes')->insert(array(
            0 => array(
                'Id' => '4da1984f-50f2-4729-a23d-1dd14efd1912',
                'Name' => '15-24 tháng (tuổi)',
                'Code' => 'L1',
                'From' => '15',
                'To' => '24',
                'CreationTime' => '2021-04-19 08:42:48',
                'LastModificationTime' => '2021-04-19 08:42:48',
            ),
            1 => array(
                'Id' => '99eda940-4f43-4f10-ae7d-6eaf065b5519',
                'Name' => '24-36 tháng (tuổi)',
                'Code' => 'L2',
                'From' => '24',
                'To' => '36',
                'CreationTime' => '2021-04-19 08:43:48',
                'LastModificationTime' => '2021-04-19 08:43:48',
            ),
            2 => array(
                'Id' => '8d5f33b8-520b-4eb5-8d9d-c900c00f1ec7',
                'Name' => '36-72 tháng (tuổi)',
                'Code' => 'L3',
                'From' => '36',
                'To' => '72',
                'CreationTime' => '2021-04-19 08:44:48',
                'LastModificationTime' => '2021-04-19 08:44:48',
            ),
        ));

    }
}
