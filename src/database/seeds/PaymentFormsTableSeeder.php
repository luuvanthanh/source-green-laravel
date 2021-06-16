<?php

use Illuminate\Database\Seeder;

class PaymentFormsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {

        \DB::table('fee.PaymentForms')->delete();

        \DB::table('fee.PaymentForms')->insert(array(
            0 => array(
                'Id' => 'a217273e-fa2d-4b32-93e3-ccccce4a373c',
                'Name' => 'Theo năm',
                'Code' => 'NAM',
                'Type' => 'CD',
                'IsSemester' => false,
                'CreationTime' => '2021-06-17 03:12:39',
                'LastModificationTime' => '2021-06-17 03:12:39',
            ),
            1 => array(
                'Id' => '082be001-7076-4235-a650-93b8c916830c',
                'Name' => 'Theo học kỳ 1',
                'Code' => 'HOCKY1',
                'Type' => 'CD',
                'IsSemester' => true,
                'CreationTime' => '2021-06-17 03:13:05',
                'LastModificationTime' => '2021-06-17 03:13:05',
            ),
            2 => array(
                'Id' => 'df52d6e9-9878-4911-934e-4148212b323b',
                'Name' => 'Theo học kỳ 2',
                'Code' => 'HOCKY2',
                'Type' => 'CD',
                'IsSemester' => true,
                'CreationTime' => '2021-06-17 03:13:12',
                'LastModificationTime' => '2021-06-17 03:13:12',
            ),
            3 => array(
                'Id' => 'ed332a41-fe0a-4a42-994a-accf1ebcbd92',
                'Name' => 'Theo tháng',
                'Code' => 'HOCKY2',
                'Type' => 'THANG',
                'IsSemester' => true,
                'CreationTime' => '2021-06-17 03:19:36',
                'LastModificationTime' => '2021-06-17 03:19:36',
            ),
        ));

    }
}
