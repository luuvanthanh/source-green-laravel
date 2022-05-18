<?php

use Illuminate\Database\Seeder;

class BusinessCardDetailsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('BusinessCardDetails')->delete();
        
        \DB::table('BusinessCardDetails')->insert(array (
            0 => 
            array (
                'Id' => 'bc932821-a315-4c5e-9e4c-4db29708ea3f',
                'BusinessCardId' => '6bdc75ca-fa24-4dd2-9d6d-93a4f55b537a',
                'Date' => '2022-05-11',
                'IsFullDate' => true,
                'ShiftCode' => NULL,
                'Number' => NULL,
                'StartTime' => '00:15:00',
                'EndTime' => '23:00:00',
                'CreationTime' => '2022-05-11 02:26:43',
                'LastModificationTime' => '2022-05-11 02:26:43',
                'DeletionTime' => NULL,
            ),
            1 => 
            array (
                'Id' => 'c3260682-6fe7-4a59-a4e9-d4ed98b3cb58',
                'BusinessCardId' => '6bdc75ca-fa24-4dd2-9d6d-93a4f55b537a',
                'Date' => '2022-05-12',
                'IsFullDate' => false,
                'ShiftCode' => 'Ca sáng',
                'Number' => NULL,
                'StartTime' => '00:15:00',
                'EndTime' => '09:30:00',
                'CreationTime' => '2022-05-11 02:26:43',
                'LastModificationTime' => '2022-05-11 02:26:43',
                'DeletionTime' => NULL,
            ),
            2 => 
            array (
                'Id' => '76c7968e-9ed4-4f6b-b7af-f7433e1d19cc',
                'BusinessCardId' => 'd6835524-67ad-4dcb-b08d-434427a7d23f',
                'Date' => '2022-05-11',
                'IsFullDate' => true,
                'ShiftCode' => NULL,
                'Number' => NULL,
                'StartTime' => '00:15:00',
                'EndTime' => '23:00:00',
                'CreationTime' => '2022-05-11 02:30:46',
                'LastModificationTime' => '2022-05-11 02:31:28',
                'DeletionTime' => '2022-05-11 02:31:28',
            ),
            3 => 
            array (
                'Id' => 'b90269b2-4711-4dca-a010-dce852ac5c3c',
                'BusinessCardId' => 'd6835524-67ad-4dcb-b08d-434427a7d23f',
                'Date' => '2022-05-12',
                'IsFullDate' => false,
                'ShiftCode' => 'Ca sáng',
                'Number' => NULL,
                'StartTime' => '00:15:00',
                'EndTime' => '09:30:00',
                'CreationTime' => '2022-05-11 02:30:46',
                'LastModificationTime' => '2022-05-11 02:31:28',
                'DeletionTime' => '2022-05-11 02:31:28',
            ),
            4 => 
            array (
                'Id' => 'b1a4218a-4a41-4d4c-b64f-d288c7ee779b',
                'BusinessCardId' => 'd6835524-67ad-4dcb-b08d-434427a7d23f',
                'Date' => '2022-05-11',
                'IsFullDate' => true,
                'ShiftCode' => NULL,
                'Number' => NULL,
                'StartTime' => '00:15:00',
                'EndTime' => '23:00:00',
                'CreationTime' => '2022-05-11 02:31:28',
                'LastModificationTime' => '2022-05-11 03:56:43',
                'DeletionTime' => '2022-05-11 03:56:43',
            ),
            5 => 
            array (
                'Id' => 'df34ed8a-5f01-422e-aa76-236ddc644ba9',
                'BusinessCardId' => 'd6835524-67ad-4dcb-b08d-434427a7d23f',
                'Date' => '2022-05-12',
                'IsFullDate' => false,
                'ShiftCode' => 'Ca chiều',
                'Number' => NULL,
                'StartTime' => '01:15:00',
                'EndTime' => '23:00:00',
                'CreationTime' => '2022-05-11 02:31:28',
                'LastModificationTime' => '2022-05-11 03:56:43',
                'DeletionTime' => '2022-05-11 03:56:43',
            ),
            6 => 
            array (
                'Id' => '8f137c3f-84ce-4cbc-a548-969e27c0fd9e',
                'BusinessCardId' => 'd6835524-67ad-4dcb-b08d-434427a7d23f',
                'Date' => '2022-05-11',
                'IsFullDate' => false,
                'ShiftCode' => 'Ca sáng',
                'Number' => NULL,
                'StartTime' => '00:15:00',
                'EndTime' => '09:30:00',
                'CreationTime' => '2022-05-11 03:56:43',
                'LastModificationTime' => '2022-05-11 03:58:22',
                'DeletionTime' => '2022-05-11 03:58:22',
            ),
            7 => 
            array (
                'Id' => 'c3392840-5cf4-4bc6-ae3f-5bcf2cb1344f',
                'BusinessCardId' => 'd6835524-67ad-4dcb-b08d-434427a7d23f',
                'Date' => '2022-05-12',
                'IsFullDate' => true,
                'ShiftCode' => NULL,
                'Number' => NULL,
                'StartTime' => '00:15:00',
                'EndTime' => '23:00:00',
                'CreationTime' => '2022-05-11 03:56:43',
                'LastModificationTime' => '2022-05-11 03:58:22',
                'DeletionTime' => '2022-05-11 03:58:22',
            ),
            8 => 
            array (
                'Id' => 'd29c52ee-0ec0-4ef8-9e39-380739879afb',
                'BusinessCardId' => 'd6835524-67ad-4dcb-b08d-434427a7d23f',
                'Date' => '2022-05-11',
                'IsFullDate' => true,
                'ShiftCode' => NULL,
                'Number' => NULL,
                'StartTime' => '00:15:00',
                'EndTime' => '23:00:00',
                'CreationTime' => '2022-05-11 03:58:22',
                'LastModificationTime' => '2022-05-11 03:58:22',
                'DeletionTime' => NULL,
            ),
            9 => 
            array (
                'Id' => 'b8219aad-9722-47dd-8786-837544b2649d',
                'BusinessCardId' => 'd6835524-67ad-4dcb-b08d-434427a7d23f',
                'Date' => '2022-05-12',
                'IsFullDate' => false,
                'ShiftCode' => 'Ca sáng',
                'Number' => NULL,
                'StartTime' => '00:15:00',
                'EndTime' => '09:30:00',
                'CreationTime' => '2022-05-11 03:58:22',
                'LastModificationTime' => '2022-05-11 03:58:22',
                'DeletionTime' => NULL,
            ),
            10 => 
            array (
                'Id' => 'a3dd8f24-4995-4153-af59-012f8c7c4ccb',
                'BusinessCardId' => '5e06d115-bb33-4f44-9db9-a0c6f8563fbc',
                'Date' => '2022-05-11',
                'IsFullDate' => false,
                'ShiftCode' => NULL,
                'Number' => '5.99',
                'StartTime' => '05:05:00',
                'EndTime' => '11:04:38',
                'CreationTime' => '2022-05-11 04:04:45',
                'LastModificationTime' => '2022-05-11 04:07:27',
                'DeletionTime' => '2022-05-11 04:07:27',
            ),
            11 => 
            array (
                'Id' => '7a04a646-970f-43e8-a5f0-04852ad9b348',
                'BusinessCardId' => '5e06d115-bb33-4f44-9db9-a0c6f8563fbc',
                'Date' => '2022-05-12',
                'IsFullDate' => false,
                'ShiftCode' => NULL,
                'Number' => '3.96',
                'StartTime' => '07:07:00',
                'EndTime' => '11:04:43',
                'CreationTime' => '2022-05-11 04:04:45',
                'LastModificationTime' => '2022-05-11 04:07:27',
                'DeletionTime' => '2022-05-11 04:07:27',
            ),
            12 => 
            array (
                'Id' => 'fb28c16c-328b-406e-b364-609dabb8972d',
                'BusinessCardId' => '5e06d115-bb33-4f44-9db9-a0c6f8563fbc',
                'Date' => '2022-05-11',
                'IsFullDate' => true,
                'ShiftCode' => NULL,
                'Number' => NULL,
                'StartTime' => '00:15:00',
                'EndTime' => '23:00:00',
                'CreationTime' => '2022-05-11 04:07:27',
                'LastModificationTime' => '2022-05-11 04:07:41',
                'DeletionTime' => '2022-05-11 04:07:41',
            ),
            13 => 
            array (
                'Id' => '6f95e49d-4db1-4be0-8937-2376075f2b46',
                'BusinessCardId' => '5e06d115-bb33-4f44-9db9-a0c6f8563fbc',
                'Date' => '2022-05-12',
                'IsFullDate' => false,
                'ShiftCode' => 'Ca sáng',
                'Number' => NULL,
                'StartTime' => '00:15:00',
                'EndTime' => '09:30:00',
                'CreationTime' => '2022-05-11 04:07:27',
                'LastModificationTime' => '2022-05-11 04:07:41',
                'DeletionTime' => '2022-05-11 04:07:41',
            ),
            14 => 
            array (
                'Id' => '237ca181-e292-4452-8c48-651c6a056a1e',
                'BusinessCardId' => '5e06d115-bb33-4f44-9db9-a0c6f8563fbc',
                'Date' => '2022-05-11',
                'IsFullDate' => true,
                'ShiftCode' => NULL,
                'Number' => NULL,
                'StartTime' => '00:15:00',
                'EndTime' => '23:00:00',
                'CreationTime' => '2022-05-11 04:07:41',
                'LastModificationTime' => '2022-05-11 04:07:41',
                'DeletionTime' => NULL,
            ),
            15 => 
            array (
                'Id' => 'd452f7ba-a4f3-4054-859b-d5492145e91d',
                'BusinessCardId' => '5e06d115-bb33-4f44-9db9-a0c6f8563fbc',
                'Date' => '2022-05-12',
                'IsFullDate' => false,
                'ShiftCode' => 'Ca chiều',
                'Number' => NULL,
                'StartTime' => '01:15:00',
                'EndTime' => '23:00:00',
                'CreationTime' => '2022-05-11 04:07:41',
                'LastModificationTime' => '2022-05-11 04:07:41',
                'DeletionTime' => NULL,
            ),
            16 => 
            array (
                'Id' => '754845cd-8005-483e-87d4-7d989d9f6a0e',
                'BusinessCardId' => '99fb6005-b405-4795-9989-a97edd840c78',
                'Date' => '2022-05-12',
                'IsFullDate' => true,
                'ShiftCode' => NULL,
                'Number' => NULL,
                'StartTime' => '00:15:00',
                'EndTime' => '23:00:00',
                'CreationTime' => '2022-05-11 04:08:15',
                'LastModificationTime' => '2022-05-11 04:08:40',
                'DeletionTime' => '2022-05-11 04:08:40',
            ),
            17 => 
            array (
                'Id' => '6bcc45a7-ddb7-4242-81eb-7564728cf297',
                'BusinessCardId' => '99fb6005-b405-4795-9989-a97edd840c78',
                'Date' => '2022-05-12',
                'IsFullDate' => true,
                'ShiftCode' => NULL,
                'Number' => NULL,
                'StartTime' => '00:15:00',
                'EndTime' => '23:00:00',
                'CreationTime' => '2022-05-11 04:08:40',
                'LastModificationTime' => '2022-05-12 14:00:04',
                'DeletionTime' => '2022-05-12 14:00:04',
            ),
            18 => 
            array (
                'Id' => '4a6ab066-34fa-4bb4-87c2-1653f3abe8bb',
                'BusinessCardId' => '99fb6005-b405-4795-9989-a97edd840c78',
                'Date' => '2022-05-12',
                'IsFullDate' => false,
                'ShiftCode' => NULL,
                'Number' => '8',
                'StartTime' => '09:00:00',
                'EndTime' => '17:00:00',
                'CreationTime' => '2022-05-12 14:00:04',
                'LastModificationTime' => '2022-05-12 14:00:04',
                'DeletionTime' => NULL,
            ),
        ));
        
        
    }
}