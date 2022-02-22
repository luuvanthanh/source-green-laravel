<?php

use Illuminate\Database\Seeder;

class ParameterTaxsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('ParameterTaxs')->delete();
        
        \DB::table('ParameterTaxs')->insert(array (
            0 => 
            array (
                'Id' => '2ab06410-8a96-41aa-bcea-39e281d07d66',
                'Name' => 'Cấp 1',
                'From' => 0,
                'To' => 5000000,
                'Fax' => 5,
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-08-23 07:59:00',
                'LastModificationTime' => '2021-08-23 07:59:00',
                'Code' => 'CAP_1',
            ),
            1 => 
            array (
                'Id' => 'e53477d3-9507-4fa2-ba36-e2fd751607c4',
                'Name' => 'Cấp 2',
                'From' => 5000000,
                'To' => 10000000,
                'Fax' => 10,
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-08-23 07:59:04',
                'LastModificationTime' => '2021-08-23 07:59:04',
                'Code' => 'CAP_2',
            ),
            2 => 
            array (
                'Id' => '84490ee3-75eb-4306-9e5e-f1d5a6065d51',
                'Name' => 'Cấp 3',
                'From' => 10000000,
                'To' => 18000000,
                'Fax' => 15,
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-08-23 07:59:06',
                'LastModificationTime' => '2021-08-23 07:59:06',
                'Code' => 'CAP_3',
            ),
            3 => 
            array (
                'Id' => 'f9bd71af-1878-42cc-9678-b6e8a05169bf',
                'Name' => 'Cấp 4',
                'From' => 18000000,
                'To' => 32000000,
                'Fax' => 20,
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-08-23 07:59:11',
                'LastModificationTime' => '2021-08-23 07:59:11',
                'Code' => 'CAP_4',
            ),
            4 => 
            array (
                'Id' => '9fcca60b-4727-4733-908e-91b047cce9e9',
                'Name' => 'Cấp 5',
                'From' => 32000000,
                'To' => 52000000,
                'Fax' => 25,
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-08-23 07:59:16',
                'LastModificationTime' => '2021-08-23 07:59:16',
                'Code' => 'CAP_5',
            ),
            5 => 
            array (
                'Id' => 'dd715476-7def-4001-b4f2-d26e779c7039',
                'Name' => 'Cấp 6',
                'From' => 52000000,
                'To' => 82000000,
                'Fax' => 30,
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-08-23 07:59:22',
                'LastModificationTime' => '2021-08-23 07:59:22',
                'Code' => 'CAP_6',
            ),
        ));
        
        
    }
}