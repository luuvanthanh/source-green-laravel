<?php

use Illuminate\Database\Seeder;

class ShiftDetailsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('ShiftDetails')->delete();
        
        \DB::table('ShiftDetails')->insert(array (
            0 => 
            array (
                'Id' => '31c1d1cd-26e9-414c-8903-c34c84b2b569',
                'StartTime' => '03:30:00',
                'EndTime' => '23:00:00',
                'ShiftId' => '6063893f-2735-46f3-a6ac-caf06f5545ea',
                'Name' => 'Ca sáng',
                'Code' => 'CA_SANG',
                'AfterStart' => '17:45:00',
                'BeforeEnd' => '22:00:00',
                'CreationTime' => '2022-04-29 03:07:41',
                'LastModificationTime' => '2022-04-29 03:07:51',
                'DeletionTime' => '2022-04-29 03:07:51',
            ),
            1 => 
            array (
                'Id' => '9ae86796-8a91-46b9-8426-5a879b3f36b7',
                'StartTime' => '04:30:00',
                'EndTime' => '23:00:00',
                'ShiftId' => '6063893f-2735-46f3-a6ac-caf06f5545ea',
                'Name' => 'Ca chiều',
                'Code' => 'CA_CHIEU',
                'AfterStart' => '09:30:00',
                'BeforeEnd' => '17:15:00',
                'CreationTime' => '2022-04-29 03:07:41',
                'LastModificationTime' => '2022-04-29 03:07:51',
                'DeletionTime' => '2022-04-29 03:07:51',
            ),
            2 => 
            array (
                'Id' => 'd57fb7fb-f6b2-4f1a-a1ac-ef8139762edb',
                'StartTime' => '05:45:00',
                'EndTime' => '10:45:00',
                'ShiftId' => 'e9a69785-0aea-436a-b6a7-45e984d7ee98',
                'Name' => 'Ca sáng',
                'Code' => 'CA_SANG',
                'AfterStart' => '08:45:00',
                'BeforeEnd' => '07:45:00',
                'CreationTime' => '2022-04-29 03:06:38',
                'LastModificationTime' => '2022-04-29 03:31:31',
                'DeletionTime' => '2022-04-29 03:31:31',
            ),
            3 => 
            array (
                'Id' => '613c8e7b-0271-43c2-b449-ea39520bda82',
                'StartTime' => '04:00:00',
                'EndTime' => '10:00:59',
                'ShiftId' => 'e9a69785-0aea-436a-b6a7-45e984d7ee98',
                'Name' => 'Ca chiều',
                'Code' => 'CA_CHIEU',
                'AfterStart' => '06:00:00',
                'BeforeEnd' => '09:00:59',
                'CreationTime' => '2022-04-29 03:06:38',
                'LastModificationTime' => '2022-04-29 03:31:31',
                'DeletionTime' => '2022-04-29 03:31:31',
            ),
            4 => 
            array (
                'Id' => 'a9a89981-9b9b-438f-9c9c-d609f717c20a',
                'StartTime' => '00:00:00',
                'EndTime' => '23:00:00',
                'ShiftId' => '03cc51e4-31a9-472f-8816-a172e3ee006f',
                'Name' => 'Ca sáng',
                'Code' => 'CA_SANG',
                'AfterStart' => '04:30:00',
                'BeforeEnd' => '07:30:00',
                'CreationTime' => '2022-04-29 03:29:12',
                'LastModificationTime' => '2022-04-29 03:32:48',
                'DeletionTime' => '2022-04-29 03:32:48',
            ),
            5 => 
            array (
                'Id' => '838c848e-68e2-437b-b377-6a136bb4cc2b',
                'StartTime' => '00:00:00',
                'EndTime' => '23:00:00',
                'ShiftId' => '03cc51e4-31a9-472f-8816-a172e3ee006f',
                'Name' => 'Ca chiều',
                'Code' => 'CA_CHIEU',
                'AfterStart' => '02:15:00',
                'BeforeEnd' => '10:15:00',
                'CreationTime' => '2022-04-29 03:29:12',
                'LastModificationTime' => '2022-04-29 03:32:48',
                'DeletionTime' => '2022-04-29 03:32:48',
            ),
            6 => 
            array (
                'Id' => '381cc3f4-8e4c-4f50-90bb-b52681665d1f',
                'StartTime' => '02:30:00',
                'EndTime' => '23:30:00',
                'ShiftId' => 'c0df8690-8686-4aa5-bd6f-f76749a7b4d6',
                'Name' => 'Ca sáng',
                'Code' => 'CA_SANG',
                'AfterStart' => '02:45:00',
                'BeforeEnd' => '03:45:00',
                'CreationTime' => '2022-04-29 04:05:19',
                'LastModificationTime' => '2022-04-29 04:05:19',
                'DeletionTime' => NULL,
            ),
            7 => 
            array (
                'Id' => 'f0148219-5dcc-4283-8f44-8e5ee17ebdf7',
                'StartTime' => '02:30:00',
                'EndTime' => '23:15:00',
                'ShiftId' => 'c0df8690-8686-4aa5-bd6f-f76749a7b4d6',
                'Name' => 'Ca chiều',
                'Code' => 'CA_CHIEU',
                'AfterStart' => '04:45:00',
                'BeforeEnd' => '11:30:00',
                'CreationTime' => '2022-04-29 04:05:19',
                'LastModificationTime' => '2022-04-29 04:05:19',
                'DeletionTime' => NULL,
            ),
            8 => 
            array (
                'Id' => '8ca2eb1c-f02e-4e4f-b58b-50480aa3e482',
                'StartTime' => '00:15:00',
                'EndTime' => '09:30:00',
                'ShiftId' => '2369f6bd-5a8d-4b7d-9a73-c288ca38bc1f',
                'Name' => 'Ca sáng',
                'Code' => 'CA_SANG',
                'AfterStart' => '02:30:00',
                'BeforeEnd' => '06:15:00',
                'CreationTime' => '2022-04-29 04:23:49',
                'LastModificationTime' => '2022-04-29 04:23:49',
                'DeletionTime' => NULL,
            ),
            9 => 
            array (
                'Id' => 'e2ea34ac-7703-4981-8014-3f003cdc4eeb',
                'StartTime' => '01:15:00',
                'EndTime' => '23:00:00',
                'ShiftId' => '2369f6bd-5a8d-4b7d-9a73-c288ca38bc1f',
                'Name' => 'Ca chiều',
                'Code' => 'CA_CHIEU',
                'AfterStart' => '03:30:00',
                'BeforeEnd' => '12:45:00',
                'CreationTime' => '2022-04-29 04:23:49',
                'LastModificationTime' => '2022-04-29 04:23:49',
                'DeletionTime' => NULL,
            ),
            10 => 
            array (
                'Id' => 'f2a661ab-e7e0-44f1-b488-7f8eb9fc6783',
                'StartTime' => '00:00:00',
                'EndTime' => '23:00:00',
                'ShiftId' => 'e67e560f-caff-40eb-952e-ae833b535440',
                'Name' => 'Ca sáng',
                'Code' => 'CA_SANG',
                'AfterStart' => '01:15:00',
                'BeforeEnd' => '06:15:00',
                'CreationTime' => '2022-04-29 03:32:42',
                'LastModificationTime' => '2022-04-29 04:24:04',
                'DeletionTime' => '2022-04-29 04:24:04',
            ),
            11 => 
            array (
                'Id' => '1bbe76a4-7112-42cf-9e18-1a54edeec4f2',
                'StartTime' => '00:00:00',
                'EndTime' => '23:00:00',
                'ShiftId' => 'e67e560f-caff-40eb-952e-ae833b535440',
                'Name' => 'Ca chiều',
                'Code' => 'CA_CHIEU',
                'AfterStart' => '04:30:00',
                'BeforeEnd' => '10:30:00',
                'CreationTime' => '2022-04-29 03:32:42',
                'LastModificationTime' => '2022-04-29 04:24:04',
                'DeletionTime' => '2022-04-29 04:24:04',
            ),
            12 => 
            array (
                'Id' => '9fe1e0ea-d345-44a5-beb8-f3dbb286f221',
                'StartTime' => '07:30:00',
                'EndTime' => '11:30:00',
                'ShiftId' => 'a5a5fbaa-79c3-443c-aaeb-b96662f8c958',
                'Name' => 'Ca sáng',
                'Code' => 'CA_SANG',
                'AfterStart' => '07:45:00',
                'BeforeEnd' => '11:15:00',
                'CreationTime' => '2022-05-12 13:35:51',
                'LastModificationTime' => '2022-05-12 13:35:51',
                'DeletionTime' => NULL,
            ),
            13 => 
            array (
                'Id' => '4b18e3ee-6acc-410d-9bbb-49193c20f113',
                'StartTime' => '13:00:00',
                'EndTime' => '17:00:00',
                'ShiftId' => 'a5a5fbaa-79c3-443c-aaeb-b96662f8c958',
                'Name' => 'Ca chiều',
                'Code' => 'CA_CHIEU',
                'AfterStart' => '13:15:00',
                'BeforeEnd' => '16:45:00',
                'CreationTime' => '2022-05-12 13:35:51',
                'LastModificationTime' => '2022-05-12 13:35:51',
                'DeletionTime' => NULL,
            ),
        ));
        
        
    }
}