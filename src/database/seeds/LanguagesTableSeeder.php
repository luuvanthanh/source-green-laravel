<?php

use Illuminate\Database\Seeder;

class LanguagesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('languages')->delete();
        
        \DB::table('languages')->insert(array (
            0 => 
            array (
                'id' => 'e3786657-485f-4bd3-94fb-6c801c25eec9',
                'code' => 'Arabic',
                'vietnamese_name' => 'Tiếng Ả Rập',
                'english_name' => 'Arabic',
                'type' => 'ar',
                'created_at' => '2021-11-19 10:53:47',
                'updated_at' => '2021-11-19 10:53:47',
                'deleted_at' => NULL,
            ),
            1 => 
            array (
                'id' => '385daf6e-dd81-4bd3-a021-1210fbeb8689',
                'code' => 'Bungarian',
                'vietnamese_name' => 'Tiếng Bun-ga-ri',
                'english_name' => 'Bulgarian',
                'type' => 'bu',
                'created_at' => '2021-11-19 10:54:14',
                'updated_at' => '2021-11-19 10:54:14',
                'deleted_at' => NULL,
            ),
            2 => 
            array (
                'id' => '97a2fb35-18c5-42aa-b28f-6aaae4fdc71f',
                'code' => 'Cambodian',
            'vietnamese_name' => 'Tiếng Campuchia (Tiếng Khmer)',
                'english_name' => 'Khmer',
                'type' => 'ca',
                'created_at' => '2021-11-19 10:54:52',
                'updated_at' => '2021-11-19 10:54:52',
                'deleted_at' => NULL,
            ),
            3 => 
            array (
                'id' => '9e8d557d-0949-487b-bb30-b47d16c40e1c',
                'code' => 'Chinese',
                'vietnamese_name' => 'Tiếng Trung',
                'english_name' => 'Chinese',
                'type' => 'chi',
                'created_at' => '2021-11-19 10:55:30',
                'updated_at' => '2021-11-19 10:55:30',
                'deleted_at' => NULL,
            ),
            4 => 
            array (
                'id' => '9e6028e1-8ffd-49d3-a9c2-91d252a13704',
                'code' => 'Czech',
                'vietnamese_name' => 'Tiếng Séc',
                'english_name' => 'Czech',
                'type' => 'cz',
                'created_at' => '2021-11-19 10:55:52',
                'updated_at' => '2021-11-19 10:55:52',
                'deleted_at' => NULL,
            ),
            5 => 
            array (
                'id' => '9bb8cc9c-6949-4c79-8fb3-187347919425',
                'code' => 'English',
                'vietnamese_name' => 'Tiếng Anh',
                'english_name' => 'English',
                'type' => 'en',
                'created_at' => '2021-11-19 10:56:41',
                'updated_at' => '2021-11-19 10:56:41',
                'deleted_at' => NULL,
            ),
            6 => 
            array (
                'id' => '71e37c79-0ee8-47cc-b832-8af8b3b1f7e5',
                'code' => 'French',
                'vietnamese_name' => 'Tiếng Pháp',
                'english_name' => 'French',
                'type' => 'fr',
                'created_at' => '2021-11-19 10:56:57',
                'updated_at' => '2021-11-19 10:56:57',
                'deleted_at' => NULL,
            ),
            7 => 
            array (
                'id' => '56b521cf-e6d6-419c-97f9-eb5122c5f9aa',
                'code' => 'German',
                'vietnamese_name' => 'Tiếng Đức',
                'english_name' => 'German',
                'type' => 'ge',
                'created_at' => '2021-11-19 10:57:13',
                'updated_at' => '2021-11-19 10:57:13',
                'deleted_at' => NULL,
            ),
            8 => 
            array (
                'id' => 'fbdb8190-0f0f-4c51-ac52-75be9451c6b6',
                'code' => 'Hungarian',
                'vietnamese_name' => 'Tiếng Hung-ga-ri',
                'english_name' => 'Hungarian',
                'type' => 'hu',
                'created_at' => '2021-11-19 10:57:33',
                'updated_at' => '2021-11-19 10:57:33',
                'deleted_at' => NULL,
            ),
            9 => 
            array (
                'id' => '48889c17-8fa2-499c-9dcd-381a67f6d92b',
                'code' => 'Indonesia',
                'vietnamese_name' => 'Tiếng Indonesia',
                'english_name' => 'Indonesian',
                'type' => 'ind',
                'created_at' => '2021-11-19 10:58:01',
                'updated_at' => '2021-11-19 10:58:01',
                'deleted_at' => NULL,
            ),
            10 => 
            array (
                'id' => 'f41b3946-be8f-45e8-aef2-f0ded9b1dd54',
                'code' => 'Italian',
                'vietnamese_name' => 'Tiếng Ý',
                'english_name' => 'Italian',
                'type' => 'ita',
                'created_at' => '2021-11-19 10:58:26',
                'updated_at' => '2021-11-19 10:58:26',
                'deleted_at' => NULL,
            ),
            11 => 
            array (
                'id' => '34206668-4538-4b32-9271-daae18e93515',
                'code' => 'Japanese',
                'vietnamese_name' => 'Tiếng Nhật',
                'english_name' => 'Japanese',
                'type' => 'jap',
                'created_at' => '2021-11-19 10:58:46',
                'updated_at' => '2021-11-19 10:58:46',
                'deleted_at' => NULL,
            ),
            12 => 
            array (
                'id' => 'c13cff3c-881e-45f0-9ff1-4179b78826ac',
                'code' => 'Korean',
                'vietnamese_name' => 'Tiếng Hàn',
                'english_name' => 'Korean',
                'type' => 'kor',
                'created_at' => '2021-11-19 10:59:07',
                'updated_at' => '2021-11-19 10:59:07',
                'deleted_at' => NULL,
            ),
            13 => 
            array (
                'id' => '60ee8727-e30a-42e5-af16-5991381d456f',
                'code' => 'Laotian',
                'vietnamese_name' => 'Tiếng Lào',
                'english_name' => 'Lao',
                'type' => 'lao',
                'created_at' => '2021-11-19 10:59:24',
                'updated_at' => '2021-11-19 10:59:24',
                'deleted_at' => NULL,
            ),
            14 => 
            array (
                'id' => '36414bdc-c4bb-42ea-a42a-14daee11ea58',
                'code' => 'Mongolian',
                'vietnamese_name' => 'Tiếng Mông Cổ',
                'english_name' => 'Mongolian',
                'type' => 'mon',
                'created_at' => '2021-11-19 10:59:43',
                'updated_at' => '2021-11-19 10:59:43',
                'deleted_at' => NULL,
            ),
            15 => 
            array (
                'id' => '8ecb41fb-b318-463d-a58d-0b95686edbae',
                'code' => 'Polish',
                'vietnamese_name' => 'Tiếng Ba Lan',
                'english_name' => 'Polish',
                'type' => 'pol',
                'created_at' => '2021-11-19 11:00:04',
                'updated_at' => '2021-11-19 11:00:04',
                'deleted_at' => NULL,
            ),
            16 => 
            array (
                'id' => 'cad1d084-ab48-4855-8d03-769865984bb0',
                'code' => 'Portuguese',
                'vietnamese_name' => 'Tiếng Bồ Đào Nha',
                'english_name' => 'Portuguese',
                'type' => 'por',
                'created_at' => '2021-11-19 11:00:23',
                'updated_at' => '2021-11-19 11:00:23',
                'deleted_at' => NULL,
            ),
            17 => 
            array (
                'id' => '26751b05-c47a-4d2a-9064-fd4163c46aeb',
                'code' => 'Rumanian',
                'vietnamese_name' => 'Tiếng Rumani',
                'english_name' => 'Rumanian',
                'type' => 'rum',
                'created_at' => '2021-11-19 11:02:01',
                'updated_at' => '2021-11-19 11:02:01',
                'deleted_at' => NULL,
            ),
            18 => 
            array (
                'id' => '219d2f29-8866-4997-b15a-9853628ab2c7',
                'code' => 'Russian',
                'vietnamese_name' => 'Tiếng Nga',
                'english_name' => 'Russian',
                'type' => 'rus',
                'created_at' => '2021-11-19 11:02:17',
                'updated_at' => '2021-11-19 11:02:17',
                'deleted_at' => NULL,
            ),
            19 => 
            array (
                'id' => '8e990bca-9d6e-425c-a052-3b5621ce18f8',
                'code' => 'Spanish',
                'vietnamese_name' => 'Tiếng Tây Ban Nha',
                'english_name' => 'Spanish',
                'type' => 'spa',
                'created_at' => '2021-11-19 11:02:34',
                'updated_at' => '2021-11-19 11:02:34',
                'deleted_at' => NULL,
            ),
            20 => 
            array (
                'id' => '7bbd1c2f-a994-44d1-9ada-959cae02b5ca',
                'code' => 'Thai',
                'vietnamese_name' => 'Tiếng Thái',
                'english_name' => 'Thai',
                'type' => 'thai',
                'created_at' => '2021-11-19 11:02:54',
                'updated_at' => '2021-11-19 11:02:54',
                'deleted_at' => NULL,
            ),
        ));
        
        
    }
}