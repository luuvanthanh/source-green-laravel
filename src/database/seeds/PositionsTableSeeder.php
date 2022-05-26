

<?php

use Illuminate\Database\Seeder;

class PositionsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('Positions')->delete();
        
        \DB::table('Positions')->insert(array (
            0 => 
            array (
                'Id' => '625d2c8e-a6d7-4f13-be06-487671655b62',
                'Code' => 'KTT',
                'Name' => 'Kế toán trưởng',
                'Note' => 'Kế toán trưởng',
                'CreationTime' => '2022-03-29 03:11:51',
                'LastModificationTime' => '2022-03-29 03:11:51',
                'DeletionTime' => NULL,
            ),
            1 => 
            array (
                'Id' => '3cb6fde6-deaa-4bf2-896b-a748761d8f1e',
                'Code' => 'KTV',
                'Name' => 'Kế toán viên',
                'Note' => 'Kế toán viên',
                'CreationTime' => '2022-03-29 03:12:04',
                'LastModificationTime' => '2022-03-29 03:12:04',
                'DeletionTime' => NULL,
            ),
            2 => 
            array (
                'Id' => '6a996897-502f-46d8-ac20-39d57ba46aaa',
                'Code' => 'GV',
                'Name' => 'Giáo viên',
                'Note' => 'Giáo viên',
                'CreationTime' => '2022-03-29 03:12:14',
                'LastModificationTime' => '2022-03-29 03:12:14',
                'DeletionTime' => NULL,
            ),
            3 => 
            array (
                'Id' => 'd0b2370e-fa7d-467b-bb6f-8369f3753f99',
                'Code' => 'CEO',
                'Name' => 'CEO',
                'Note' => 'CEO',
                'CreationTime' => '2022-03-29 03:13:47',
                'LastModificationTime' => '2022-03-29 03:13:47',
                'DeletionTime' => NULL,
            ),
            4 => 
            array (
                'Id' => 'f4dfc4c0-a220-42c3-8b42-b9e22478d942',
                'Code' => 'NV',
                'Name' => 'Nhân viên',
                'Note' => 'Nhân viên',
                'CreationTime' => '2022-03-29 03:14:15',
                'LastModificationTime' => '2022-03-29 03:14:15',
                'DeletionTime' => NULL,
            ),
            5 => 
            array (
                'Id' => '70321604-1a4d-4a14-b64b-f3c2677f2359',
                'Code' => 'GDM',
                'Name' => 'Giám đốc Sale Maketing',
                'Note' => 'Giám đốc Sale Maketing',
                'CreationTime' => '2022-03-29 03:14:32',
                'LastModificationTime' => '2022-03-29 03:14:32',
                'DeletionTime' => NULL,
            ),
            6 => 
            array (
                'Id' => '1adcc563-dc59-475c-8957-5f38b7c13f5d',
                'Code' => 'GDCN',
                'Name' => 'Giám đốc chi nhánh',
                'Note' => 'Giám đốc chi nhánh',
                'CreationTime' => '2022-03-29 03:14:50',
                'LastModificationTime' => '2022-03-29 03:14:50',
                'DeletionTime' => NULL,
            ),
            7 => 
            array (
                'Id' => 'f3bd3212-46f7-4786-9045-6117222abc24',
                'Code' => 'TPNC',
                'Name' => 'Trưởng phòng nghiên cứu phát triển',
                'Note' => 'Trưởng phòng nghiên cứu phát triển',
                'CreationTime' => '2022-03-29 03:15:16',
                'LastModificationTime' => '2022-03-29 03:15:16',
                'DeletionTime' => NULL,
            ),
        ));
        
        
    }
}