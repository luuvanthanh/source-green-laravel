<?php

use Illuminate\Database\Seeder;

class StudentObjectsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {

        \DB::table('fee.StudentObjects')->delete();

        \DB::table('fee.StudentObjects')->insert(array(
            0 => array(
                'Id' => '46408f4e-f4ea-49cc-8cf1-c261d759b4f4',
                'Name' => 'Học sinh hè',
                'Description' => 'Là học sinh tham gia khóa học hè của Trường',
                'IsGrateful' => true,
                'Code' => 'HSH',
                'CreationTime' => '2021-06-17 03:51:30',
                'LastModificationTime' => '2021-06-17 03:51:30',
            ),
            1 => array(
                'Id' => '0f271bc8-6e4f-494b-a65d-bb19a808fc95',
                'Name' => 'Học sinh mới',
                'Description' => 'Là học sinh chưa có tên trong danh sách của nhà trường',
                'IsGrateful' => false,
                'Code' => 'HSM',
                'CreationTime' => '2021-06-17 03:51:44',
                'LastModificationTime' => '2021-06-17 03:51:44',
            ),
            2 => array(
                'Id' => 'b247f838-64f6-42e1-a809-77d6f39e015d',
                'Name' => 'Học sinh cũ',
                'Description' => 'Là học sinh đóng đầy đủ học phí trước ngày 01/08/21',
                'IsGrateful' => true,
                'Code' => 'HSC',
                'CreationTime' => '2021-06-17 03:51:11',
                'LastModificationTime' => '2021-06-17 03:51:11',
            ),
        ));

    }
}
