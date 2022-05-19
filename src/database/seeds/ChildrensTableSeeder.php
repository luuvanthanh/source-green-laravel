
<?php

use Illuminate\Database\Seeder;

class ChildrensTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('Childrens')->delete();
        
        \DB::table('Childrens')->insert(array (
            0 => 
            array (
                'Id' => '0739b4c5-de62-4876-bbe9-088d161900e3',
                'EmployeeId' => '9148317a-df19-4eb7-b5ae-1915031c6388',
                'FullName' => 'Mai Trương Thanh Vân',
                'Birthday' => '1994-04-18',
                'Status' => 'ON',
                'Gender' => 'Nữ',
                'Relationship' => 'Chị',
                'IsDependentPerson' => true,
                'TaxCode' => '0001',
                'DedectionTimeFrom' => '2022-05-12',
                'DedectionTimeTo' => '2023-05-18',
                'FileImage' => NULL,
                'CreationTime' => '2022-05-12 13:52:11',
                'LastModificationTime' => '2022-05-12 13:52:11',
                'DeletionTime' => NULL,
            ),
        ));
        
        
    }
}