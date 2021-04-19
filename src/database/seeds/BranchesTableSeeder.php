<?php

use Illuminate\Database\Seeder;

class BranchesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('Branches')->delete();
        
        \DB::table('Branches')->insert(array (
            0 => 
            array (
                'Id' => '7fe24a89-8007-4541-b6b7-4f1582896861',
                'Code' => 'CS1',
                'Name' => 'Cơ sở 1',
                'Address' => NULL,
                'PhoneNumber' => '0955555555',
                'CreationTime' => '2021-04-19 08:42:48',
                'LastModificationTime' => '2021-04-19 08:42:48',
            ),
            1 => 
            array (
                'Id' => '8c4265dd-21c7-412b-b003-9a2a493d897a',
                'Code' => 'CS2',
                'Name' => 'Cơ sở 2',
                'Address' => NULL,
                'PhoneNumber' => '0955555555',
                'CreationTime' => '2021-04-19 08:42:56',
                'LastModificationTime' => '2021-04-19 08:42:56',
            ),
            2 => 
            array (
                'Id' => 'fd8184a1-c467-48e2-bf0f-7ffc7565551c',
                'Code' => 'CS3',
                'Name' => 'Cơ sở 3',
                'Address' => NULL,
                'PhoneNumber' => '0955555555',
                'CreationTime' => '2021-04-19 08:43:01',
                'LastModificationTime' => '2021-04-19 08:43:01',
            ),
        ));
        
        
    }
}