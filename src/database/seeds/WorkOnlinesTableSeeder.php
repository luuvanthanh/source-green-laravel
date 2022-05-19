
<?php

use Illuminate\Database\Seeder;

class WorkOnlinesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('WorkOnlines')->delete();
        
        \DB::table('WorkOnlines')->insert(array (
            0 => 
            array (
                'Id' => '4d3c5cbe-fa25-49d9-8549-97599db9bbc0',
                'StartDate' => '2022-05-11',
                'EndDate' => '2022-05-12',
                'AbsentTypeId' => '720ba36f-634e-4d5f-90c1-b83eece17e31',
                'Reason' => 'Chuyển nhà',
                'EmployeeId' => '9b1e5e80-7f00-4478-8ec9-10793ad202a4',
                'CreationTime' => '2022-05-10 07:52:46',
                'LastModificationTime' => '2022-05-10 08:31:02',
                'DeletionTime' => '2022-05-10 08:31:02',
            ),
            1 => 
            array (
                'Id' => '79e25a99-9da8-473d-bd4c-b7f0f3d6a777',
                'StartDate' => '2022-05-11',
                'EndDate' => '2022-05-12',
                'AbsentTypeId' => '720ba36f-634e-4d5f-90c1-b83eece17e31',
                'Reason' => '123',
                'EmployeeId' => '9b1e5e80-7f00-4478-8ec9-10793ad202a4',
                'CreationTime' => '2022-05-10 08:31:41',
                'LastModificationTime' => '2022-05-12 14:00:32',
                'DeletionTime' => '2022-05-12 14:00:32',
            ),
            2 => 
            array (
                'Id' => '248106a5-dee9-4d79-acb2-1bcb5ffeec2e',
                'StartDate' => '2022-05-11',
                'EndDate' => '2022-05-12',
                'AbsentTypeId' => '5010e623-7e74-4600-9c07-32420914384a',
                'Reason' => 'Chuyển nhà',
                'EmployeeId' => '9b1e5e80-7f00-4478-8ec9-10793ad202a4',
                'CreationTime' => '2022-05-11 01:20:07',
                'LastModificationTime' => '2022-05-12 14:00:37',
                'DeletionTime' => '2022-05-12 14:00:37',
            ),
            3 => 
            array (
                'Id' => '3e11a1d1-96f0-4d7c-92f8-f556c729e336',
                'StartDate' => '2022-05-11',
                'EndDate' => '2022-05-13',
                'AbsentTypeId' => '720ba36f-634e-4d5f-90c1-b83eece17e31',
                'Reason' => 'Công tac, làm việc online',
                'EmployeeId' => '9b1e5e80-7f00-4478-8ec9-10793ad202a4',
                'CreationTime' => '2022-05-11 01:40:41',
                'LastModificationTime' => '2022-05-12 14:01:54',
                'DeletionTime' => NULL,
            ),
        ));
        
        
    }
}