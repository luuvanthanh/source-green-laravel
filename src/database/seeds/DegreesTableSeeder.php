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

        \DB::table('Degrees')->truncate();

        \DB::table('Degrees')->insert(array(
            0 => array(
                'Id' => '2cdb33d4-5249-4b4a-9b9d-6dbf2c0cd573',
                'Code' => 'KS',
                'Name' => 'Kỹ sư',
                'CreationTime' => '2021-04-19 08:47:22',
                'LastModificationTime' => '2021-04-19 08:47:22',
            ),
            1 => array(
                'Id' => '7c4abe20-be91-427c-94a2-43ee24ffe4ab',
                'Code' => 'CĐ',
                'Name' => 'Cao đẳng',
                'CreationTime' => '2021-04-19 08:47:32',
                'LastModificationTime' => '2021-04-19 08:47:32',
            ),
        ));

    }
}
