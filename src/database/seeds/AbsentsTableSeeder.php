
<?php

use Illuminate\Database\Seeder;

class AbsentsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('Absents')->delete();
        
        \DB::table('Absents')->insert(array (
            0 => 
            array (
                'Id' => '20383e13-4a19-41a1-8d63-7b28cb718dc4',
                'EmployeeId' => '21e460f7-351b-4f30-adce-7876cad3c572',
                'AbsentTypeId' => 'b754e785-a5b9-45fa-9371-3708b13a908b',
                'AbsentReasonId' => NULL,
                'StartDate' => '2022-05-13',
                'EndDate' => '2022-05-13',
                'Reason' => 'Có việc gia đình',
                'CreationTime' => '2022-05-12 13:57:53',
                'LastModificationTime' => '2022-05-12 13:57:53',
                'DeletionTime' => NULL,
            ),
            1 => 
            array (
                'Id' => 'bdfffd8a-c43e-480d-9296-62ab3b13782f',
                'EmployeeId' => '9b1e5e80-7f00-4478-8ec9-10793ad202a4',
                'AbsentTypeId' => '720ba36f-634e-4d5f-90c1-b83eece17e31',
                'AbsentReasonId' => NULL,
                'StartDate' => '2022-05-13',
                'EndDate' => '2022-05-16',
                'Reason' => 'Chuyển nhà',
                'CreationTime' => '2022-05-11 04:17:19',
                'LastModificationTime' => '2022-05-12 13:58:07',
                'DeletionTime' => '2022-05-12 13:58:07',
            ),
            2 => 
            array (
                'Id' => '10925664-5b4d-47e4-a3bb-a5f75647c991',
                'EmployeeId' => '9b1e5e80-7f00-4478-8ec9-10793ad202a4',
                'AbsentTypeId' => '720ba36f-634e-4d5f-90c1-b83eece17e31',
                'AbsentReasonId' => NULL,
                'StartDate' => '2022-05-11',
                'EndDate' => '2022-05-12',
                'Reason' => 'aa',
                'CreationTime' => '2022-05-11 02:38:51',
                'LastModificationTime' => '2022-05-12 13:58:10',
                'DeletionTime' => '2022-05-12 13:58:10',
            ),
        ));
        
        
    }
}