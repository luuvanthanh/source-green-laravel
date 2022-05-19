
<?php

use Illuminate\Database\Seeder;

class TypeOfContractsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('TypeOfContracts')->delete();
        
        \DB::table('TypeOfContracts')->insert(array (
            0 => 
            array (
                'Id' => '35c5dd23-8385-4cf0-a960-e3ba835fe9ac',
                'Code' => 'CT',
                'Type' => 'HOP_DONG',
                'Name' => 'Chính thức',
                'Year' => 3,
                'Month' => 36,
                'IsUnlimited' => false,
                'CreationTime' => '2022-03-30 07:58:26',
                'LastModificationTime' => '2022-03-30 07:58:26',
                'DeletionTime' => NULL,
            ),
        ));
        
        
    }
}