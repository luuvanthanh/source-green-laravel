<?php

use Illuminate\Database\Seeder;

class PositionLevelsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('PositionLevels')->delete();
        
        \DB::table('PositionLevels')->insert(array (
            0 => 
            array (
                'Id' => '4007205e-5142-44a8-b0bf-e7031ee8157e',
                'EmployeeId' => '9b1e5e80-7f00-4478-8ec9-10793ad202a4',
                'BranchId' => 'fb103c94-59f8-41a3-b11a-6cb57d221e01',
                'PositionId' => '6a996897-502f-46d8-ac20-39d57ba46aaa',
                'DivisionId' => '1b014f07-cda8-40f9-bb67-64b013317501',
                'StartDate' => '2022-05-10',
                'EndDate' => NULL,
                'Type' => 'LABOUR',
                'ModelId' => '1f43ada7-1f5f-4f34-80cb-3e1b382878c5',
                'ModelType' => 'GGPHP\\Profile\\Models\\LabourContract',
                'CreationTime' => '2022-05-10 07:07:24',
                'LastModificationTime' => '2022-05-10 07:07:24',
                'DeletionTime' => NULL,
            ),
            1 => 
            array (
                'Id' => 'f54b09aa-5859-4ae0-a44b-e237201a3770',
                'EmployeeId' => '46e8a4af-3fd3-4904-a04f-219859aa20e1',
                'BranchId' => 'fb103c94-59f8-41a3-b11a-6cb57d221e01',
                'PositionId' => '6a996897-502f-46d8-ac20-39d57ba46aaa',
                'DivisionId' => '6b1d1636-ba4c-4306-afac-d19d77f78bc7',
                'StartDate' => '2019-05-15',
                'EndDate' => NULL,
                'Type' => 'LABOUR',
                'ModelId' => '8471e997-92be-46fb-8141-9c56a82226ae',
                'ModelType' => 'GGPHP\\Profile\\Models\\LabourContract',
                'CreationTime' => '2022-05-12 13:26:00',
                'LastModificationTime' => '2022-05-12 13:29:49',
                'DeletionTime' => NULL,
            ),
        ));
        
        
    }
}