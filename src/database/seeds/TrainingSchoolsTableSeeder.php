<?php

use Illuminate\Database\Seeder;

class TrainingSchoolsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('TrainingSchools')->delete();
        
        \DB::table('TrainingSchools')->insert(array (
            0 => 
            array (
                'Id' => 'f2c7d6b2-48cd-49f4-bb20-b3f9dc52c71a',
                'Code' => 'DHSPHCM',
                'Name' => 'Đại Học Sư Phạm TP.HCM',
                'Address' => '40 Hoàng Thiện Thuật ,TP Hồ Chí Minh',
                'Category' => '0',
                'CreationTime' => '2022-03-23 03:37:02',
                'LastModificationTime' => '2022-03-29 03:01:30',
                'DeletionTime' => NULL,
            ),
            1 => 
            array (
                'Id' => 'd817f335-3f99-4744-86ae-4f83d9aad4e6',
                'Code' => 'DHBKHCM',
                'Name' => 'Đại học Bách Khoa TPHCM',
                'Address' => '30 Tôn Đức Thắng , TP Hồ Chí Minh',
                'Category' => '0',
                'CreationTime' => '2022-03-29 03:02:02',
                'LastModificationTime' => '2022-03-29 03:02:02',
                'DeletionTime' => NULL,
            ),
            2 => 
            array (
                'Id' => 'c47de76b-f752-4233-9204-6a812e5cc163',
                'Code' => 'KHXH & NV',
                'Name' => 'Trường Đại học Khoa học xã hội và Nhân văn TPHCM',
                'Address' => '60 Võ Văn Kiệt , TP Hồ Chí Minh',
                'Category' => '0',
                'CreationTime' => '2022-03-29 03:02:31',
                'LastModificationTime' => '2022-03-29 03:02:31',
                'DeletionTime' => NULL,
            ),
        ));
        
        
    }
}