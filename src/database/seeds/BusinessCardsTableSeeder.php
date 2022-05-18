<?php

use Illuminate\Database\Seeder;

class BusinessCardsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('BusinessCards')->delete();
        
        \DB::table('BusinessCards')->insert(array (
            0 => 
            array (
                'Id' => '6bdc75ca-fa24-4dd2-9d6d-93a4f55b537a',
                'EmployeeId' => '9b1e5e80-7f00-4478-8ec9-10793ad202a4',
                'AbsentTypeId' => '720ba36f-634e-4d5f-90c1-b83eece17e31',
                'StartDate' => '2022-05-11',
                'EndDate' => '2022-05-12',
                'Reason' => 'Chuyển nhà',
                'CreationTime' => '2022-05-11 02:26:43',
                'LastModificationTime' => '2022-05-11 02:28:06',
                'DeletionTime' => '2022-05-11 02:28:06',
            ),
            1 => 
            array (
                'Id' => 'd6835524-67ad-4dcb-b08d-434427a7d23f',
                'EmployeeId' => '9b1e5e80-7f00-4478-8ec9-10793ad202a4',
                'AbsentTypeId' => '720ba36f-634e-4d5f-90c1-b83eece17e31',
                'StartDate' => '2022-05-11',
                'EndDate' => '2022-05-12',
                'Reason' => 'Chuyển nhà',
                'CreationTime' => '2022-05-11 02:30:46',
                'LastModificationTime' => '2022-05-11 04:03:16',
                'DeletionTime' => '2022-05-11 04:03:16',
            ),
            2 => 
            array (
                'Id' => '99fb6005-b405-4795-9989-a97edd840c78',
                'EmployeeId' => '9b1e5e80-7f00-4478-8ec9-10793ad202a4',
                'AbsentTypeId' => '720ba36f-634e-4d5f-90c1-b83eece17e31',
                'StartDate' => '2022-05-12',
                'EndDate' => '2022-05-12',
                'Reason' => 'Đi công tác',
                'CreationTime' => '2022-05-11 04:08:15',
                'LastModificationTime' => '2022-05-12 14:00:04',
                'DeletionTime' => NULL,
            ),
            3 => 
            array (
                'Id' => '5e06d115-bb33-4f44-9db9-a0c6f8563fbc',
                'EmployeeId' => '9b1e5e80-7f00-4478-8ec9-10793ad202a4',
                'AbsentTypeId' => '720ba36f-634e-4d5f-90c1-b83eece17e31',
                'StartDate' => '2022-05-11',
                'EndDate' => '2022-05-12',
                'Reason' => 'Chuyển nhà',
                'CreationTime' => '2022-05-11 04:04:45',
                'LastModificationTime' => '2022-05-12 14:00:26',
                'DeletionTime' => '2022-05-12 14:00:26',
            ),
        ));
        
        
    }
}