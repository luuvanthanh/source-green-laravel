<?php

use Illuminate\Database\Seeder;

class LateEarlyTimeConfigsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('LateEarlyTimeConfigs')->delete();
        
        \DB::table('LateEarlyTimeConfigs')->insert(array (
            0 => 
            array (
                'Id' => 'd3be04e7-3593-49cd-8bf5-106a04481d57',
                'FromTime' => '00:00:00',
                'ToTime' => '00:10:59',
                'Description' => '00\' - 10\'',
                'Type' => 'LATE',
                'CreationTime' => '2021-04-19 08:50:55',
                'LastModificationTime' => '2021-04-19 08:50:55',
            ),
            1 => 
            array (
                'Id' => 'b3b1b454-c0f3-4169-b34d-8e041e4f861f',
                'FromTime' => '00:11:00',
                'ToTime' => '00:30:59',
                'Description' => '11\' - 30\'',
                'Type' => 'LATE',
                'CreationTime' => '2021-04-19 08:50:55',
                'LastModificationTime' => '2021-04-19 08:50:55',
            ),
            2 => 
            array (
                'Id' => 'a1d88421-6f9f-49ae-a40a-334e37a61035',
                'FromTime' => '00:31:00',
                'ToTime' => '00:59:59',
                'Description' => '31\' - 59\'',
                'Type' => 'LATE',
                'CreationTime' => '2021-04-19 08:50:55',
                'LastModificationTime' => '2021-04-19 08:50:55',
            ),
            3 => 
            array (
                'Id' => '711d118b-9c74-4e61-9935-013b3b4dbede',
                'FromTime' => '01:00:00',
                'ToTime' => '10:00:00',
                'Description' => '>60\'',
                'Type' => 'LATE',
                'CreationTime' => '2021-04-19 08:50:55',
                'LastModificationTime' => '2021-04-19 08:50:55',
            ),
            4 => 
            array (
                'Id' => '75b600b2-e0c2-4141-87d2-a67f875dcf52',
                'FromTime' => '00:00:00',
                'ToTime' => '00:30:59',
                'Description' => '00\' - 30\'',
                'Type' => 'EARLY',
                'CreationTime' => '2021-04-19 08:50:55',
                'LastModificationTime' => '2021-04-19 08:50:55',
            ),
            5 => 
            array (
                'Id' => '288058d9-ba56-49c2-b609-2eeaba25d931',
                'FromTime' => '00:31:00',
                'ToTime' => '10:00:00',
                'Description' => '>30\'',
                'Type' => 'EARLY',
                'CreationTime' => '2021-04-19 08:50:55',
                'LastModificationTime' => '2021-04-19 08:50:55',
            ),
        ));
        
        
    }
}