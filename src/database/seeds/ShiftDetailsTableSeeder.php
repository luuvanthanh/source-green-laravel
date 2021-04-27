<?php

use Illuminate\Database\Seeder;

class ShiftDetailsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('ShiftDetails')->delete();
        
        \DB::table('ShiftDetails')->insert(array (
            0 => 
            array (
                'Id' => '536fc901-c425-4451-b046-69cd106dbd2d',
                'StartTime' => '08:00:00',
                'EndTime' => '11:00:00',
                'ShiftId' => '9d31a263-98b0-463d-b931-8fd8a5d2e695',
                'CreationTime' => '2021-04-19 08:51:22',
                'LastModificationTime' => '2021-04-19 08:51:22',
            ),
            1 => 
            array (
                'Id' => 'f66f17e3-797a-408f-a386-8df1b1264e87',
                'StartTime' => '13:00:00',
                'EndTime' => '17:00:00',
                'ShiftId' => 'e32735b6-a383-40dd-93df-843b0fe49d09',
                'CreationTime' => '2021-04-19 08:51:40',
                'LastModificationTime' => '2021-04-19 08:51:40',
            ),
        ));
        
        
    }
}