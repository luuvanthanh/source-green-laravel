<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ObjectTypesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('object_types')->delete();
        
        \DB::table('object_types')->insert(array (
            0 => 
            array (
                'id' => '81084ab1-2c2a-49ca-b152-98bd90b6112b',
                'name' => 'Trộm cắp',
                'created_at' => '2021-11-26 14:59:35',
                'updated_at' => '2021-11-26 14:59:35',
                'deleted_at' => NULL,
            ),
            1 => 
            array (
                'id' => 'a56536bc-7957-4f28-8241-a6959483ddd3',
                'name' => 'Cướp giật',
                'created_at' => '2021-11-26 14:59:45',
                'updated_at' => '2021-11-26 14:59:45',
                'deleted_at' => NULL,
            ),
            2 => 
            array (
                'id' => 'ac9ad52f-52ab-4bb9-9c71-d4107a7fdc2b',
                'name' => 'Tội phạm truy nã',
                'created_at' => '2021-11-26 14:59:55',
                'updated_at' => '2021-11-26 14:59:55',
                'deleted_at' => NULL,
            ),
            3 => 
            array (
                'id' => 'd2321118-a242-4c73-83ac-53a100ed4dc8',
                'name' => 'Lừa đảo',
                'created_at' => '2021-11-26 15:00:07',
                'updated_at' => '2021-11-26 15:00:07',
                'deleted_at' => NULL,
            ),
            4 => 
            array (
                'id' => '143c6606-98fa-4656-ac81-39495b335c9f',
                'name' => 'Khác',
                'created_at' => '2021-11-26 15:00:13',
                'updated_at' => '2021-11-26 15:00:13',
                'deleted_at' => NULL,
            ),
        ));
        
        
    }
}