<?php

use Illuminate\Database\Seeder;

class ScheduleRepeatsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('ScheduleRepeats')->delete();
        
        \DB::table('ScheduleRepeats')->insert(array (
            0 => 
            array (
                'Id' => '417c634d-79ba-4153-b223-ce1fc15b5005',
                'ScheduleId' => '3b989709-58d0-4d4b-8c4d-d86dd07a0847',
                'RepeatBy' => 'daily',
                'Count' => 234,
                'Interval' => NULL,
                'ByWeekDay' => NULL,
                'CreationTime' => '2022-05-10 07:12:58',
                'LastModificationTime' => '2022-05-10 07:12:58',
                'DeletionTime' => NULL,
            ),
            1 => 
            array (
                'Id' => '9e6bcb0b-c6e5-43a8-9157-61ed43e8bc16',
                'ScheduleId' => 'af45b53b-c7d5-4d9b-8848-e4282a4e0756',
                'RepeatBy' => 'daily',
                'Count' => 232,
                'Interval' => NULL,
                'ByWeekDay' => NULL,
                'CreationTime' => '2022-05-11 07:07:17',
                'LastModificationTime' => '2022-05-11 07:07:17',
                'DeletionTime' => NULL,
            ),
            2 => 
            array (
                'Id' => '5d7dc9fc-ce20-43fc-9f40-140ec0fcc9ed',
                'ScheduleId' => 'c5f08ab1-11b3-4667-a51d-79f6c8236f68',
                'RepeatBy' => 'monthly',
                'Count' => 0,
                'Interval' => NULL,
                'ByWeekDay' => NULL,
                'CreationTime' => '2022-05-11 07:07:08',
                'LastModificationTime' => '2022-05-11 07:07:17',
                'DeletionTime' => NULL,
            ),
            3 => 
            array (
                'Id' => 'b35e5546-3a72-4cd7-b350-bb0fae0f2b6f',
                'ScheduleId' => 'b422112f-6654-48ff-9be5-80c6a1b67ef5',
                'RepeatBy' => 'daily',
                'Count' => 233,
                'Interval' => NULL,
                'ByWeekDay' => NULL,
                'CreationTime' => '2022-05-11 10:31:55',
                'LastModificationTime' => '2022-05-11 10:31:55',
                'DeletionTime' => NULL,
            ),
            4 => 
            array (
                'Id' => 'f9696cf8-50bc-4531-9a8f-8de0cc31e41c',
                'ScheduleId' => 'ff00d435-ca84-4e32-a51b-3135a8d61156',
                'RepeatBy' => 'daily',
                'Count' => 232,
                'Interval' => NULL,
                'ByWeekDay' => NULL,
                'CreationTime' => '2022-05-12 01:14:45',
                'LastModificationTime' => '2022-05-12 01:14:45',
                'DeletionTime' => NULL,
            ),
            5 => 
            array (
                'Id' => '736794ef-7118-4035-94ee-fc52933a9839',
                'ScheduleId' => 'c8c87d4e-3f03-42a1-9703-1e276cf5239a',
                'RepeatBy' => 'daily',
                'Count' => 232,
                'Interval' => NULL,
                'ByWeekDay' => NULL,
                'CreationTime' => '2022-05-12 01:22:31',
                'LastModificationTime' => '2022-05-12 01:22:31',
                'DeletionTime' => NULL,
            ),
            6 => 
            array (
                'Id' => 'ecf958c9-e323-4146-ba6b-3e84ae35854d',
                'ScheduleId' => '7badb8a8-2e3c-4641-bd37-cec451863153',
                'RepeatBy' => 'daily',
                'Count' => 232,
                'Interval' => NULL,
                'ByWeekDay' => NULL,
                'CreationTime' => '2022-05-12 13:36:43',
                'LastModificationTime' => '2022-05-12 13:36:43',
                'DeletionTime' => NULL,
            ),
        ));
        
        
    }
}