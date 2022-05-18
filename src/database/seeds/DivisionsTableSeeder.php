
<?php

use Illuminate\Database\Seeder;

class DivisionsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('Divisions')->delete();
        
        \DB::table('Divisions')->insert(array (
            0 => 
            array (
                'Id' => 'caa7f58d-c64d-4bb7-89dc-4d9a8f3de26b',
                'Code' => 'PB02',
                'Name' => 'Phòng ban 02',
                'Note' => 'Ghi chú cho phòng ban số 1',
                'CreationTime' => '2022-03-21 02:06:29',
                'LastModificationTime' => '2022-03-21 02:06:36',
                'DeletionTime' => '2022-03-21 02:06:36',
            ),
            1 => 
            array (
                'Id' => '17e25906-81e9-43b0-ab97-9ebb78502c4e',
                'Code' => 'MKT',
                'Name' => 'Marketing',
                'Note' => 'Marketing',
                'CreationTime' => '2022-03-21 02:06:11',
                'LastModificationTime' => '2022-03-29 03:08:00',
                'DeletionTime' => NULL,
            ),
            2 => 
            array (
                'Id' => '1b014f07-cda8-40f9-bb67-64b013317501',
                'Code' => 'BV',
                'Name' => 'Bảo vệ',
                'Note' => 'Bảo vệ',
                'CreationTime' => '2022-03-29 03:08:25',
                'LastModificationTime' => '2022-03-29 03:08:25',
                'DeletionTime' => NULL,
            ),
            3 => 
            array (
                'Id' => 'f04038f1-75be-479b-bcc6-0777356478b2',
                'Code' => 'HC',
                'Name' => 'Hành chánh',
                'Note' => 'Hành chánh',
                'CreationTime' => '2022-03-29 03:08:58',
                'LastModificationTime' => '2022-03-29 03:08:58',
                'DeletionTime' => NULL,
            ),
            4 => 
            array (
                'Id' => '7d25ac82-4395-4b7c-bb95-e76cf4df79cd',
                'Code' => 'IT',
                'Name' => 'IT',
                'Note' => 'IT',
                'CreationTime' => '2022-03-29 03:09:17',
                'LastModificationTime' => '2022-03-29 03:09:17',
                'DeletionTime' => NULL,
            ),
            5 => 
            array (
                'Id' => 'cb2b0220-c9e0-4a00-a936-f4f9477e8acb',
                'Code' => 'KT',
                'Name' => 'Kế toán',
                'Note' => 'Kế toán',
                'CreationTime' => '2022-03-29 03:10:42',
                'LastModificationTime' => '2022-03-29 03:10:42',
                'DeletionTime' => NULL,
            ),
            6 => 
            array (
                'Id' => '850b946b-8857-41cc-9bbe-cdf880ad1ef9',
                'Code' => 'HP',
                'Name' => 'Hiệu phó',
                'Note' => 'Hiệu phó',
                'CreationTime' => '2022-03-29 03:11:04',
                'LastModificationTime' => '2022-03-29 03:12:28',
                'DeletionTime' => '2022-03-29 03:12:28',
            ),
            7 => 
            array (
                'Id' => '42da7d75-4e18-457d-9ccf-2d76cd300df2',
                'Code' => 'HT',
                'Name' => 'Hiệu trưởng',
                'Note' => 'Hiệu trưởng',
                'CreationTime' => '2022-03-29 03:09:38',
                'LastModificationTime' => '2022-03-29 03:12:31',
                'DeletionTime' => '2022-03-29 03:12:31',
            ),
            8 => 
            array (
                'Id' => 'be6984c1-eb03-4386-afaf-5ed5075cd092',
                'Code' => 'NK',
                'Name' => 'Ngoại khoá',
                'Note' => 'Ngoại khoá',
                'CreationTime' => '2022-03-29 03:08:14',
                'LastModificationTime' => '2022-03-29 03:12:40',
                'DeletionTime' => '2022-03-29 03:12:40',
            ),
            9 => 
            array (
                'Id' => '6b1d1636-ba4c-4306-afac-d19d77f78bc7',
                'Code' => 'CM',
                'Name' => 'Chuyên môn',
                'Note' => 'Chuyên môn',
                'CreationTime' => '2022-03-29 03:13:09',
                'LastModificationTime' => '2022-03-29 03:13:09',
                'DeletionTime' => NULL,
            ),
            10 => 
            array (
                'Id' => '104fe7e0-d6e4-4d47-847c-6081ed6d9941',
                'Code' => 'CEO',
                'Name' => 'CEO',
                'Note' => 'CEO',
                'CreationTime' => '2022-03-29 03:10:31',
                'LastModificationTime' => '2022-03-29 03:13:55',
                'DeletionTime' => '2022-03-29 03:13:55',
            ),
        ));
        
        
    }
}