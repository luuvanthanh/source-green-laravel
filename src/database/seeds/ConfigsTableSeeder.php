<?php

use Illuminate\Database\Seeder;

class ConfigsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {

        \DB::table('Configs')->truncate();

        \DB::table('Configs')->insert(array(
            0 => array(
                'Id' => '6e144600-730f-4144-a8a4-bb2bc2d9fe87',
                'Name' => 'Thời gian cho phép trước thời gian bắt đầu ca',
                'Code' => 'DURATION_ALLOW_BEFORE_STARTTIME',
                'Value' => '60',
                'CreationTime' => '2021-04-19 08:59:26',
                'LastModificationTime' => '2021-04-19 08:59:26',
            ),
            1 => array(
                'Id' => '56f6747d-d3b4-4e3e-8b26-dbd3c68e4d6d',
                'Name' => 'Thời gian cho phép sau thời gian bắt đầu ca',
                'Code' => 'DURATION_ALLOW_AFTERT_STARTTIME',
                'Value' => '90',
                'CreationTime' => '2021-04-19 08:59:38',
                'LastModificationTime' => '2021-04-19 08:59:38',
            ),
            2 => array(
                'Id' => 'de652d6e-04a9-4f52-b4ea-da769e75c8f6',
                'Name' => 'Thời gian cho phép trước thời gian kết thúc ca',
                'Code' => 'DURATION_ALLOW_BEFORE_ENDTIME',
                'Value' => '90',
                'CreationTime' => '2021-04-19 08:59:54',
                'LastModificationTime' => '2021-04-19 08:59:54',
            ),
            3 => array(
                'Id' => '888ca9e2-8b89-4dc6-8b73-f5ce4baa907b',
                'Name' => 'Thời gian cho phép sau thời gian kết thúc ca',
                'Code' => 'DURATION_ALLOW_AFTERT_ENDTIME',
                'Value' => '120',
                'CreationTime' => '2021-04-19 09:00:07',
                'LastModificationTime' => '2021-04-19 09:00:07',
            ),
            4 => array(
                'Id' => 'df6d854a-7935-452d-ad2d-c95006a05382',
                'Name' => 'Thời gian cho phép trước thời gian kết thúc ca thứ 2 của ca gãy',
                'Code' => 'DURATION_ALLOW_BEFORE_STARTTIME_SECOND',
                'Value' => '90',
                'CreationTime' => '2021-04-19 09:00:23',
                'LastModificationTime' => '2021-04-19 09:00:23',
            ),
            5 => array(
                'Id' => '26b41794-744b-4153-8300-6ceb1492654d',
                'Name' => 'Thời gian cho phép đi trễ',
                'Code' => 'TIMEKEEPING_DEADLINE',
                'Value' => '1',
                'CreationTime' => '2021-04-19 09:00:35',
                'LastModificationTime' => '2021-04-19 09:00:35',
            ),
            6 => array(
                'Id' => 'fe974542-7b21-482a-bc91-027ae559b53c',
                'Name' => 'Thời gian tự động duyệt về sớm',
                'Code' => 'TIME_LATE',
                'Value' => '3600',
                'CreationTime' => '2021-04-19 09:00:48',
                'LastModificationTime' => '2021-04-19 09:00:48',
            ),
        ));

    }
}
