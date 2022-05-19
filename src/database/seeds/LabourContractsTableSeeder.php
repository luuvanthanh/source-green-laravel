
<?php

use Illuminate\Database\Seeder;

class LabourContractsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('LabourContracts')->delete();
        
        \DB::table('LabourContracts')->insert(array (
            0 => 
            array (
                'Id' => '1f43ada7-1f5f-4f34-80cb-3e1b382878c5',
                'ContractNumber' => '00332',
                'ContractDate' => '2022-05-10',
                'TypeOfContractId' => '35c5dd23-8385-4cf0-a960-e3ba835fe9ac',
                'EmployeeId' => '9b1e5e80-7f00-4478-8ec9-10793ad202a4',
                'Year' => 3,
                'Month' => 36,
                'DivisionId' => '1b014f07-cda8-40f9-bb67-64b013317501',
                'ContractFrom' => '2022-05-10',
                'ContractTo' => '2028-05-10',
                'PositionId' => '6a996897-502f-46d8-ac20-39d57ba46aaa',
                'Work' => 'IT',
                'WorkTime' => '8',
                'BranchId' => 'fb103c94-59f8-41a3-b11a-6cb57d221e01',
                'TotalAllowance' => '0',
                'BasicSalary' => '4000000',
                'IsSocialInsurance' => false,
                'IsEffect' => true,
                'File' => NULL,
                'CreationTime' => '2022-05-10 07:07:24',
                'LastModificationTime' => '2022-05-10 07:07:24',
                'DeletionTime' => NULL,
            ),
            1 => 
            array (
                'Id' => '8471e997-92be-46fb-8141-9c56a82226ae',
                'ContractNumber' => 'HĐ01',
                'ContractDate' => '2019-05-15',
                'TypeOfContractId' => '35c5dd23-8385-4cf0-a960-e3ba835fe9ac',
                'EmployeeId' => '46e8a4af-3fd3-4904-a04f-219859aa20e1',
                'Year' => 3,
                'Month' => 0,
                'DivisionId' => '6b1d1636-ba4c-4306-afac-d19d77f78bc7',
                'ContractFrom' => '2019-05-15',
                'ContractTo' => '2022-05-15',
                'PositionId' => '6a996897-502f-46d8-ac20-39d57ba46aaa',
                'Work' => 'Dạy học',
                'WorkTime' => '8',
                'BranchId' => 'fb103c94-59f8-41a3-b11a-6cb57d221e01',
                'TotalAllowance' => '0',
                'BasicSalary' => '0',
                'IsSocialInsurance' => false,
                'IsEffect' => true,
                'File' => NULL,
                'CreationTime' => '2022-05-12 13:26:00',
                'LastModificationTime' => '2022-05-12 13:30:34',
                'DeletionTime' => NULL,
            ),
        ));
        
        
    }
}