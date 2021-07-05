<?php

use Illuminate\Database\Seeder;

class PositionsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {

        \DB::table('Positions')->truncate();

        \DB::table('Positions')->insert(array(
            0 => array(
                'Id' => '9cf09e33-acb6-46ba-8f9f-d017b5846445',
                'Code' => 'GV',
                'Name' => 'Giáo viên',
                'CreationTime' => '2021-04-19 08:44:00',
                'LastModificationTime' => '2021-04-19 08:44:00',
            ),
            1 => array(
                'Id' => '5b43c61c-83a8-4e25-ac5b-2cc5c96b1694',
                'Code' => 'KT',
                'Name' => 'Kế toán trưởng',
                'CreationTime' => '2021-04-19 08:44:15',
                'LastModificationTime' => '2021-04-19 08:44:15',
            ),
        ));

    }
}
