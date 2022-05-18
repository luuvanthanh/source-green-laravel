

<?php

use Illuminate\Database\Seeder;

class AbsentTypesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('AbsentTypes')->delete();
        
        \DB::table('AbsentTypes')->insert(array (
            0 => 
            array (
                'Id' => '008a6a90-523b-47ce-a039-dc12cadb5d60',
                'Name' => 'test',
                'Status' => 'ON',
                'Type' => 'ABSENT',
                'Code' => 'TEST',
                'IsTimeKeeping' => true,
                'CreationTime' => '2022-04-29 08:19:19',
                'LastModificationTime' => '2022-04-29 08:24:56',
                'DeletionTime' => '2022-04-29 08:24:56',
            ),
            1 => 
            array (
                'Id' => 'b754e785-a5b9-45fa-9371-3708b13a908b',
                'Name' => 'Nghỉ có phép',
                'Status' => 'ON',
                'Type' => 'ABSENT',
                'Code' => 'F',
                'IsTimeKeeping' => true,
                'CreationTime' => '2022-05-12 13:56:05',
                'LastModificationTime' => '2022-05-12 13:56:05',
                'DeletionTime' => NULL,
            ),
            2 => 
            array (
                'Id' => 'c17d5ae7-cb7b-41c5-b4da-8d9610a53798',
                'Name' => 'Nghỉ không phép',
                'Status' => 'ON',
                'Type' => 'ABSENT',
                'Code' => 'K',
                'IsTimeKeeping' => false,
                'CreationTime' => '2022-05-12 13:56:44',
                'LastModificationTime' => '2022-05-12 13:56:44',
                'DeletionTime' => NULL,
            ),
            3 => 
            array (
                'Id' => '720ba36f-634e-4d5f-90c1-b83eece17e31',
                'Name' => 'Công tác',
                'Status' => 'ON',
                'Type' => 'BUSINESS_TRAVEL',
                'Code' => 'CT',
                'IsTimeKeeping' => true,
                'CreationTime' => '2022-04-29 08:22:55',
                'LastModificationTime' => '2022-05-12 13:58:53',
                'DeletionTime' => NULL,
            ),
            4 => 
            array (
                'Id' => '5010e623-7e74-4600-9c07-32420914384a',
                'Name' => 'Đi ra ngoài',
                'Status' => 'ON',
                'Type' => 'GO_OUT',
                'Code' => 'DRN',
                'IsTimeKeeping' => false,
                'CreationTime' => '2022-04-29 08:41:09',
                'LastModificationTime' => '2022-05-12 13:59:04',
                'DeletionTime' => NULL,
            ),
        ));
        
        
    }
}