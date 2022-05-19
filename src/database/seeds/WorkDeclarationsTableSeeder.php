<?php

use Illuminate\Database\Seeder;

class WorkDeclarationsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('WorkDeclarations')->delete();
        
        \DB::table('WorkDeclarations')->insert(array (
            0 => 
            array (
                'Id' => '59209a43-cf1b-40c3-bf40-eba1cc6e4924',
                'EmployeeId' => '21e460f7-351b-4f30-adce-7876cad3c572',
                'Date' => '2022-03-03',
                'Time' => '07:00:00',
                'CreationTime' => '2022-05-11 07:31:55',
                'LastModificationTime' => '2022-05-11 07:31:55',
                'DeletionTime' => NULL,
            ),
            1 => 
            array (
                'Id' => 'a223859e-f40c-4ac5-ad72-3018e1b59f4b',
                'EmployeeId' => '6846d859-deb4-43dc-9e0d-67a9b9e5a5f6',
                'Date' => '2022-05-20',
                'Time' => '14:30:00',
                'CreationTime' => '2022-05-11 07:37:09',
                'LastModificationTime' => '2022-05-11 07:37:09',
                'DeletionTime' => NULL,
            ),
            2 => 
            array (
                'Id' => '106a813b-b4d0-4475-bf7f-69ec744a58c5',
                'EmployeeId' => 'fba95caf-5e37-49cc-a5f8-46490e2e00e3',
                'Date' => '2022-05-13',
                'Time' => '06:45:00',
                'CreationTime' => '2022-05-11 07:44:13',
                'LastModificationTime' => '2022-05-11 07:44:13',
                'DeletionTime' => NULL,
            ),
            3 => 
            array (
                'Id' => 'c27dea4d-eb74-406a-8752-b94122d9383e',
                'EmployeeId' => '6846d859-deb4-43dc-9e0d-67a9b9e5a5f6',
                'Date' => '2022-05-25',
                'Time' => '16:30:00',
                'CreationTime' => '2022-05-11 09:30:34',
                'LastModificationTime' => '2022-05-11 09:30:34',
                'DeletionTime' => NULL,
            ),
        ));
        
        
    }
}