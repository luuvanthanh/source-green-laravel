<?php

use Illuminate\Database\Seeder;

class StatusParentPotentialsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        \DB::table('status_parent_potentials')->delete();

        \DB::table('status_parent_potentials')->insert(array(
            0 =>
            array(
                'id' => '02e51ee0-a71e-4c46-81cf-8b0a6dd86a55',
                'code' => 'TTN2',
                'name' => 'Sale online',
                'created_at' => '2021-10-06 04:59:11',
                'updated_at' => '2021-10-06 04:59:11',
                'deleted_at' => NULL,
                'use' => true,
                'status_hard' => true,
            ),
            1 =>
            array(
                'id' => '1c12bf6c-c342-4bc0-852e-9afeb302803f',
                'code' => 'TTN3',
                'name' => 'Tham quan',
                'created_at' => '2021-10-06 04:59:20',
                'updated_at' => '2021-10-06 04:59:20',
                'deleted_at' => NULL,
                'use' => true,
                'status_hard' => true,
            ),
            2 =>
            array(
                'id' => '23201bb3-a9ce-4b6a-9219-92b30b71a1db',
                'code' => 'TTN4',
                'name' => 'Đăng ký nhập học',
                'created_at' => '2021-10-06 04:59:30',
                'updated_at' => '2021-10-22 03:01:25',
                'deleted_at' => NULL,
                'use' => false,
                'status_hard' => true,
            ),
            3 =>
            array(
                'id' => '88e4da10-d9ff-4de6-881c-afc973dcd59f',
                'code' => 'TTN5',
                'name' => 'Test đầu vào',
                'created_at' => '2021-10-22 03:02:01',
                'updated_at' => '2021-10-22 03:02:01',
                'deleted_at' => NULL,
                'use' => false,
                'status_hard' => true,
            )
        ));
    }
}
