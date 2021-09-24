<?php

use Illuminate\Database\Seeder;

class DistrictsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {

        \DB::table('districts')->delete();

        \DB::table('districts')->insert(array(
            0 =>
            array(
                'id' => '00771296-3e8b-4409-9c8f-b29b4a4d774f',
                'name' => 'Chiêm Hóa',

                'city_id' => 'b1ebf48f-56b7-4882-bf16-9271c1b75196',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            1 =>
            array(
                'id' => '00ad9483-7ba7-4c2a-b598-ec96a16dcb3c',
                'name' => 'Mường Nhé',

                'city_id' => '0acc5189-a3aa-47cb-b9ae-d2cdbd750b54',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            2 =>
            array(
                'id' => '01020215-cf12-41d2-b409-a90ef611ccd2',
                'name' => 'Bảo Yên',

                'city_id' => '637ad6dd-e601-46db-9f06-a36937ff1b0a',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            3 =>
            array(
                'id' => '0113c334-1ed3-4983-a4cb-a2a85d714fa4',
                'name' => 'Như Xuân',

                'city_id' => 'b577fbe5-2420-4ac7-9298-8a8bd04bc217',
                'created_at' => '2021-09-23 16:17:54',
                'updated_at' => '2021-09-23 16:17:54',
            ),
            4 =>
            array(
                'id' => '012404a3-68df-4bfe-bff9-45cfd5b1c95e',
                'name' => 'Thị xã Điện Bàn',

                'city_id' => 'e51deafd-86b7-493d-a035-b369ed6e5b5f',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            5 =>
            array(
                'id' => '020a088d-58db-417c-b274-5bebe4c7ca56',
                'name' => 'Quỳnh Phụ',

                'city_id' => '0dcb18c9-edea-4255-81ea-34ab31c60c28',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            6 =>
            array(
                'id' => '0210260a-c758-4221-b01f-2a5820a32425',
                'name' => 'Tuy Đức',

                'city_id' => '5563c615-1302-4c13-994c-4ed3f3695f76',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            7 =>
            array(
                'id' => '0214511e-9a91-4b88-8833-5a1902469a3d',
                'name' => 'Yên Minh',

                'city_id' => 'd1d97f9b-ca69-415f-afcd-a3e4decd023e',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            8 =>
            array(
                'id' => '023bb912-2203-4548-bf6d-6430a1f8a207',
                'name' => 'Thị xã Sông Cầu',

                'city_id' => '0920c620-d074-492e-8c99-3fb5aab15d3c',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            9 =>
            array(
                'id' => '03070b3c-3ba6-4a2a-8596-9aa41d57a186',
                'name' => 'Tương Dương',

                'city_id' => '80ca44a2-9bfc-448a-9b43-ca3d741fa868',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            10 =>
            array(
                'id' => '038fc321-8f76-4114-a54d-5be31bea007f',
                'name' => 'Bắc Hà',

                'city_id' => '637ad6dd-e601-46db-9f06-a36937ff1b0a',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            11 =>
            array(
                'id' => '0458acf7-53f1-4c3d-8806-c81bf3cb6256',
                'name' => 'Cầu Ngang',

                'city_id' => 'f6275b3f-09de-44b3-87a2-b9cec4ae89c8',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            12 =>
            array(
                'id' => '04f40316-db49-4ec5-ada9-2c2d345c6e7a',
                'name' => 'Nam Từ Liêm',

                'city_id' => '7ffe542b-8ae7-415e-b1de-6564e3f3d4ef',
                'created_at' => '2021-09-23 16:17:48',
                'updated_at' => '2021-09-23 16:17:48',
            ),
            13 =>
            array(
                'id' => '051f0f19-cd42-470e-a1b8-fcda3593cfca',
                'name' => 'Chương Mỹ',

                'city_id' => '7ffe542b-8ae7-415e-b1de-6564e3f3d4ef',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            14 =>
            array(
                'id' => '05316e3b-a86c-40db-9327-119024143199',
                'name' => 'Lang Chánh',

                'city_id' => 'b577fbe5-2420-4ac7-9298-8a8bd04bc217',
                'created_at' => '2021-09-23 16:17:54',
                'updated_at' => '2021-09-23 16:17:54',
            ),
            15 =>
            array(
                'id' => '054443c3-b527-49a3-8f8d-7040594bed68',
                'name' => 'Thạch Hà',

                'city_id' => '250bf51a-3b01-4246-ab2b-7583bdaf89e1',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            16 =>
            array(
                'id' => '0559ebb8-08a9-49c8-b5c0-fe2857e2eb88',
                'name' => 'Ea Kar',

                'city_id' => 'c0e9071f-1445-479a-b658-7d312ed909fd',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            17 =>
            array(
                'id' => '05c7cfd6-db2c-4ca8-8f31-c0ec92a8c399',
                'name' => 'Quỳnh Nhai',

                'city_id' => '30e8ea4f-cd4b-4e19-b8ed-9d21e06f531b',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            18 =>
            array(
                'id' => '0605ec69-0199-40a3-b25d-d1ec0a9c4b91',
                'name' => 'Trạm Tấu',

                'city_id' => 'efc143a2-35ac-4f33-9934-5d9177bcb7e1',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            19 =>
            array(
                'id' => '0631ddab-ce80-446e-a57b-e5391b2b1c1c',
                'name' => 'Núi Thành',

                'city_id' => 'e51deafd-86b7-493d-a035-b369ed6e5b5f',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            20 =>
            array(
                'id' => '06834af9-5bef-4139-b461-04d920853fe0',
                'name' => 'Phú Riềng',

                'city_id' => 'f1282eac-a136-42f4-a1ad-76096405ba95',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            21 =>
            array(
                'id' => '06e42f29-4e9c-4342-8552-2bee1eabefbd',
                'name' => 'Kon Rẫy',

                'city_id' => '4e01437c-3ac0-4958-a3a9-125f9c375c49',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            22 =>
            array(
                'id' => '07724830-6d74-415b-941c-000551599c6f',
                'name' => 'Triệu Sơn',

                'city_id' => 'b577fbe5-2420-4ac7-9298-8a8bd04bc217',
                'created_at' => '2021-09-23 16:17:54',
                'updated_at' => '2021-09-23 16:17:54',
            ),
            23 =>
            array(
                'id' => '079b8cba-6e9e-4e5b-bec6-15a2a55f1bc9',
                'name' => 'Bình Lục',

                'city_id' => '485eb0a2-0f49-4690-a615-e2e8ed951656',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            24 =>
            array(
                'id' => '079dacc0-3da6-46b2-976c-8d26a1b9f45d',
                'name' => 'Trấn Yên',

                'city_id' => 'efc143a2-35ac-4f33-9934-5d9177bcb7e1',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            25 =>
            array(
                'id' => '07c4fb92-b6ca-4b17-89ef-15220f450de1',
                'name' => 'Hoài Đức',

                'city_id' => '7ffe542b-8ae7-415e-b1de-6564e3f3d4ef',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            26 =>
            array(
                'id' => '084f8f5d-5877-4699-a47e-4773851af014',
                'name' => 'Gia Bình',

                'city_id' => '2ca3f74e-6ded-4339-8b12-c26e4b6d1a52',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            27 =>
            array(
                'id' => '0863b6c9-c9fb-40a5-9239-d923428f16ff',
                'name' => 'Lấp Vò',

                'city_id' => 'fef45e17-2058-4cb8-ac6d-51f4d082b088',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            28 =>
            array(
                'id' => '0952e29c-fed6-4b2f-9a43-725c47249c39',
                'name' => 'Nậm Nhùn',

                'city_id' => 'f69c204f-2c46-44dc-a932-12d7cec3a669',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            29 =>
            array(
                'id' => '09c9d7c4-c82e-4984-a45d-50ee43aef077',
                'name' => 'Quỳ Hợp',

                'city_id' => '80ca44a2-9bfc-448a-9b43-ca3d741fa868',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            30 =>
            array(
                'id' => '0a056a94-c41d-4617-a148-5901eecd695f',
                'name' => 'Long Xuyên',

                'city_id' => 'fb0e6f30-8a60-44f2-85b9-4c3c13c14220',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            31 =>
            array(
                'id' => '0a8b3b40-6a28-441b-8ffa-ac77cc5f0838',
                'name' => 'Quỳnh Lưu',

                'city_id' => '80ca44a2-9bfc-448a-9b43-ca3d741fa868',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            32 =>
            array(
                'id' => '0aea0a55-c706-4c83-89a0-1e907f010236',
                'name' => 'Đức Thọ',

                'city_id' => '250bf51a-3b01-4246-ab2b-7583bdaf89e1',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            33 =>
            array(
                'id' => '0b669193-c8f1-4727-b664-17165a7694e2',
                'name' => 'Đồng Xuân',

                'city_id' => '0920c620-d074-492e-8c99-3fb5aab15d3c',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            34 =>
            array(
                'id' => '0ba3224d-b039-4cfb-909e-958ff1a5c0df',
                'name' => 'Hàm Thuận Bắc',

                'city_id' => '454a9560-7637-4d5a-9792-a7a63cce6bc3',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            35 =>
            array(
                'id' => '0bb38216-a58e-4c58-847f-71d51332e220',
                'name' => 'Chư Prông',

                'city_id' => '64b7dd07-06f2-4ebb-9060-5b43862c9492',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            36 =>
            array(
                'id' => '0bc0a1e6-022e-4efc-a110-6131f1c52bb4',
                'name' => 'Khánh Vĩnh',

                'city_id' => '67c9c91d-e4d5-4541-babb-2a5232c6ff7d',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            37 =>
            array(
                'id' => '0c72e7de-7846-4f34-a829-f4255aa5634e',
                'name' => 'Thị xã Hoàng Mai',

                'city_id' => '80ca44a2-9bfc-448a-9b43-ca3d741fa868',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            38 =>
            array(
                'id' => '0ca26f8f-2b67-4b38-91bb-a59030415deb',
                'name' => 'Ba Vì',

                'city_id' => '7ffe542b-8ae7-415e-b1de-6564e3f3d4ef',
                'created_at' => '2021-09-23 16:17:48',
                'updated_at' => '2021-09-23 16:17:48',
            ),
            39 =>
            array(
                'id' => '0cb83d17-b131-4e16-bfb8-1dfe57acede9',
                'name' => 'Bình Liêu',

                'city_id' => 'd4dcf702-42a9-4068-8d9e-176d22279e32',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            40 =>
            array(
                'id' => '0d121d4e-0786-4c35-985b-0f2679c75710',
                'name' => 'Vĩnh Hưng',

                'city_id' => 'a3e0801f-502d-4b6e-bc7e-20f616ac3931',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            41 =>
            array(
                'id' => '0d37f9b6-7cd5-4ec4-a5ab-084de7349cff',
                'name' => 'Tiên Phước',

                'city_id' => 'e51deafd-86b7-493d-a035-b369ed6e5b5f',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            42 =>
            array(
                'id' => '0dd6a813-1144-40e0-93d1-07e6d8e4342c',
                'name' => 'Thị xã Kiến Tường',

                'city_id' => 'a3e0801f-502d-4b6e-bc7e-20f616ac3931',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            43 =>
            array(
                'id' => '0eabc309-3c50-4c4e-a0d5-a709c7d5b65a',
                'name' => 'Diên Khánh',

                'city_id' => '67c9c91d-e4d5-4541-babb-2a5232c6ff7d',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            44 =>
            array(
                'id' => '0ec1d108-3ef8-49b9-8135-09e4c0a1b6a0',
                'name' => 'Thị xã La Gi',

                'city_id' => '454a9560-7637-4d5a-9792-a7a63cce6bc3',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            45 =>
            array(
                'id' => '0ee0aede-659e-4e40-8f0b-81f36b26cd89',
                'name' => 'Ngân Sơn',

                'city_id' => 'c03bc001-7700-4187-b7d2-1b14ca5b73ef',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            46 =>
            array(
                'id' => '0f791d76-4590-4c39-9aef-32e4862ff4b6',
                'name' => 'Mường Tè',

                'city_id' => 'f69c204f-2c46-44dc-a932-12d7cec3a669',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            47 =>
            array(
                'id' => '0fda0022-7879-4239-a214-5197378e7cb9',
                'name' => 'Phú Thiện',

                'city_id' => '64b7dd07-06f2-4ebb-9060-5b43862c9492',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            48 =>
            array(
                'id' => '102d9005-9055-4bf7-a28a-760bb51d33c0',
                'name' => 'Võ Nhai',

                'city_id' => '1a07bb93-f1d7-4c58-9578-036b0d20741b',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            49 =>
            array(
                'id' => '104c5013-3b9e-4c63-b25e-84e04ce95846',
                'name' => 'Đồng Xoài',

                'city_id' => 'f1282eac-a136-42f4-a1ad-76096405ba95',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            50 =>
            array(
                'id' => '107e67b2-36c5-4ff2-af19-6b372c83f278',
                'name' => 'Thị xã Hòa Thành',

                'city_id' => '8c1436f7-2d32-4784-afd8-70d331936e5a',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            51 =>
            array(
                'id' => '109d521f-35f0-49ed-b4cc-825eea8ff81a',
                'name' => 'Thạch An',

                'city_id' => 'da297b82-b4de-4c8d-a252-b2df97fa8be7',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            52 =>
            array(
                'id' => '111048b7-0cc8-4626-836d-350874b0e181',
                'name' => 'Đống Đa',

                'city_id' => '7ffe542b-8ae7-415e-b1de-6564e3f3d4ef',
                'created_at' => '2021-09-23 16:17:48',
                'updated_at' => '2021-09-23 16:17:48',
            ),
            53 =>
            array(
                'id' => '11161f10-7a98-4064-93e8-040b480b9ec7',
                'name' => 'Phú Tân',

                'city_id' => 'fb0e6f30-8a60-44f2-85b9-4c3c13c14220',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            54 =>
            array(
                'id' => '11641ecc-9fae-4a8e-a519-b427ac6a81b9',
                'name' => 'Đắk Mil',

                'city_id' => '5563c615-1302-4c13-994c-4ed3f3695f76',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            55 =>
            array(
                'id' => '11a337b4-342d-43d9-b826-30bc4382bbbe',
                'name' => 'Hoa Lư',

                'city_id' => 'eb0bef04-0188-44f2-8f7b-60152624e033',
                'created_at' => '2021-09-23 16:17:54',
                'updated_at' => '2021-09-23 16:17:54',
            ),
            56 =>
            array(
                'id' => '11b2cd73-01c9-435d-9186-6ab9b7361a80',
                'name' => 'Bình Tân',

                'city_id' => '9d68ecc4-0cce-419e-baa8-9f4b320fc3da',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            57 =>
            array(
                'id' => '11bd59c7-7235-425d-ba57-065ca0d1ae1a',
                'name' => 'Gò Dầu',

                'city_id' => '8c1436f7-2d32-4784-afd8-70d331936e5a',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            58 =>
            array(
                'id' => '12143c35-6f6b-41a4-bf83-17a71863956a',
                'name' => 'Nam Trà My',

                'city_id' => 'e51deafd-86b7-493d-a035-b369ed6e5b5f',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            59 =>
            array(
                'id' => '121d9565-bc2a-4149-9faa-ae80143cacdf',
                'name' => 'Tân Bình',

                'city_id' => 'e30bfd9c-0668-4860-b065-455cae47d328',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            60 =>
            array(
                'id' => '12447c2b-7ef0-42a4-b9fe-fc12fddbe195',
                'name' => 'Thị xã Tân Châu',

                'city_id' => 'fb0e6f30-8a60-44f2-85b9-4c3c13c14220',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            61 =>
            array(
                'id' => '12e713dd-4bea-4f2a-8bdb-52c4eb1cba6e',
                'name' => 'Huế',

                'city_id' => '313269fe-b585-4e5f-9f4d-b94113fc2ae7',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            62 =>
            array(
                'id' => '132a7996-90b5-4304-b814-591b588c94e3',
                'name' => 'Cao Lộc',

                'city_id' => '01822d18-7a7e-4b64-970c-c00bde7cae5e',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            63 =>
            array(
                'id' => '139c5cd2-a5ba-487a-81f5-a42707d0a3ca',
                'name' => 'Chơn Thành',

                'city_id' => 'f1282eac-a136-42f4-a1ad-76096405ba95',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            64 =>
            array(
                'id' => '1459090f-d25f-4daa-81b8-fb7f8d2349d2',
                'name' => 'Krông Pa',

                'city_id' => '64b7dd07-06f2-4ebb-9060-5b43862c9492',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            65 =>
            array(
                'id' => '149562aa-891b-48a7-aef1-8b740974283d',
                'name' => 'Cư Jút',

                'city_id' => '5563c615-1302-4c13-994c-4ed3f3695f76',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            66 =>
            array(
                'id' => '1499cbf9-abfc-4083-a118-28c41fc1e248',
                'name' => 'Nam Giang',

                'city_id' => 'e51deafd-86b7-493d-a035-b369ed6e5b5f',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            67 =>
            array(
                'id' => '1662de58-b2f0-4aaf-9a8c-3a331537e7ad',
                'name' => 'Cát Hải',

                'city_id' => '37bf04e5-d907-443f-b7b3-b45c028a3db7',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            68 =>
            array(
                'id' => '168062bd-95e9-4a15-9c34-6a33000a94cb',
                'name' => 'Bình Tân',

                'city_id' => 'e30bfd9c-0668-4860-b065-455cae47d328',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            69 =>
            array(
                'id' => '16882316-8210-4383-9dc9-3bfb9f3031ce',
                'name' => 'Tân Phú Đông',

                'city_id' => '80180775-e6f5-4b0d-b606-ac976283638c',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            70 =>
            array(
                'id' => '16a4075a-4778-43d3-8d96-6667fc81a5ea',
                'name' => 'Tân Thạnh',

                'city_id' => 'a3e0801f-502d-4b6e-bc7e-20f616ac3931',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            71 =>
            array(
                'id' => '17512edf-fabd-4717-9eda-4dfb7f865b7d',
                'name' => 'Trà Vinh',

                'city_id' => 'f6275b3f-09de-44b3-87a2-b9cec4ae89c8',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            72 =>
            array(
                'id' => '17c690e0-e0ed-4551-bb57-a1613463bb28',
                'name' => 'Đông Sơn',

                'city_id' => 'b577fbe5-2420-4ac7-9298-8a8bd04bc217',
                'created_at' => '2021-09-23 16:17:54',
                'updated_at' => '2021-09-23 16:17:54',
            ),
            73 =>
            array(
                'id' => '19c3b0d1-a654-4efd-a6bf-3d5324fc5d50',
                'name' => 'Càng Long',

                'city_id' => 'f6275b3f-09de-44b3-87a2-b9cec4ae89c8',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            74 =>
            array(
                'id' => '19db035f-cf0c-487c-813f-44e662fcf35b',
                'name' => 'Bù Đốp',

                'city_id' => 'f1282eac-a136-42f4-a1ad-76096405ba95',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            75 =>
            array(
                'id' => '19de3c0e-ff7d-41c6-96de-3735c439d0ca',
                'name' => 'Kế Sách',

                'city_id' => '1a71e7ff-a963-4364-bbbd-ecf59ae7f965',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            76 =>
            array(
                'id' => '19eb0844-b159-47c4-93fa-d6081264f190',
                'name' => 'Móng Cái',

                'city_id' => 'd4dcf702-42a9-4068-8d9e-176d22279e32',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            77 =>
            array(
                'id' => '1a2f664a-1ed1-47de-8556-c609ebab2846',
                'name' => 'Thị xã Tân Uyên',

                'city_id' => 'cfe34498-401b-4f19-8565-486da5945f30',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            78 =>
            array(
                'id' => '1a6aec2f-e26f-4ac3-b7ee-3089452a4984',
                'name' => 'Thọ Xuân',

                'city_id' => 'b577fbe5-2420-4ac7-9298-8a8bd04bc217',
                'created_at' => '2021-09-23 16:17:54',
                'updated_at' => '2021-09-23 16:17:54',
            ),
            79 =>
            array(
                'id' => '1b0bb98c-d972-4b7f-b63b-76d16179514f',
                'name' => 'Hạ Long',

                'city_id' => 'd4dcf702-42a9-4068-8d9e-176d22279e32',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            80 =>
            array(
                'id' => '1b656170-49ad-4152-bfdc-d3303af0045d',
                'name' => 'Đình Lập',

                'city_id' => '01822d18-7a7e-4b64-970c-c00bde7cae5e',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            81 =>
            array(
                'id' => '1ba520b0-5c1e-48b1-8d06-5eb9a8a47036',
                'name' => 'Cai Lậy',

                'city_id' => '80180775-e6f5-4b0d-b606-ac976283638c',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            82 =>
            array(
                'id' => '1bba5585-2289-49b3-a770-a07addffa762',
                'name' => 'Kim Bảng',

                'city_id' => '485eb0a2-0f49-4690-a615-e2e8ed951656',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            83 =>
            array(
                'id' => '1bdd4760-bc9a-4abe-ba4c-58652bb755ad',
                'name' => 'Quận 11',

                'city_id' => 'e30bfd9c-0668-4860-b065-455cae47d328',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            84 =>
            array(
                'id' => '1d1e4217-f5c7-4658-9088-f39cd3c4e23f',
                'name' => 'Chợ Mới',

                'city_id' => 'c03bc001-7700-4187-b7d2-1b14ca5b73ef',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            85 =>
            array(
                'id' => '1d27b92e-dfa8-4ac5-b16b-57ff3bad691f',
                'name' => 'Châu Thành',

                'city_id' => '8c1436f7-2d32-4784-afd8-70d331936e5a',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            86 =>
            array(
                'id' => '1e7d4db6-eee6-44c6-b2e3-ed73ea15e8bf',
                'name' => 'Gò Quao',

                'city_id' => '9104b60d-125b-45de-8f0c-e14893ef5ee3',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            87 =>
            array(
                'id' => '1e9e31d5-d33f-4761-b65a-b80ad398da59',
                'name' => 'Đắk Hà',

                'city_id' => '4e01437c-3ac0-4958-a3a9-125f9c375c49',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            88 =>
            array(
                'id' => '1ee5ab3d-f81d-4534-a4e5-0afe9d5d1fa2',
                'name' => 'Sơn Động',

                'city_id' => '5e97693a-356d-4886-8ed2-b78c42f56115',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            89 =>
            array(
                'id' => '1ef0cc16-eca9-4058-9eda-671b9ec533d8',
                'name' => 'Chí Linh',

                'city_id' => '45b755a9-2397-42da-b45e-2dc8e23e0f4f',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            90 =>
            array(
                'id' => '1f1d749a-c982-4177-aace-39b06e17e5c6',
                'name' => 'Quảng Xương',

                'city_id' => 'b577fbe5-2420-4ac7-9298-8a8bd04bc217',
                'created_at' => '2021-09-23 16:17:54',
                'updated_at' => '2021-09-23 16:17:54',
            ),
            91 =>
            array(
                'id' => '1f9689af-ed55-4449-8a8a-faf111c51ce9',
                'name' => 'Tuyên Quang',

                'city_id' => 'b1ebf48f-56b7-4882-bf16-9271c1b75196',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            92 =>
            array(
                'id' => '1fcca7b9-fc95-43e1-bb98-9156fdf702c3',
                'name' => 'Mỹ Tho',

                'city_id' => '80180775-e6f5-4b0d-b606-ac976283638c',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            93 =>
            array(
                'id' => '2002b5ce-0e91-49d0-b4a9-a7b4b597d72d',
                'name' => 'Krông A Na',

                'city_id' => 'c0e9071f-1445-479a-b658-7d312ed909fd',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            94 =>
            array(
                'id' => '203a4573-39d0-4983-99cb-ab0651bda748',
                'name' => 'Cờ Đỏ',

                'city_id' => '78810fa4-611c-4088-aa1b-777926ec9b13',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            95 =>
            array(
                'id' => '20564c4b-bf2f-420e-8bb1-9d46e50da4ec',
                'name' => 'Tây Giang',

                'city_id' => 'e51deafd-86b7-493d-a035-b369ed6e5b5f',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            96 =>
            array(
                'id' => '2094acfe-58f0-4032-a67c-c1a72a0bbee1',
                'name' => 'Chư Sê',

                'city_id' => '64b7dd07-06f2-4ebb-9060-5b43862c9492',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            97 =>
            array(
                'id' => '20dfca62-7e79-42d4-95ed-816c99c70d7f',
                'name' => 'Vũ Thư',

                'city_id' => '0dcb18c9-edea-4255-81ea-34ab31c60c28',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            98 =>
            array(
                'id' => '21517d6c-6218-4a44-a3e7-428271043b7c',
                'name' => 'Yên Châu',

                'city_id' => '30e8ea4f-cd4b-4e19-b8ed-9d21e06f531b',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            99 =>
            array(
                'id' => '217cb008-3094-49d1-bd90-92d4ae9dc5ab',
                'name' => 'Đạ Tẻh',

                'city_id' => 'b01fa938-cffc-49b1-9e83-a337422f132e',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            100 =>
            array(
                'id' => '21a09aa9-2cfc-40b2-ad2e-a73bae9f2750',
                'name' => 'Kim Thành',

                'city_id' => '45b755a9-2397-42da-b45e-2dc8e23e0f4f',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            101 =>
            array(
                'id' => '233c2cc3-3846-4dc9-82a5-5bc1707e1455',
                'name' => 'Điện Biên Phủ',

                'city_id' => '0acc5189-a3aa-47cb-b9ae-d2cdbd750b54',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            102 =>
            array(
                'id' => '26ee4e40-1455-4e21-be9e-c206156b91fe',
                'name' => 'Hạ Lang',

                'city_id' => 'da297b82-b4de-4c8d-a252-b2df97fa8be7',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            103 =>
            array(
                'id' => '288e81de-909e-4ecc-8064-598a999343d4',
                'name' => 'Nam Định',

                'city_id' => '6d698fb4-9a6a-4504-8634-ab32e39c4aa8',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            104 =>
            array(
                'id' => '28b05193-6de2-4ca1-8da7-6e2fcdb4e7bc',
                'name' => 'Thuận Châu',

                'city_id' => '30e8ea4f-cd4b-4e19-b8ed-9d21e06f531b',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            105 =>
            array(
                'id' => '296275b3-5207-4a74-8143-fe36daf93e54',
                'name' => 'Hà Tĩnh',

                'city_id' => '250bf51a-3b01-4246-ab2b-7583bdaf89e1',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            106 =>
            array(
                'id' => '29ab2276-417a-42b8-b811-c12bcadf5fbb',
                'name' => 'Yên Thủy',

                'city_id' => 'f05ae9d8-a765-482b-90cf-2ba6434ee185',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            107 =>
            array(
                'id' => '2a125e96-5031-477e-a888-b5098d0a2f94',
                'name' => 'Hòa Bình',

                'city_id' => 'f05ae9d8-a765-482b-90cf-2ba6434ee185',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            108 =>
            array(
                'id' => '2a8502db-9016-4abb-a615-5f3a1b4b880e',
                'name' => 'Tân Hưng',

                'city_id' => 'a3e0801f-502d-4b6e-bc7e-20f616ac3931',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            109 =>
            array(
                'id' => '2ae91f4a-54d0-4a70-b99c-5cbedba60628',
                'name' => 'Hàm Thuận Nam',

                'city_id' => '454a9560-7637-4d5a-9792-a7a63cce6bc3',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            110 =>
            array(
                'id' => '2b229f00-e5d6-4e98-8f83-14afea95ab5a',
                'name' => 'Thị xã Mường Lay',

                'city_id' => '0acc5189-a3aa-47cb-b9ae-d2cdbd750b54',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            111 =>
            array(
                'id' => '2b4c11a7-3d0a-4032-97b1-38aa42dfbe55',
                'name' => 'Đăk Glong',

                'city_id' => '5563c615-1302-4c13-994c-4ed3f3695f76',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            112 =>
            array(
                'id' => '2b502010-effc-4568-8d20-06032038ec3f',
                'name' => 'Phú Vang',

                'city_id' => '313269fe-b585-4e5f-9f4d-b94113fc2ae7',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            113 =>
            array(
                'id' => '2b78b33a-bccd-4c07-99f8-e2ac932a7719',
                'name' => 'Văn Bàn',

                'city_id' => '637ad6dd-e601-46db-9f06-a36937ff1b0a',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            114 =>
            array(
                'id' => '2ba907a4-879c-4e52-a0f4-085aaa62c399',
                'name' => 'Thanh Hà',

                'city_id' => '45b755a9-2397-42da-b45e-2dc8e23e0f4f',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            115 =>
            array(
                'id' => '2cb70cd3-981f-4d18-904a-7575b66b2e68',
                'name' => 'Trực Ninh',

                'city_id' => '6d698fb4-9a6a-4504-8634-ab32e39c4aa8',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            116 =>
            array(
                'id' => '2d0bf5fc-6895-4e25-916b-94c36399fabb',
                'name' => 'Thị xã Bến Cát',

                'city_id' => 'cfe34498-401b-4f19-8565-486da5945f30',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            117 =>
            array(
                'id' => '2d8a1aac-c760-4996-b632-ee822d0689ee',
                'name' => 'Yên Dũng',

                'city_id' => '5e97693a-356d-4886-8ed2-b78c42f56115',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            118 =>
            array(
                'id' => '2e198665-6eb6-491d-8e81-dec28e3a149e',
                'name' => 'Sơn Dương',

                'city_id' => 'b1ebf48f-56b7-4882-bf16-9271c1b75196',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            119 =>
            array(
                'id' => '2f5ce22a-0c0b-4ba6-89fd-b606bc0d5318',
                'name' => 'Thị xã Bỉm Sơn',

                'city_id' => 'b577fbe5-2420-4ac7-9298-8a8bd04bc217',
                'created_at' => '2021-09-23 16:17:54',
                'updated_at' => '2021-09-23 16:17:54',
            ),
            120 =>
            array(
                'id' => '2fee11a8-d84b-43ad-a45e-72f41ecc13cb',
                'name' => 'Gia Lộc',

                'city_id' => '45b755a9-2397-42da-b45e-2dc8e23e0f4f',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            121 =>
            array(
                'id' => '30038e0e-382f-49ab-b75e-1f562a62680f',
                'name' => 'Cam Ranh',

                'city_id' => '67c9c91d-e4d5-4541-babb-2a5232c6ff7d',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            122 =>
            array(
                'id' => '302caaa0-08a1-4fc5-a236-201496c3ffa1',
                'name' => 'Thị xã Phổ Yên',

                'city_id' => '1a07bb93-f1d7-4c58-9578-036b0d20741b',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            123 =>
            array(
                'id' => '30433740-0361-4253-8d97-960e2ae7d210',
                'name' => 'Na Rì',

                'city_id' => 'c03bc001-7700-4187-b7d2-1b14ca5b73ef',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            124 =>
            array(
                'id' => '305f608d-021b-41bd-932f-c4a2d0c4ea8b',
                'name' => 'A Lưới',

                'city_id' => '313269fe-b585-4e5f-9f4d-b94113fc2ae7',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            125 =>
            array(
                'id' => '307bd5e4-accd-4660-a68f-4b2a34355ae2',
                'name' => 'Kon Tum',

                'city_id' => '4e01437c-3ac0-4958-a3a9-125f9c375c49',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            126 =>
            array(
                'id' => '3136b770-95a1-476b-bee1-b29bfd403337',
                'name' => 'Tân Uyên',

                'city_id' => 'f69c204f-2c46-44dc-a932-12d7cec3a669',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            127 =>
            array(
                'id' => '31ab2a94-4f2f-4c2b-a9c7-184c202efe80',
                'name' => 'Dương Kinh',

                'city_id' => '37bf04e5-d907-443f-b7b3-b45c028a3db7',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            128 =>
            array(
                'id' => '31f0417a-c48a-486d-a81d-bf0abd2cee24',
                'name' => 'Châu Thành',

                'city_id' => '80180775-e6f5-4b0d-b606-ac976283638c',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            129 =>
            array(
                'id' => '3260df3c-e88a-4482-ae4f-60567a5dc86e',
                'name' => 'Ba Chẽ',

                'city_id' => 'd4dcf702-42a9-4068-8d9e-176d22279e32',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            130 =>
            array(
                'id' => '32fb0c25-8b5e-4a3b-bdc9-20b8c17259bf',
                'name' => 'Sơn Hòa',

                'city_id' => '0920c620-d074-492e-8c99-3fb5aab15d3c',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            131 =>
            array(
                'id' => '33f01a81-6562-426f-abb7-6e6cd5566c04',
                'name' => 'Con Cuông',

                'city_id' => '80ca44a2-9bfc-448a-9b43-ca3d741fa868',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            132 =>
            array(
                'id' => '34b45c7b-0070-406c-ba11-dcc5c1037570',
                'name' => 'Uông Bí',

                'city_id' => 'd4dcf702-42a9-4068-8d9e-176d22279e32',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            133 =>
            array(
                'id' => '34e9f06a-5c60-49d3-9574-8f7683ebc140',
                'name' => 'Châu Thành A',

                'city_id' => '63cea115-2d29-4893-ba22-518aa3451f35',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            134 =>
            array(
                'id' => '350b6986-fe5d-41cd-a68e-4af75055ef53',
                'name' => 'Phù Cừ',

                'city_id' => '312016bb-b80f-4456-aad2-9e69a0ea2f5f',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            135 =>
            array(
                'id' => '350d345a-45ac-4d07-b0b0-2f5d0a586fa0',
                'name' => 'Đạ Huoai',

                'city_id' => 'b01fa938-cffc-49b1-9e83-a337422f132e',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            136 =>
            array(
                'id' => '352834b6-3fb6-4910-93ff-67963b7faa17',
                'name' => 'Thị xã Ba Đồn',

                'city_id' => '1182ce56-8620-4d32-a32c-9561dcb52983',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            137 =>
            array(
                'id' => '35c44ba5-c85d-4e08-ad42-879a0e25e208',
                'name' => 'Vĩnh Thạnh',

                'city_id' => '10878756-f388-482c-bdf2-c9a0b5f4ef7c',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            138 =>
            array(
                'id' => '35f78a9f-49e8-40e9-928a-d4a22eb02ed3',
                'name' => 'Tuyên Hóa',

                'city_id' => '1182ce56-8620-4d32-a32c-9561dcb52983',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            139 =>
            array(
                'id' => '3605eb43-5a24-4a32-abd9-81b0b571163b',
                'name' => 'Liên Chiểu',

                'city_id' => '1de081d3-e6f4-4bab-a727-bab36f976dc9',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            140 =>
            array(
                'id' => '3648357e-45ea-49ac-98b9-8a52b2c88f8c',
                'name' => 'Giồng Trôm',

                'city_id' => '7e28b375-6c0b-4c30-bbb9-2fd254cf75da',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            141 =>
            array(
                'id' => '365a137a-1d7c-4bd8-830d-1fdebcd6778c',
                'name' => 'Thanh Bình',

                'city_id' => 'fef45e17-2058-4cb8-ac6d-51f4d082b088',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            142 =>
            array(
                'id' => '367abeae-8651-477f-8191-d9495d851993',
                'name' => 'Châu Phú',

                'city_id' => 'fb0e6f30-8a60-44f2-85b9-4c3c13c14220',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            143 =>
            array(
                'id' => '3788cfc9-77fc-4c26-b4af-6b17d1f63348',
                'name' => 'Diễn Châu',

                'city_id' => '80ca44a2-9bfc-448a-9b43-ca3d741fa868',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            144 =>
            array(
                'id' => '38792805-ab30-48db-a65b-aa94510b9b12',
                'name' => 'Thị xã An Khê',

                'city_id' => '64b7dd07-06f2-4ebb-9060-5b43862c9492',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            145 =>
            array(
                'id' => '38b85822-4b2c-484f-850e-99b4e6c3ff89',
                'name' => 'Thị xã Nghĩa Lộ',

                'city_id' => 'efc143a2-35ac-4f33-9934-5d9177bcb7e1',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            146 =>
            array(
                'id' => '3937cee9-2f64-43ac-9df5-e4839c5d5061',
                'name' => 'Hà Giang',

                'city_id' => 'd1d97f9b-ca69-415f-afcd-a3e4decd023e',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            147 =>
            array(
                'id' => '39bdcbde-816b-4d6c-b880-1f6d97ab016e',
                'name' => 'Cát Tiên',

                'city_id' => 'b01fa938-cffc-49b1-9e83-a337422f132e',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            148 =>
            array(
                'id' => '3a207b50-7067-4e19-af46-704a5ab8c967',
                'name' => 'Tây Ninh',

                'city_id' => '8c1436f7-2d32-4784-afd8-70d331936e5a',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            149 =>
            array(
                'id' => '3a39cbef-8716-46a7-8aac-b457416f3a9d',
                'name' => 'Nam Trực',

                'city_id' => '6d698fb4-9a6a-4504-8634-ab32e39c4aa8',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            150 =>
            array(
                'id' => '3a419640-8d35-40db-aea9-417fdf0d05d4',
                'name' => 'An Lão',

                'city_id' => '10878756-f388-482c-bdf2-c9a0b5f4ef7c',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            151 =>
            array(
                'id' => '3adc810c-a0cc-40fe-a8fc-ef2b27245c73',
                'name' => 'Cư Kuin',

                'city_id' => 'c0e9071f-1445-479a-b658-7d312ed909fd',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            152 =>
            array(
                'id' => '3b059274-e96c-40b9-b528-29f21d9bb92c',
                'name' => 'Quốc Oai',

                'city_id' => '7ffe542b-8ae7-415e-b1de-6564e3f3d4ef',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            153 =>
            array(
                'id' => '3bec3adc-9aaa-4ed9-9c1c-ff5b23ff8162',
                'name' => 'Vĩnh Linh',

                'city_id' => '6b1145ac-a1dd-42e8-9b9f-5d2cceb14253',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            154 =>
            array(
                'id' => '3bef455f-7d68-41f9-be51-d79f4bb25cfe',
                'name' => 'Chi Lăng',

                'city_id' => '01822d18-7a7e-4b64-970c-c00bde7cae5e',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            155 =>
            array(
                'id' => '3c615ede-421e-425a-965f-5592adecf90b',
                'name' => 'Đồng Hới',

                'city_id' => '1182ce56-8620-4d32-a32c-9561dcb52983',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            156 =>
            array(
                'id' => '3d2fb962-42c0-49aa-9d12-ad3b73ab8f81',
                'name' => 'Thị xã Buôn Hồ',

                'city_id' => 'c0e9071f-1445-479a-b658-7d312ed909fd',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            157 =>
            array(
                'id' => '3d831d1e-a82b-4c6b-a6e4-098c7daab137',
                'name' => 'Thị xã Phú Mỹ',

                'city_id' => 'b720536f-26aa-41c5-b29c-e0dc9fad61ad',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            158 =>
            array(
                'id' => '3dad8924-95e5-479a-b135-a0bd6fce472f',
                'name' => 'Thị xã Vĩnh Châu',

                'city_id' => '1a71e7ff-a963-4364-bbbd-ecf59ae7f965',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            159 =>
            array(
                'id' => '3dc3ee3a-2741-4410-a118-ac99896ab81f',
                'name' => 'Quảng Điền',

                'city_id' => '313269fe-b585-4e5f-9f4d-b94113fc2ae7',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            160 =>
            array(
                'id' => '3ea26694-4bda-4ab8-b824-d919d81ae05b',
                'name' => 'Hải An',

                'city_id' => '37bf04e5-d907-443f-b7b3-b45c028a3db7',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            161 =>
            array(
                'id' => '3f2b7728-b4e8-4b08-b0b1-1265db103e7e',
                'name' => 'Hải Hậu',

                'city_id' => '6d698fb4-9a6a-4504-8634-ab32e39c4aa8',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            162 =>
            array(
                'id' => '3f5fb367-3a68-4743-9a01-8a43ed165812',
                'name' => 'Cẩm Giàng',

                'city_id' => '45b755a9-2397-42da-b45e-2dc8e23e0f4f',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            163 =>
            array(
                'id' => '3f679692-cc8e-4ee4-91df-4015ac2b9c15',
                'name' => 'Chư Păh',

                'city_id' => '64b7dd07-06f2-4ebb-9060-5b43862c9492',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            164 =>
            array(
                'id' => '3f6d9f99-005c-4b35-acfd-adbfe24f50f4',
                'name' => 'Đoan Hùng',

                'city_id' => '7beeed0d-f6f7-49a3-87ff-4e363a27108a',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            165 =>
            array(
                'id' => '3f702bae-93ef-48b4-af14-94d98aa44ff6',
                'name' => 'Bến Lức',

                'city_id' => 'a3e0801f-502d-4b6e-bc7e-20f616ac3931',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            166 =>
            array(
                'id' => '40840fa0-3054-4452-ae0f-5b0c111a7185',
                'name' => 'Gia Viễn',

                'city_id' => 'eb0bef04-0188-44f2-8f7b-60152624e033',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            167 =>
            array(
                'id' => '40acf2d5-ac95-45ab-a716-db60985c1c53',
                'name' => 'Bắc Tân Uyên',

                'city_id' => 'cfe34498-401b-4f19-8565-486da5945f30',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            168 =>
            array(
                'id' => '40bafcf5-fbdd-49c2-a73c-d351491a2c73',
                'name' => 'Nghĩa Đàn',

                'city_id' => '80ca44a2-9bfc-448a-9b43-ca3d741fa868',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            169 =>
            array(
                'id' => '411144f4-442b-4d4d-acc6-854a1a5c029f',
                'name' => 'Yên Mô',

                'city_id' => 'eb0bef04-0188-44f2-8f7b-60152624e033',
                'created_at' => '2021-09-23 16:17:54',
                'updated_at' => '2021-09-23 16:17:54',
            ),
            170 =>
            array(
                'id' => '4112d46b-b994-4a7a-b788-bdde3be866dc',
                'name' => 'Mường Khương',

                'city_id' => '637ad6dd-e601-46db-9f06-a36937ff1b0a',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            171 =>
            array(
                'id' => '41c360df-64da-466d-926a-3b636237a381',
                'name' => 'Tam Điệp',

                'city_id' => 'eb0bef04-0188-44f2-8f7b-60152624e033',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            172 =>
            array(
                'id' => '41c4e510-87c0-4dc0-b4bc-f13615e50bd1',
                'name' => 'Mỹ Lộc',

                'city_id' => '6d698fb4-9a6a-4504-8634-ab32e39c4aa8',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            173 =>
            array(
                'id' => '41e11f06-2cd4-4404-be2a-607e846e3c94',
                'name' => 'Bà Rịa',

                'city_id' => 'b720536f-26aa-41c5-b29c-e0dc9fad61ad',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            174 =>
            array(
                'id' => '420b6b2e-f34e-4ff7-bf1c-0b40fa2596a7',
                'name' => 'Ba Đình',

                'city_id' => '7ffe542b-8ae7-415e-b1de-6564e3f3d4ef',
                'created_at' => '2021-09-23 16:17:48',
                'updated_at' => '2021-09-23 16:17:48',
            ),
            175 =>
            array(
                'id' => '42419b9b-6c4a-4254-a6dd-1e3bcc185dea',
                'name' => 'Phú Xuyên',

                'city_id' => '7ffe542b-8ae7-415e-b1de-6564e3f3d4ef',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            176 =>
            array(
                'id' => '42822a8a-a32a-451d-83a1-53f4446e1ba1',
                'name' => 'Tiên Lãng',

                'city_id' => '37bf04e5-d907-443f-b7b3-b45c028a3db7',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            177 =>
            array(
                'id' => '429af2ac-794d-4fd8-bde6-caf480de264f',
                'name' => 'Ninh Sơn',

                'city_id' => '0a602243-f105-4c21-9a39-a9317d4c8aae',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            178 =>
            array(
                'id' => '42cc9ae1-a271-4df6-9a84-f2433a509fdb',
                'name' => 'Đông Hải',

                'city_id' => '65d1fabe-3373-4612-bb48-4fd92866c5fe',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            179 =>
            array(
                'id' => '431fa6b1-22bd-4b12-a776-67d4c01a074e',
                'name' => 'Bắc Từ Liêm',

                'city_id' => '7ffe542b-8ae7-415e-b1de-6564e3f3d4ef',
                'created_at' => '2021-09-23 16:17:48',
                'updated_at' => '2021-09-23 16:17:48',
            ),
            180 =>
            array(
                'id' => '435a456c-c28f-4545-b8df-7437f2f30c56',
                'name' => 'Dĩ An',

                'city_id' => 'cfe34498-401b-4f19-8565-486da5945f30',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            181 =>
            array(
                'id' => '437bbf19-3a54-46a6-b994-10ce3af8e33c',
                'name' => 'Triệu Phong',

                'city_id' => '6b1145ac-a1dd-42e8-9b9f-5d2cceb14253',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            182 =>
            array(
                'id' => '43cbbed3-53c1-4963-9c75-eda12777d5d4',
                'name' => 'Tuy Phước',

                'city_id' => '10878756-f388-482c-bdf2-c9a0b5f4ef7c',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            183 =>
            array(
                'id' => '43cdf4d2-64ad-4bfa-9a2f-d0083476a757',
                'name' => 'Lai Châu',

                'city_id' => 'f69c204f-2c46-44dc-a932-12d7cec3a669',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            184 =>
            array(
                'id' => '445cd3a5-078a-4cf2-a995-562bc9670513',
                'name' => 'Long Khánh',

                'city_id' => 'a4d945b8-b02d-41c1-880e-71ceb3168a9d',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            185 =>
            array(
                'id' => '4564727d-2eb0-42c2-8f8f-f426e1236584',
                'name' => 'Vĩnh Lộc',

                'city_id' => 'b577fbe5-2420-4ac7-9298-8a8bd04bc217',
                'created_at' => '2021-09-23 16:17:54',
                'updated_at' => '2021-09-23 16:17:54',
            ),
            186 =>
            array(
                'id' => '45a7e952-78dc-4eee-8242-1328aa350420',
                'name' => 'Ngã Bảy',

                'city_id' => '63cea115-2d29-4893-ba22-518aa3451f35',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            187 =>
            array(
                'id' => '45b454d2-505e-467b-ab2a-a3c562ae73c7',
                'name' => 'Thị xã Đông Hòa',

                'city_id' => '0920c620-d074-492e-8c99-3fb5aab15d3c',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            188 =>
            array(
                'id' => '45e82315-f207-404a-8839-3ae0d02fc3a9',
                'name' => 'Nông Cống',

                'city_id' => 'b577fbe5-2420-4ac7-9298-8a8bd04bc217',
                'created_at' => '2021-09-23 16:17:54',
                'updated_at' => '2021-09-23 16:17:54',
            ),
            189 =>
            array(
                'id' => '46e3dc9a-9745-4084-a6dc-eed2f5281dfb',
                'name' => 'Sông Mã',

                'city_id' => '30e8ea4f-cd4b-4e19-b8ed-9d21e06f531b',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            190 =>
            array(
                'id' => '470b57d0-a1cf-46e2-a96c-b108dc13df46',
                'name' => 'Ân Thi',

                'city_id' => '312016bb-b80f-4456-aad2-9e69a0ea2f5f',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            191 =>
            array(
                'id' => '4723f86c-79c1-4c00-a8f2-36ec867c63a3',
                'name' => 'Quảng Hòa',

                'city_id' => 'da297b82-b4de-4c8d-a252-b2df97fa8be7',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            192 =>
            array(
                'id' => '47b6997d-c256-4dd5-80ba-ee218bcf9af4',
                'name' => 'Kiên Hải',

                'city_id' => '9104b60d-125b-45de-8f0c-e14893ef5ee3',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            193 =>
            array(
                'id' => '47de9889-52df-4d65-80d9-6802202d4048',
                'name' => 'Giao Thủy',

                'city_id' => '6d698fb4-9a6a-4504-8634-ab32e39c4aa8',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            194 =>
            array(
                'id' => '48643bcb-de42-4054-823d-ebc8c836c02a',
                'name' => 'Gio Linh',

                'city_id' => '6b1145ac-a1dd-42e8-9b9f-5d2cceb14253',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            195 =>
            array(
                'id' => '48c964cb-b56f-4578-a44b-894b29fe34ab',
                'name' => 'Cao Lãnh',

                'city_id' => 'fef45e17-2058-4cb8-ac6d-51f4d082b088',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            196 =>
            array(
                'id' => '49ac8494-22ab-410c-8938-8da6cbba6c7b',
                'name' => 'Quản Bạ',

                'city_id' => 'd1d97f9b-ca69-415f-afcd-a3e4decd023e',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            197 =>
            array(
                'id' => '49e3ada1-ef2f-4e18-ac26-0e835fc7b91c',
                'name' => 'Phúc Thọ',

                'city_id' => '7ffe542b-8ae7-415e-b1de-6564e3f3d4ef',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            198 =>
            array(
                'id' => '4a6dc0b7-a174-4284-878c-f9b87376ff50',
                'name' => 'Thị xã Kinh Môn',

                'city_id' => '45b755a9-2397-42da-b45e-2dc8e23e0f4f',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            199 =>
            array(
                'id' => '4a83b1a2-9e07-42ac-be75-a9cb58e7ae42',
                'name' => 'Châu Thành',

                'city_id' => '9104b60d-125b-45de-8f0c-e14893ef5ee3',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            200 =>
            array(
                'id' => '4acd2c84-9ddd-4ebf-a5a6-56659b37d8f7',
                'name' => 'Văn Quan',

                'city_id' => '01822d18-7a7e-4b64-970c-c00bde7cae5e',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            201 =>
            array(
                'id' => '4b1944f0-173e-4e8f-8b6b-af4305b9a4b0',
                'name' => 'Châu Đốc',

                'city_id' => 'fb0e6f30-8a60-44f2-85b9-4c3c13c14220',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            202 =>
            array(
                'id' => '4b49aa0a-e460-46d6-83ff-8c152d33202d',
                'name' => 'Cầu Kè',

                'city_id' => 'f6275b3f-09de-44b3-87a2-b9cec4ae89c8',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            203 =>
            array(
                'id' => '4c80e9d8-2875-4958-86b5-74e0b1953b8a',
                'name' => 'Quận 7',

                'city_id' => 'e30bfd9c-0668-4860-b065-455cae47d328',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            204 =>
            array(
                'id' => '4cdcc83f-c0bf-4e68-831a-5f88c8262dd9',
                'name' => 'Nam Đàn',

                'city_id' => '80ca44a2-9bfc-448a-9b43-ca3d741fa868',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            205 =>
            array(
                'id' => '4cf2451c-ebde-4a1b-8be1-49bb0fa59066',
                'name' => 'Kim Động',

                'city_id' => '312016bb-b80f-4456-aad2-9e69a0ea2f5f',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            206 =>
            array(
                'id' => '4db7bdeb-afd9-4355-a79e-1990101b92b5',
                'name' => 'Nghĩa Hành',

                'city_id' => 'bc4e7995-4afa-4f16-aa08-3a5c690d79b6',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            207 =>
            array(
                'id' => '4dd19d2e-4238-4e6e-8e25-b79a13f1e0c8',
                'name' => 'Ngũ Hành Sơn',

                'city_id' => '1de081d3-e6f4-4bab-a727-bab36f976dc9',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            208 =>
            array(
                'id' => '4e24eb09-076f-48e5-8027-5162b1432a3e',
                'name' => 'Thị xã Duy Tiên',

                'city_id' => '485eb0a2-0f49-4690-a615-e2e8ed951656',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            209 =>
            array(
                'id' => '4e952314-77c3-4011-a06f-69f526dcf970',
                'name' => 'Ngọc Lặc',

                'city_id' => 'b577fbe5-2420-4ac7-9298-8a8bd04bc217',
                'created_at' => '2021-09-23 16:17:54',
                'updated_at' => '2021-09-23 16:17:54',
            ),
            210 =>
            array(
                'id' => '4f54abbf-7b8b-4fd3-8c0d-d1c384b71063',
                'name' => 'Lê Chân',

                'city_id' => '37bf04e5-d907-443f-b7b3-b45c028a3db7',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            211 =>
            array(
                'id' => '4f9379a9-dca4-417c-8f6d-6f6af5c2fed9',
                'name' => 'Mỏ Cày Bắc',

                'city_id' => '7e28b375-6c0b-4c30-bbb9-2fd254cf75da',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            212 =>
            array(
                'id' => '4fc4c52e-3526-459d-9cb9-df95bb3cbca2',
                'name' => 'An Phú',

                'city_id' => 'fb0e6f30-8a60-44f2-85b9-4c3c13c14220',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            213 =>
            array(
                'id' => '50a132a8-68d4-4096-80de-5944c6745db2',
                'name' => 'Phan Thiết',

                'city_id' => '454a9560-7637-4d5a-9792-a7a63cce6bc3',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            214 =>
            array(
                'id' => '50e36cd6-214e-418b-9a9f-c85e78ab8400',
                'name' => 'Sa Thầy',

                'city_id' => '4e01437c-3ac0-4958-a3a9-125f9c375c49',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            215 =>
            array(
                'id' => '50ff903f-2c94-4ba0-8378-f49dcf0b9e3a',
                'name' => 'Sóc Trăng',

                'city_id' => '1a71e7ff-a963-4364-bbbd-ecf59ae7f965',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            216 =>
            array(
                'id' => '511885fa-898d-4e51-b94c-07ef4ecff721',
                'name' => 'Tuy Phong',

                'city_id' => '454a9560-7637-4d5a-9792-a7a63cce6bc3',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            217 =>
            array(
                'id' => '514d47e3-7a69-444f-93f5-791c00296337',
                'name' => 'Việt Yên',

                'city_id' => '5e97693a-356d-4886-8ed2-b78c42f56115',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            218 =>
            array(
                'id' => '51f73399-11b3-42b5-bab4-3b567b158da2',
                'name' => 'Long Điền',

                'city_id' => 'b720536f-26aa-41c5-b29c-e0dc9fad61ad',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            219 =>
            array(
                'id' => '5200f742-bc83-4e99-bca2-7a15c24a3351',
                'name' => 'Hoàng Sa',

                'city_id' => '1de081d3-e6f4-4bab-a727-bab36f976dc9',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            220 =>
            array(
                'id' => '524959bc-f661-4f58-9d87-66e4693a862b',
                'name' => 'Tiên Du',

                'city_id' => '2ca3f74e-6ded-4339-8b12-c26e4b6d1a52',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            221 =>
            array(
                'id' => '52f46a44-46c9-4a0b-9232-bca1efdeafb9',
                'name' => 'Thị xã An Nhơn',

                'city_id' => '10878756-f388-482c-bdf2-c9a0b5f4ef7c',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            222 =>
            array(
                'id' => '53115bd2-cb81-490a-8918-9529b3f06e7b',
                'name' => 'Bảo Lộc',

                'city_id' => 'b01fa938-cffc-49b1-9e83-a337422f132e',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            223 =>
            array(
                'id' => '5313c786-bbdf-4862-9d64-488907f6c5b0',
                'name' => 'Tuy Hoà',

                'city_id' => '0920c620-d074-492e-8c99-3fb5aab15d3c',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            224 =>
            array(
                'id' => '531b232b-2cf6-435e-8982-72ec9945281d',
                'name' => 'Cao Phong',

                'city_id' => 'f05ae9d8-a765-482b-90cf-2ba6434ee185',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            225 =>
            array(
                'id' => '531deacb-1b19-4973-857f-b7c8bfa0fc24',
                'name' => 'Bắc Giang',

                'city_id' => '5e97693a-356d-4886-8ed2-b78c42f56115',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            226 =>
            array(
                'id' => '53208f67-be54-46fc-8ebd-172fcc839a8e',
                'name' => 'Tân Châu',

                'city_id' => '8c1436f7-2d32-4784-afd8-70d331936e5a',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            227 =>
            array(
                'id' => '53427830-4d43-4e44-8350-b190d95ab873',
                'name' => 'Bình Chánh',

                'city_id' => 'e30bfd9c-0668-4860-b065-455cae47d328',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            228 =>
            array(
                'id' => '53953658-d9ae-439a-bd29-34a77d25fd63',
                'name' => 'Thị xã Cai Lậy',

                'city_id' => '80180775-e6f5-4b0d-b606-ac976283638c',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            229 =>
            array(
                'id' => '54667ae4-5334-413e-9ed8-8a4bebef4b0c',
                'name' => 'Hậu Lộc',

                'city_id' => 'b577fbe5-2420-4ac7-9298-8a8bd04bc217',
                'created_at' => '2021-09-23 16:17:54',
                'updated_at' => '2021-09-23 16:17:54',
            ),
            230 =>
            array(
                'id' => '54adef77-b411-4a6a-8f5e-864a6e3f7f18',
                'name' => 'Hiệp Đức',

                'city_id' => 'e51deafd-86b7-493d-a035-b369ed6e5b5f',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            231 =>
            array(
                'id' => '54c7cc4e-0b2e-4c81-9c7d-456501528820',
                'name' => 'Tứ Kỳ',

                'city_id' => '45b755a9-2397-42da-b45e-2dc8e23e0f4f',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            232 =>
            array(
                'id' => '54de6555-5cbc-4939-b555-914053f6e238',
                'name' => 'Bù Đăng',

                'city_id' => 'f1282eac-a136-42f4-a1ad-76096405ba95',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            233 =>
            array(
                'id' => '54fd0ca1-92e0-49db-bdea-d6e4067c7f86',
                'name' => 'Cam Lâm',

                'city_id' => '67c9c91d-e4d5-4541-babb-2a5232c6ff7d',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            234 =>
            array(
                'id' => '559a6cbd-8c46-4854-97ef-e525d3a79714',
                'name' => 'Ba Tri',

                'city_id' => '7e28b375-6c0b-4c30-bbb9-2fd254cf75da',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            235 =>
            array(
                'id' => '55a872c1-690e-47f1-8c7b-0a58c6f6075c',
                'name' => 'Hớn Quản',

                'city_id' => 'f1282eac-a136-42f4-a1ad-76096405ba95',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            236 =>
            array(
                'id' => '55b72c6e-96ab-4c3b-8cca-fd5f6e325aa5',
                'name' => 'Khoái Châu',

                'city_id' => '312016bb-b80f-4456-aad2-9e69a0ea2f5f',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            237 =>
            array(
                'id' => '561ca8ae-59eb-4a31-aa67-44b989607019',
                'name' => 'Lục Yên',

                'city_id' => 'efc143a2-35ac-4f33-9934-5d9177bcb7e1',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            238 =>
            array(
                'id' => '57b0015e-8272-43c4-8342-8300ca8dd27b',
                'name' => 'Kon Plông',

                'city_id' => '4e01437c-3ac0-4958-a3a9-125f9c375c49',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            239 =>
            array(
                'id' => '580b241c-4b36-4da6-94bf-b8c4d0529964',
                'name' => 'Na Hang',

                'city_id' => 'b1ebf48f-56b7-4882-bf16-9271c1b75196',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            240 =>
            array(
                'id' => '58585627-7d61-442e-80a1-545440312eec',
                'name' => 'Cầu Giấy',

                'city_id' => '7ffe542b-8ae7-415e-b1de-6564e3f3d4ef',
                'created_at' => '2021-09-23 16:17:48',
                'updated_at' => '2021-09-23 16:17:48',
            ),
            241 =>
            array(
                'id' => '58d934c8-e585-4517-abe6-e8237f7e56b1',
                'name' => 'Thống Nhất',

                'city_id' => 'a4d945b8-b02d-41c1-880e-71ceb3168a9d',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            242 =>
            array(
                'id' => '596cddad-8ab3-4032-850c-ca49bbaefbbe',
                'name' => 'Thiệu Hóa',

                'city_id' => 'b577fbe5-2420-4ac7-9298-8a8bd04bc217',
                'created_at' => '2021-09-23 16:17:54',
                'updated_at' => '2021-09-23 16:17:54',
            ),
            243 =>
            array(
                'id' => '59ce5c17-0945-4a7b-85fd-5e04e1c560cd',
                'name' => 'Đồ Sơn',

                'city_id' => '37bf04e5-d907-443f-b7b3-b45c028a3db7',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            244 =>
            array(
                'id' => '5a186b64-f42f-4f0a-8436-e0d2f9ff520f',
                'name' => 'Ngọc Hồi',

                'city_id' => '4e01437c-3ac0-4958-a3a9-125f9c375c49',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            245 =>
            array(
                'id' => '5a53e00b-2b41-49fa-9795-201b23050e4c',
                'name' => 'Văn Giang',

                'city_id' => '312016bb-b80f-4456-aad2-9e69a0ea2f5f',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            246 =>
            array(
                'id' => '5a68c46c-dcd3-4306-bfef-c07dc70f69a7',
                'name' => 'Thạnh Phú',

                'city_id' => '7e28b375-6c0b-4c30-bbb9-2fd254cf75da',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            247 =>
            array(
                'id' => '5b6d7135-bb21-4c9e-9523-1f314e72ea68',
                'name' => 'Pác Nặm',

                'city_id' => 'c03bc001-7700-4187-b7d2-1b14ca5b73ef',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            248 =>
            array(
                'id' => '5b97b67b-1fb4-41af-a1e5-e3a63ed55b63',
                'name' => 'Mộc Hóa',

                'city_id' => 'a3e0801f-502d-4b6e-bc7e-20f616ac3931',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            249 =>
            array(
                'id' => '5bff2995-bc10-413c-a143-3918eebe3803',
                'name' => 'Minh Long',

                'city_id' => 'bc4e7995-4afa-4f16-aa08-3a5c690d79b6',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            250 =>
            array(
                'id' => '5c50ab3e-46ff-44ed-b65c-3a048fa06667',
                'name' => 'Thường Tín',

                'city_id' => '7ffe542b-8ae7-415e-b1de-6564e3f3d4ef',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            251 =>
            array(
                'id' => '5c75cafe-bd71-4475-a1e4-5d14f55fdf20',
                'name' => 'Tân Hiệp',

                'city_id' => '9104b60d-125b-45de-8f0c-e14893ef5ee3',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            252 =>
            array(
                'id' => '5c7661d3-3c12-4294-a7fe-deee1416e09d',
                'name' => 'Hà Quảng',

                'city_id' => 'da297b82-b4de-4c8d-a252-b2df97fa8be7',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            253 =>
            array(
                'id' => '5cc0ed14-ed04-475b-aae1-71878d3b5e0a',
                'name' => 'Việt Trì',

                'city_id' => '7beeed0d-f6f7-49a3-87ff-4e363a27108a',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            254 =>
            array(
                'id' => '5d23d3d2-f18f-44e6-b744-a42e2bd0398a',
                'name' => 'Thanh Miện',

                'city_id' => '45b755a9-2397-42da-b45e-2dc8e23e0f4f',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            255 =>
            array(
                'id' => '5dd65286-9562-4e30-8375-1df86d1e5ea6',
                'name' => 'Hương Khê',

                'city_id' => '250bf51a-3b01-4246-ab2b-7583bdaf89e1',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            256 =>
            array(
                'id' => '5e107790-76d9-4899-b492-5a4199039021',
                'name' => 'Thị xã Bình Long',

                'city_id' => 'f1282eac-a136-42f4-a1ad-76096405ba95',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            257 =>
            array(
                'id' => '5ef49cf6-3b4e-44e9-bd8f-e7f63a7cd7d8',
                'name' => 'Châu Thành',

                'city_id' => 'f6275b3f-09de-44b3-87a2-b9cec4ae89c8',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            258 =>
            array(
                'id' => '5f5ccf0d-6df3-40b4-a12f-07bd6be50982',
                'name' => 'Mỹ Xuyên',

                'city_id' => '1a71e7ff-a963-4364-bbbd-ecf59ae7f965',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            259 =>
            array(
                'id' => '602029a9-7fa1-4fd4-b622-1946e5d767f8',
                'name' => 'Hữu Lũng',

                'city_id' => '01822d18-7a7e-4b64-970c-c00bde7cae5e',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            260 =>
            array(
                'id' => '6071b5a9-3758-409d-ad16-fceda57aa404',
                'name' => 'Quế Phong',

                'city_id' => '80ca44a2-9bfc-448a-9b43-ca3d741fa868',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            261 =>
            array(
                'id' => '6122974f-a874-42a5-afa8-2337651cd5fa',
                'name' => 'Vụ Bản',

                'city_id' => '6d698fb4-9a6a-4504-8634-ab32e39c4aa8',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            262 =>
            array(
                'id' => '6136ead7-53ae-4133-8af8-b53b737b705a',
                'name' => 'Thái Bình',

                'city_id' => '0dcb18c9-edea-4255-81ea-34ab31c60c28',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            263 =>
            array(
                'id' => '61ee55ec-8bb6-4c00-a781-8205740369e2',
                'name' => 'Trần Văn Thời',

                'city_id' => 'd37a60f8-a1b0-4152-8778-395791e523f6',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            264 =>
            array(
                'id' => '624ea356-70fe-4eff-a088-10e1423ec510',
                'name' => 'Yên Bình',

                'city_id' => 'efc143a2-35ac-4f33-9934-5d9177bcb7e1',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            265 =>
            array(
                'id' => '627d6b43-7bad-45e0-b9e5-b11612fc2d2d',
                'name' => 'Đắk Tô',

                'city_id' => '4e01437c-3ac0-4958-a3a9-125f9c375c49',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            266 =>
            array(
                'id' => '637038f6-2a78-4fca-bfc1-0366c67a1cee',
                'name' => 'Sầm Sơn',

                'city_id' => 'b577fbe5-2420-4ac7-9298-8a8bd04bc217',
                'created_at' => '2021-09-23 16:17:54',
                'updated_at' => '2021-09-23 16:17:54',
            ),
            267 =>
            array(
                'id' => '63dc7a99-45c0-4789-af5b-27a0f544b82d',
                'name' => 'Thanh Hóa',

                'city_id' => 'b577fbe5-2420-4ac7-9298-8a8bd04bc217',
                'created_at' => '2021-09-23 16:17:54',
                'updated_at' => '2021-09-23 16:17:54',
            ),
            268 =>
            array(
                'id' => '63ef8eaa-d7b3-4b5a-872e-28f09ade1209',
                'name' => 'Ninh Hải',

                'city_id' => '0a602243-f105-4c21-9a39-a9317d4c8aae',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            269 =>
            array(
                'id' => '643b9057-bc49-437b-8d6a-8193ce0ba4bf',
                'name' => 'Văn Lãng',

                'city_id' => '01822d18-7a7e-4b64-970c-c00bde7cae5e',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            270 =>
            array(
                'id' => '645c3291-80e0-4776-8b15-50ec203721f8',
                'name' => 'Đức Huệ',

                'city_id' => 'a3e0801f-502d-4b6e-bc7e-20f616ac3931',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            271 =>
            array(
                'id' => '645ec1a1-3d01-432f-a1ec-e066fc174275',
                'name' => 'Quận 1',

                'city_id' => 'e30bfd9c-0668-4860-b065-455cae47d328',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            272 =>
            array(
                'id' => '6467ec85-3a89-4ae2-bb36-40cb4c7ec2a5',
                'name' => 'Bảo Lạc',

                'city_id' => 'da297b82-b4de-4c8d-a252-b2df97fa8be7',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            273 =>
            array(
                'id' => '64948bb4-ffb7-412c-900f-c7552f7b91e8',
                'name' => 'Hưng Yên',

                'city_id' => '312016bb-b80f-4456-aad2-9e69a0ea2f5f',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            274 =>
            array(
                'id' => '6499ff25-f923-48ee-b5a6-64251dfa8b9b',
                'name' => 'Thái Thụy',

                'city_id' => '0dcb18c9-edea-4255-81ea-34ab31c60c28',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            275 =>
            array(
                'id' => '64d62896-23fc-4be3-b2e0-d0955455bdba',
                'name' => 'Văn Chấn',

                'city_id' => 'efc143a2-35ac-4f33-9934-5d9177bcb7e1',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            276 =>
            array(
                'id' => '664665ef-13e8-4de2-ac9d-26d3c9bc1d39',
                'name' => 'Vị Thanh',

                'city_id' => '63cea115-2d29-4893-ba22-518aa3451f35',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            277 =>
            array(
                'id' => '66ad63ce-8eb4-407b-b5d8-082daab51466',
                'name' => 'Thạch Thất',

                'city_id' => '7ffe542b-8ae7-415e-b1de-6564e3f3d4ef',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            278 =>
            array(
                'id' => '66fa8307-02af-4caf-b77f-484403b7697e',
                'name' => 'Sông Lô',

                'city_id' => '90bbe443-069a-4354-8e96-8fcb1c2870bf',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            279 =>
            array(
                'id' => '673b917d-bcdc-4a9a-9fa8-8888f1a43d67',
                'name' => 'Châu Thành',

                'city_id' => 'a3e0801f-502d-4b6e-bc7e-20f616ac3931',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            280 =>
            array(
                'id' => '677d6a93-ca6c-4eae-97ee-ae6e874ed93a',
                'name' => 'Lâm Hà',

                'city_id' => 'b01fa938-cffc-49b1-9e83-a337422f132e',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            281 =>
            array(
                'id' => '67cf9501-c9ff-4f58-8d0f-da4708bc030b',
                'name' => 'Đắk Song',

                'city_id' => '5563c615-1302-4c13-994c-4ed3f3695f76',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            282 =>
            array(
                'id' => '68592d15-f79a-4c6a-b6fc-df4eef044f92',
                'name' => 'Phan Rang-Tháp Chàm',

                'city_id' => '0a602243-f105-4c21-9a39-a9317d4c8aae',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            283 =>
            array(
                'id' => '69c4f3bd-21ea-4e28-aa45-97a37701309f',
                'name' => 'Đam Rông',

                'city_id' => 'b01fa938-cffc-49b1-9e83-a337422f132e',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            284 =>
            array(
                'id' => '6a587c30-a890-4072-87f6-ac8e77c1b8dc',
                'name' => 'Duy Xuyên',

                'city_id' => 'e51deafd-86b7-493d-a035-b369ed6e5b5f',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            285 =>
            array(
                'id' => '6afd6ec9-7993-46bf-9a66-c157019bdd09',
                'name' => 'Yên Mỹ',

                'city_id' => '312016bb-b80f-4456-aad2-9e69a0ea2f5f',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            286 =>
            array(
                'id' => '6bb7180d-add1-45ee-a78d-e11b7dd1840e',
                'name' => 'Hưng Nguyên',

                'city_id' => '80ca44a2-9bfc-448a-9b43-ca3d741fa868',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            287 =>
            array(
                'id' => '6bc79b1c-06f9-47ff-a305-7fc327eb9ee4',
                'name' => 'Kiến Thụy',

                'city_id' => '37bf04e5-d907-443f-b7b3-b45c028a3db7',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            288 =>
            array(
                'id' => '6bedfa16-4a49-4689-b3de-c1e9d2abecb2',
                'name' => 'Phủ Lý',

                'city_id' => '485eb0a2-0f49-4690-a615-e2e8ed951656',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            289 =>
            array(
                'id' => '6c40af67-5505-4857-8e3d-3498242c81e6',
                'name' => 'Bình Xuyên',

                'city_id' => '90bbe443-069a-4354-8e96-8fcb1c2870bf',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            290 =>
            array(
                'id' => '6c96bbe5-474d-4532-b5fc-0a40dd6b9c54',
                'name' => 'Lộc Bình',

                'city_id' => '01822d18-7a7e-4b64-970c-c00bde7cae5e',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            291 =>
            array(
                'id' => '6ca8389a-57a8-4307-ab48-bf012fbef86c',
                'name' => 'Đan Phượng',

                'city_id' => '7ffe542b-8ae7-415e-b1de-6564e3f3d4ef',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            292 =>
            array(
                'id' => '6cbada89-fe97-4c52-a9dd-863dc3a982bc',
                'name' => 'Hội An',

                'city_id' => 'e51deafd-86b7-493d-a035-b369ed6e5b5f',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            293 =>
            array(
                'id' => '6cf25140-b002-4aec-874a-44bc7689715f',
                'name' => 'Mộc Châu',

                'city_id' => '30e8ea4f-cd4b-4e19-b8ed-9d21e06f531b',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            294 =>
            array(
                'id' => '6d6fed89-3e9c-405c-9f07-87851277bcc0',
                'name' => 'Châu Thành',

                'city_id' => 'fef45e17-2058-4cb8-ac6d-51f4d082b088',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            295 =>
            array(
                'id' => '6dd75c15-a89e-4adc-ae1c-f960a7d6100f',
                'name' => 'Bát Xát',

                'city_id' => '637ad6dd-e601-46db-9f06-a36937ff1b0a',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            296 =>
            array(
                'id' => '6e222803-1b37-4444-bec0-49fd621194f8',
                'name' => 'Trường Sa',

                'city_id' => '67c9c91d-e4d5-4541-babb-2a5232c6ff7d',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            297 =>
            array(
                'id' => '6e2c2ca1-7a25-4767-b514-a65ec92162c8',
                'name' => 'Bắc Mê',

                'city_id' => 'd1d97f9b-ca69-415f-afcd-a3e4decd023e',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            298 =>
            array(
                'id' => '6ee5001e-aa27-4e6c-80a4-4aaadd110e3b',
                'name' => 'Bến Cầu',

                'city_id' => '8c1436f7-2d32-4784-afd8-70d331936e5a',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            299 =>
            array(
                'id' => '6eecd07b-7d09-4a36-ba7b-c770d3a83808',
                'name' => 'Yên Lập',

                'city_id' => '7beeed0d-f6f7-49a3-87ff-4e363a27108a',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            300 =>
            array(
                'id' => '6f67d03b-b9d7-49c2-b166-4556b79a0e75',
                'name' => 'Quan Sơn',

                'city_id' => 'b577fbe5-2420-4ac7-9298-8a8bd04bc217',
                'created_at' => '2021-09-23 16:17:54',
                'updated_at' => '2021-09-23 16:17:54',
            ),
            301 =>
            array(
                'id' => '712796d5-45f7-442a-9cfe-d7fe85581b23',
                'name' => 'Krông Bông',

                'city_id' => 'c0e9071f-1445-479a-b658-7d312ed909fd',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            302 =>
            array(
                'id' => '717937cf-7238-4ba1-acac-af325583c05c',
                'name' => 'Thị xã Đông Triều',

                'city_id' => 'd4dcf702-42a9-4068-8d9e-176d22279e32',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            303 =>
            array(
                'id' => '7275121b-8bd6-45df-8786-412b7707165f',
                'name' => 'Rạch Giá',

                'city_id' => '9104b60d-125b-45de-8f0c-e14893ef5ee3',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            304 =>
            array(
                'id' => '72afbd08-dd63-4d37-8488-451b5b20d4fd',
                'name' => 'Quận 4',

                'city_id' => 'e30bfd9c-0668-4860-b065-455cae47d328',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            305 =>
            array(
                'id' => '72f61a65-0915-47ae-861a-1fffc1008494',
                'name' => 'Xuân Lộc',

                'city_id' => 'a4d945b8-b02d-41c1-880e-71ceb3168a9d',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            306 =>
            array(
                'id' => '7307c690-837c-4fbc-a1aa-ee644ff4ee4a',
                'name' => 'Thạnh Trị',

                'city_id' => '1a71e7ff-a963-4364-bbbd-ecf59ae7f965',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            307 =>
            array(
                'id' => '73ff487c-d186-4bab-a888-8a6b93d8ae15',
                'name' => 'Vĩnh Lợi',

                'city_id' => '65d1fabe-3373-4612-bb48-4fd92866c5fe',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            308 =>
            array(
                'id' => '7438ee48-7f25-4ee7-a75a-05acb68d5447',
                'name' => 'Thường Xuân',

                'city_id' => 'b577fbe5-2420-4ac7-9298-8a8bd04bc217',
                'created_at' => '2021-09-23 16:17:54',
                'updated_at' => '2021-09-23 16:17:54',
            ),
            309 =>
            array(
                'id' => '746bad99-170c-418c-a6ce-a2ac33b71077',
                'name' => 'Thị xã Quảng Trị',

                'city_id' => '6b1145ac-a1dd-42e8-9b9f-5d2cceb14253',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            310 =>
            array(
                'id' => '7476b07a-1ad4-42cf-9c13-fafd4311818c',
                'name' => 'Tam Đường',

                'city_id' => 'f69c204f-2c46-44dc-a932-12d7cec3a669',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            311 =>
            array(
                'id' => '768a1277-07d6-4026-b456-1fd067924c06',
                'name' => 'Anh Sơn',

                'city_id' => '80ca44a2-9bfc-448a-9b43-ca3d741fa868',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            312 =>
            array(
                'id' => '76d7418e-dbb5-4805-bd97-962e566bd61d',
                'name' => 'Thủ Thừa',

                'city_id' => 'a3e0801f-502d-4b6e-bc7e-20f616ac3931',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            313 =>
            array(
                'id' => '778fc070-bce5-4733-b444-0c31a6399300',
                'name' => 'Tân Lạc',

                'city_id' => 'f05ae9d8-a765-482b-90cf-2ba6434ee185',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            314 =>
            array(
                'id' => '78a2c3cc-dd1a-420f-9c73-2f7cfd17e4f9',
                'name' => 'Hạ Hoà',

                'city_id' => '7beeed0d-f6f7-49a3-87ff-4e363a27108a',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            315 =>
            array(
                'id' => '78ebd527-ab0b-47c5-8888-6155a15b4e99',
                'name' => 'Cù Lao Dung',

                'city_id' => '1a71e7ff-a963-4364-bbbd-ecf59ae7f965',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            316 =>
            array(
                'id' => '795576bb-1d5a-47b2-9313-14a15921f632',
                'name' => 'Tam Kỳ',

                'city_id' => 'e51deafd-86b7-493d-a035-b369ed6e5b5f',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            317 =>
            array(
                'id' => '797f101d-01a7-4164-be93-5aa144dfbcd3',
                'name' => 'Trà Bồng',

                'city_id' => 'bc4e7995-4afa-4f16-aa08-3a5c690d79b6',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            318 =>
            array(
                'id' => '79b55425-f48e-470d-bf94-680d4f5bc9a4',
                'name' => 'Tuy An',

                'city_id' => '0920c620-d074-492e-8c99-3fb5aab15d3c',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            319 =>
            array(
                'id' => '7a04658e-77e7-4910-b618-3315d4e15eaa',
                'name' => 'Sìn Hồ',

                'city_id' => 'f69c204f-2c46-44dc-a932-12d7cec3a669',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            320 =>
            array(
                'id' => '7a2a0b64-493f-4b07-96d6-70813b02f2b0',
                'name' => 'Quận 5',

                'city_id' => 'e30bfd9c-0668-4860-b065-455cae47d328',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            321 =>
            array(
                'id' => '7a524930-1f1f-4d7d-8076-17f2a2d4f1e1',
                'name' => 'Vị Thủy',

                'city_id' => '63cea115-2d29-4893-ba22-518aa3451f35',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            322 =>
            array(
                'id' => '7a72df5d-7f6d-4ab0-b73a-a0fc8bcc0618',
                'name' => 'U Minh',

                'city_id' => 'd37a60f8-a1b0-4152-8778-395791e523f6',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            323 =>
            array(
                'id' => '7aa5db57-e982-4b8e-9d6d-8119686d603d',
                'name' => 'Hải Lăng',

                'city_id' => '6b1145ac-a1dd-42e8-9b9f-5d2cceb14253',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            324 =>
            array(
                'id' => '7abc17e6-2439-4bbd-b6bd-4143a2f41c73',
                'name' => 'Bình Giang',

                'city_id' => '45b755a9-2397-42da-b45e-2dc8e23e0f4f',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            325 =>
            array(
                'id' => '7af1d2be-e9d4-4d41-9133-746f913e20ab',
                'name' => 'Hà Đông',

                'city_id' => '7ffe542b-8ae7-415e-b1de-6564e3f3d4ef',
                'created_at' => '2021-09-23 16:17:48',
                'updated_at' => '2021-09-23 16:17:48',
            ),
            326 =>
            array(
                'id' => '7b6df249-a476-48da-a861-005ba07d27b5',
                'name' => 'Quận 12',

                'city_id' => 'e30bfd9c-0668-4860-b065-455cae47d328',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            327 =>
            array(
                'id' => '7b817806-8bd0-4eac-b188-237d52938222',
                'name' => 'Vĩnh Yên',

                'city_id' => '90bbe443-069a-4354-8e96-8fcb1c2870bf',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            328 =>
            array(
                'id' => '7ba8bab0-8f5e-42c7-a35a-ba976a16edc8',
                'name' => 'Phước Sơn',

                'city_id' => 'e51deafd-86b7-493d-a035-b369ed6e5b5f',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            329 =>
            array(
                'id' => '7c66e249-6a47-44af-a4c1-e1c742e343c1',
                'name' => 'Thanh Trì',

                'city_id' => '7ffe542b-8ae7-415e-b1de-6564e3f3d4ef',
                'created_at' => '2021-09-23 16:17:48',
                'updated_at' => '2021-09-23 16:17:48',
            ),
            330 =>
            array(
                'id' => '7cae77a4-57c8-4f37-beaa-f5152bcfb2f4',
                'name' => 'Kông Chro',

                'city_id' => '64b7dd07-06f2-4ebb-9060-5b43862c9492',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            331 =>
            array(
                'id' => '7cf19825-82b4-4e30-9fb6-da06f5e15caf',
                'name' => 'Thị xã Hồng Lĩnh',

                'city_id' => '250bf51a-3b01-4246-ab2b-7583bdaf89e1',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            332 =>
            array(
                'id' => '7d94dc7f-3fb2-4717-b0c9-caeb610baa46',
                'name' => 'Khánh Sơn',

                'city_id' => '67c9c91d-e4d5-4541-babb-2a5232c6ff7d',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            333 =>
            array(
                'id' => '7e7421c8-be7b-4e01-8595-d3916ca90894',
                'name' => 'Hòa Vang',

                'city_id' => '1de081d3-e6f4-4bab-a727-bab36f976dc9',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            334 =>
            array(
                'id' => '7e8df14b-6c55-4c54-b3d7-efd6341c2483',
                'name' => 'Bạch Thông',

                'city_id' => 'c03bc001-7700-4187-b7d2-1b14ca5b73ef',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            335 =>
            array(
                'id' => '7f288296-6bcb-453c-b76f-22954fa1f25e',
                'name' => 'Vạn Ninh',

                'city_id' => '67c9c91d-e4d5-4541-babb-2a5232c6ff7d',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            336 =>
            array(
                'id' => '7f5c6f42-9cc0-462c-8ccd-95756155a49b',
                'name' => 'Tân Phước',

                'city_id' => '80180775-e6f5-4b0d-b606-ac976283638c',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            337 =>
            array(
                'id' => '7fbefe64-6586-4a46-88f8-a15560b6ec35',
                'name' => 'Long Mỹ',

                'city_id' => '63cea115-2d29-4893-ba22-518aa3451f35',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            338 =>
            array(
                'id' => '804d7ca1-8a26-4b62-9521-a0c914e59a3b',
                'name' => 'Sơn Hà',

                'city_id' => 'bc4e7995-4afa-4f16-aa08-3a5c690d79b6',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            339 =>
            array(
                'id' => '806eb6b0-6e8b-4fc4-84dc-a267dc199a19',
                'name' => 'Mang Thít',

                'city_id' => '9d68ecc4-0cce-419e-baa8-9f4b320fc3da',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            340 =>
            array(
                'id' => '80a743a3-2ea9-4dd5-b96d-1f7e5c81da2a',
                'name' => 'Xuyên Mộc',

                'city_id' => 'b720536f-26aa-41c5-b29c-e0dc9fad61ad',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            341 =>
            array(
                'id' => '80c4b396-aabe-48c2-a0fc-f2dfc2bbdd67',
                'name' => 'Thị xã Ngã Năm',

                'city_id' => '1a71e7ff-a963-4364-bbbd-ecf59ae7f965',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            342 =>
            array(
                'id' => '8193655e-7c27-4521-9b61-e32a7b6874f6',
                'name' => 'Yên Thành',

                'city_id' => '80ca44a2-9bfc-448a-9b43-ca3d741fa868',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            343 =>
            array(
                'id' => '81c9fb05-8970-4c80-a051-298ef51b720e',
                'name' => 'Năm Căn',

                'city_id' => 'd37a60f8-a1b0-4152-8778-395791e523f6',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            344 =>
            array(
                'id' => '820354fb-0cf0-4832-90c7-cc3dc95d7044',
                'name' => 'Đơn Dương',

                'city_id' => 'b01fa938-cffc-49b1-9e83-a337422f132e',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            345 =>
            array(
                'id' => '8276649e-959d-4a42-ad79-2bfaabbc5e46',
                'name' => 'Yên Lạc',

                'city_id' => '90bbe443-069a-4354-8e96-8fcb1c2870bf',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            346 =>
            array(
                'id' => '83b4e6cb-0dd5-48b4-99c8-973f2d0e6f68',
                'name' => 'Ba Tơ',

                'city_id' => 'bc4e7995-4afa-4f16-aa08-3a5c690d79b6',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            347 =>
            array(
                'id' => '847b1eb2-4308-4a37-a9fd-939c111b3e3c',
                'name' => 'Bắc Sơn',

                'city_id' => '01822d18-7a7e-4b64-970c-c00bde7cae5e',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            348 =>
            array(
                'id' => '849db172-547a-480f-81ce-6ed151b7fca3',
                'name' => 'An Biên',

                'city_id' => '9104b60d-125b-45de-8f0c-e14893ef5ee3',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            349 =>
            array(
                'id' => '85c92ce4-65c3-411c-b5dd-44bead9ef1e4',
                'name' => 'Cần Giuộc',

                'city_id' => 'a3e0801f-502d-4b6e-bc7e-20f616ac3931',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            350 =>
            array(
                'id' => '85f189de-2f58-4d4d-94f2-2596898f2777',
                'name' => 'Đức Linh',

                'city_id' => '454a9560-7637-4d5a-9792-a7a63cce6bc3',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            351 =>
            array(
                'id' => '8609316a-42d4-4fa3-b6ad-14257b4f8312',
                'name' => 'Gia Nghĩa',

                'city_id' => '5563c615-1302-4c13-994c-4ed3f3695f76',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            352 =>
            array(
                'id' => '864c499a-8ee0-48ff-a320-60f527eb9f43',
                'name' => 'Lệ Thủy',

                'city_id' => '1182ce56-8620-4d32-a32c-9561dcb52983',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            353 =>
            array(
                'id' => '86653c4a-47b0-4b70-affc-13962c242d96',
                'name' => 'Dương Minh Châu',

                'city_id' => '8c1436f7-2d32-4784-afd8-70d331936e5a',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            354 =>
            array(
                'id' => '86c76d9d-3517-457b-b836-ec4dcb784f1e',
                'name' => 'Ea Súp',

                'city_id' => 'c0e9071f-1445-479a-b658-7d312ed909fd',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            355 =>
            array(
                'id' => '878af462-9309-42c3-a9b6-b99cd9d53383',
                'name' => 'An Lão',

                'city_id' => '37bf04e5-d907-443f-b7b3-b45c028a3db7',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            356 =>
            array(
                'id' => '880596b2-e6b1-47f7-8d2b-f6c62d91f95e',
                'name' => 'Ngọc Hiển',

                'city_id' => 'd37a60f8-a1b0-4152-8778-395791e523f6',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            357 =>
            array(
                'id' => '88408601-dc88-4487-a55f-2d91cb4e2978',
                'name' => 'Phước Long',

                'city_id' => '65d1fabe-3373-4612-bb48-4fd92866c5fe',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            358 =>
            array(
                'id' => '88d26048-3259-4583-8683-091e544d2be9',
                'name' => 'Thanh Ba',

                'city_id' => '7beeed0d-f6f7-49a3-87ff-4e363a27108a',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            359 =>
            array(
                'id' => '88dd575f-3a3a-4a0f-ad4b-7a46379abbc8',
                'name' => 'Sóc Sơn',

                'city_id' => '7ffe542b-8ae7-415e-b1de-6564e3f3d4ef',
                'created_at' => '2021-09-23 16:17:48',
                'updated_at' => '2021-09-23 16:17:48',
            ),
            360 =>
            array(
                'id' => '8a25778f-508f-475b-a008-01ac5f39a452',
                'name' => 'Yên Bái',

                'city_id' => 'efc143a2-35ac-4f33-9934-5d9177bcb7e1',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            361 =>
            array(
                'id' => '8a518810-b288-4bda-b166-d85b73444f12',
                'name' => 'Phù Mỹ',

                'city_id' => '10878756-f388-482c-bdf2-c9a0b5f4ef7c',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            362 =>
            array(
                'id' => '8a957cac-50af-4ded-8cb8-0ae8d22ef57b',
                'name' => 'Đông Hưng',

                'city_id' => '0dcb18c9-edea-4255-81ea-34ab31c60c28',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            363 =>
            array(
                'id' => '8adf809b-b330-465a-a5df-3b3cba0ac586',
                'name' => 'Đồng Phú',

                'city_id' => 'f1282eac-a136-42f4-a1ad-76096405ba95',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            364 =>
            array(
                'id' => '8b13ff11-3213-471e-978b-12b3b4e71ff8',
                'name' => 'Quận 8',

                'city_id' => 'e30bfd9c-0668-4860-b065-455cae47d328',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            365 =>
            array(
                'id' => '8b367fca-4ef8-4711-95f9-befcf4996c63',
                'name' => 'Vĩnh Bảo',

                'city_id' => '37bf04e5-d907-443f-b7b3-b45c028a3db7',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            366 =>
            array(
                'id' => '8b68dead-238f-40e0-95db-0d19e6225537',
                'name' => 'Chợ Lách',

                'city_id' => '7e28b375-6c0b-4c30-bbb9-2fd254cf75da',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            367 =>
            array(
                'id' => '8bded960-fc2c-4977-8732-58b6fd88b208',
                'name' => 'Lai Vung',

                'city_id' => 'fef45e17-2058-4cb8-ac6d-51f4d082b088',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            368 =>
            array(
                'id' => '8c2e069e-b82a-40c4-bb20-45ab76142527',
                'name' => 'Vĩnh Tường',

                'city_id' => '90bbe443-069a-4354-8e96-8fcb1c2870bf',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            369 =>
            array(
                'id' => '8c4b61ca-6284-4d3b-971e-c3413b3f73f4',
                'name' => 'Bình Thủy',

                'city_id' => '78810fa4-611c-4088-aa1b-777926ec9b13',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            370 =>
            array(
                'id' => '8c4ec2d6-2798-41bd-9b91-ac6ef291304e',
                'name' => 'Lạng Giang',

                'city_id' => '5e97693a-356d-4886-8ed2-b78c42f56115',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            371 =>
            array(
                'id' => '8ca19282-afc5-4912-a931-7eb15d0fa26c',
                'name' => 'Hải Hà',

                'city_id' => 'd4dcf702-42a9-4068-8d9e-176d22279e32',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            372 =>
            array(
                'id' => '8cecd573-6aac-4a3d-a9dd-7b2b6a070b68',
                'name' => 'Ia Pa',

                'city_id' => '64b7dd07-06f2-4ebb-9060-5b43862c9492',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            373 =>
            array(
                'id' => '8d0c1dc1-afcd-4e40-b961-7d5748af04a0',
                'name' => 'Quảng Ngãi',

                'city_id' => 'bc4e7995-4afa-4f16-aa08-3a5c690d79b6',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            374 =>
            array(
                'id' => '8d2fecef-aa3f-4547-831d-2865446765b8',
                'name' => 'Ba Bể',

                'city_id' => 'c03bc001-7700-4187-b7d2-1b14ca5b73ef',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            375 =>
            array(
                'id' => '8d422156-d55d-46af-baa8-07efd28904ab',
                'name' => 'Chư Pưh',

                'city_id' => '64b7dd07-06f2-4ebb-9060-5b43862c9492',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            376 =>
            array(
                'id' => '8dd573be-95ee-48f4-bf69-8bb638f8c06e',
                'name' => 'Phù Cát',

                'city_id' => '10878756-f388-482c-bdf2-c9a0b5f4ef7c',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            377 =>
            array(
                'id' => '8e5c7f29-ce4c-4184-914c-cc62493d8b5c',
                'name' => 'Thủy Nguyên',

                'city_id' => '37bf04e5-d907-443f-b7b3-b45c028a3db7',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            378 =>
            array(
                'id' => '8e845e61-8a82-4aaa-9326-b635e5d644b4',
                'name' => 'Cần Đước',

                'city_id' => 'a3e0801f-502d-4b6e-bc7e-20f616ac3931',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            379 =>
            array(
                'id' => '8ecbd40b-a03f-4042-9203-35de53528de7',
                'name' => 'Tiền Hải',

                'city_id' => '0dcb18c9-edea-4255-81ea-34ab31c60c28',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            380 =>
            array(
                'id' => '8eebc9af-eb45-416d-a347-d086bcabff03',
                'name' => 'Biên Hòa',

                'city_id' => 'a4d945b8-b02d-41c1-880e-71ceb3168a9d',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            381 =>
            array(
                'id' => '90486e5b-bf5c-407d-be80-41bbcc7ec939',
                'name' => 'Cẩm Lệ',

                'city_id' => '1de081d3-e6f4-4bab-a727-bab36f976dc9',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            382 =>
            array(
                'id' => '90902d2b-8a9b-4aab-bbe6-3412594b8e5b',
                'name' => 'Bố Trạch',

                'city_id' => '1182ce56-8620-4d32-a32c-9561dcb52983',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            383 =>
            array(
                'id' => '9117927f-46fa-46e0-b166-ea010b7145b0',
                'name' => 'Than Uyên',

                'city_id' => 'f69c204f-2c46-44dc-a932-12d7cec3a669',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            384 =>
            array(
                'id' => '91420e62-3ae8-4265-ac83-ff5793621047',
                'name' => 'Cẩm Khê',

                'city_id' => '7beeed0d-f6f7-49a3-87ff-4e363a27108a',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            385 =>
            array(
                'id' => '914bb3f3-2d6a-42e1-8b72-db80969345d8',
                'name' => 'Phụng Hiệp',

                'city_id' => '63cea115-2d29-4893-ba22-518aa3451f35',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            386 =>
            array(
                'id' => '91a49d9d-0f9e-40d7-93fc-a9673f47636a',
                'name' => 'Thị xã Ayun Pa',

                'city_id' => '64b7dd07-06f2-4ebb-9060-5b43862c9492',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            387 =>
            array(
                'id' => '91a8c06f-2d80-4642-a983-5ac3872b35e4',
                'name' => 'Hòa Bình',

                'city_id' => '65d1fabe-3373-4612-bb48-4fd92866c5fe',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            388 =>
            array(
                'id' => '91fec2d6-b3ca-4ea9-b0d5-735b57532cee',
                'name' => 'Xuân Trường',

                'city_id' => '6d698fb4-9a6a-4504-8634-ab32e39c4aa8',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            389 =>
            array(
                'id' => '921c29e4-026b-4660-a4a8-e765ac01a7fa',
                'name' => 'Ý Yên',

                'city_id' => '6d698fb4-9a6a-4504-8634-ab32e39c4aa8',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            390 =>
            array(
                'id' => '924f7418-6899-4a80-b011-913809b1b355',
                'name' => 'U Minh Thượng',

                'city_id' => '9104b60d-125b-45de-8f0c-e14893ef5ee3',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            391 =>
            array(
                'id' => '92502fb4-66c0-4526-bb4f-929c83cdd36c',
                'name' => 'Đức Trọng',

                'city_id' => 'b01fa938-cffc-49b1-9e83-a337422f132e',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            392 =>
            array(
                'id' => '92e4a9af-bda5-4752-9bd4-5e3e2924154a',
                'name' => 'Hồng Dân',

                'city_id' => '65d1fabe-3373-4612-bb48-4fd92866c5fe',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            393 =>
            array(
                'id' => '9333139e-e84f-4f85-98f5-7a4333b62bde',
                'name' => 'Sông Công',

                'city_id' => '1a07bb93-f1d7-4c58-9578-036b0d20741b',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            394 =>
            array(
                'id' => '937a02df-f7e9-495b-92a8-a62536ee148e',
                'name' => 'Thanh Liêm',

                'city_id' => '485eb0a2-0f49-4690-a615-e2e8ed951656',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            395 =>
            array(
                'id' => '93c45bc2-f7c7-44ff-bef1-038338966cd2',
                'name' => 'Hoằng Hóa',

                'city_id' => 'b577fbe5-2420-4ac7-9298-8a8bd04bc217',
                'created_at' => '2021-09-23 16:17:54',
                'updated_at' => '2021-09-23 16:17:54',
            ),
            396 =>
            array(
                'id' => '93e3d039-ce8a-40a4-b5df-114293b59abc',
                'name' => 'Vân Canh',

                'city_id' => '10878756-f388-482c-bdf2-c9a0b5f4ef7c',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            397 =>
            array(
                'id' => '952707a6-3e9e-4df7-acb8-c1deb5c7585d',
                'name' => 'Thị xã Nghi Sơn',

                'city_id' => 'b577fbe5-2420-4ac7-9298-8a8bd04bc217',
                'created_at' => '2021-09-23 16:17:54',
                'updated_at' => '2021-09-23 16:17:54',
            ),
            398 =>
            array(
                'id' => '9535a609-13d8-48d6-b55d-79c5113cae9b',
                'name' => 'Hà Tiên',

                'city_id' => '9104b60d-125b-45de-8f0c-e14893ef5ee3',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            399 =>
            array(
                'id' => '95b2d2e9-dabe-4fc4-a18b-36c0fff215ff',
                'name' => 'Tri Tôn',

                'city_id' => 'fb0e6f30-8a60-44f2-85b9-4c3c13c14220',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            400 =>
            array(
                'id' => '95efba46-c624-432c-b523-e57d3fa082ba',
                'name' => 'Tịnh Biên',

                'city_id' => 'fb0e6f30-8a60-44f2-85b9-4c3c13c14220',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            401 =>
            array(
                'id' => '95f0f94c-f0e5-4696-8e25-939eb5af4b89',
                'name' => 'Hoàn Kiếm',

                'city_id' => '7ffe542b-8ae7-415e-b1de-6564e3f3d4ef',
                'created_at' => '2021-09-23 16:17:48',
                'updated_at' => '2021-09-23 16:17:48',
            ),
            402 =>
            array(
                'id' => '96b1ea6f-6dd6-41f7-ac2e-85e243601975',
                'name' => 'Thị xã Hoài Nhơn',

                'city_id' => '10878756-f388-482c-bdf2-c9a0b5f4ef7c',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            403 =>
            array(
                'id' => '96bfbd2f-1dd1-4eac-9d6d-abefb192049e',
                'name' => 'Nhơn Trạch',

                'city_id' => 'a4d945b8-b02d-41c1-880e-71ceb3168a9d',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            404 =>
            array(
                'id' => '97053f62-b310-4748-b367-ae97c6403d10',
                'name' => 'Đông Anh',

                'city_id' => '7ffe542b-8ae7-415e-b1de-6564e3f3d4ef',
                'created_at' => '2021-09-23 16:17:48',
                'updated_at' => '2021-09-23 16:17:48',
            ),
            405 =>
            array(
                'id' => '9763b0eb-fe19-421e-b342-c40002532e97',
                'name' => 'Hồng Bàng',

                'city_id' => '37bf04e5-d907-443f-b7b3-b45c028a3db7',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            406 =>
            array(
                'id' => '982ad100-fd53-4eef-9f9e-d6203d0806a7',
                'name' => 'Hoàng Mai',

                'city_id' => '7ffe542b-8ae7-415e-b1de-6564e3f3d4ef',
                'created_at' => '2021-09-23 16:17:48',
                'updated_at' => '2021-09-23 16:17:48',
            ),
            407 =>
            array(
                'id' => '98de574f-7c15-4199-87f5-256f5ba4f9bd',
                'name' => 'Bù Gia Mập',

                'city_id' => 'f1282eac-a136-42f4-a1ad-76096405ba95',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            408 =>
            array(
                'id' => '995b256e-c45e-41b4-bf5a-a55adbe05c26',
                'name' => 'Nghi Lộc',

                'city_id' => '80ca44a2-9bfc-448a-9b43-ca3d741fa868',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            409 =>
            array(
                'id' => '99db519b-907a-4674-966a-cfa8ca7349d7',
                'name' => 'Thị xã Ninh Hòa',

                'city_id' => '67c9c91d-e4d5-4541-babb-2a5232c6ff7d',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            410 =>
            array(
                'id' => '99f14234-765f-4ba8-9f3e-54729e1e7aff',
                'name' => 'Chợ Đồn',

                'city_id' => 'c03bc001-7700-4187-b7d2-1b14ca5b73ef',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            411 =>
            array(
                'id' => '99f26cfa-2636-4bdb-956e-5cd55e851140',
                'name' => 'Ia H\' Drai',

                'city_id' => '4e01437c-3ac0-4958-a3a9-125f9c375c49',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            412 =>
            array(
                'id' => '9b101873-8b3f-4924-85cf-15755cbbc6c8',
                'name' => 'Cái Bè',

                'city_id' => '80180775-e6f5-4b0d-b606-ac976283638c',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            413 =>
            array(
                'id' => '9b1c2a32-3cc5-4ee5-b8d7-95a5ec323d0c',
                'name' => 'Bàu Bàng',

                'city_id' => 'cfe34498-401b-4f19-8565-486da5945f30',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            414 =>
            array(
                'id' => '9b1ef740-72a8-4e8c-afa5-8add76d01fec',
                'name' => 'Đông Giang',

                'city_id' => 'e51deafd-86b7-493d-a035-b369ed6e5b5f',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            415 =>
            array(
                'id' => '9b387f0e-6fb6-42ea-a18e-df3aa3070735',
                'name' => 'Kiên Lương',

                'city_id' => '9104b60d-125b-45de-8f0c-e14893ef5ee3',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            416 =>
            array(
                'id' => '9b55b655-5d28-41ef-8947-1777a66bbd22',
                'name' => 'Thị xã Phước Long',

                'city_id' => 'f1282eac-a136-42f4-a1ad-76096405ba95',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            417 =>
            array(
                'id' => '9b576cfe-09b4-4b62-a988-e80d3f3754ea',
                'name' => 'Vị Xuyên',

                'city_id' => 'd1d97f9b-ca69-415f-afcd-a3e4decd023e',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            418 =>
            array(
                'id' => '9b7dcaa6-0069-4723-97dc-7233ec8d1c02',
                'name' => 'Ninh Phước',

                'city_id' => '0a602243-f105-4c21-9a39-a9317d4c8aae',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            419 =>
            array(
                'id' => '9b8118c1-fa62-413c-b3c9-f25f62f193b4',
                'name' => 'Thị xã Đức Phổ',

                'city_id' => 'bc4e7995-4afa-4f16-aa08-3a5c690d79b6',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            420 =>
            array(
                'id' => '9b91e4f1-e943-430e-b61e-44fecd6eabfb',
                'name' => 'Tam Bình',

                'city_id' => '9d68ecc4-0cce-419e-baa8-9f4b320fc3da',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            421 =>
            array(
                'id' => '9c154519-74b3-447c-9aef-0dcb36a34ff9',
                'name' => 'Nậm Pồ',

                'city_id' => '0acc5189-a3aa-47cb-b9ae-d2cdbd750b54',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            422 =>
            array(
                'id' => '9c27658c-ccc2-4cc3-b493-00d550312011',
                'name' => 'Đăk Pơ',

                'city_id' => '64b7dd07-06f2-4ebb-9060-5b43862c9492',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            423 =>
            array(
                'id' => '9c4a6f2b-b28c-4344-85d5-ed59c8c55bec',
                'name' => 'Bắc Kạn',

                'city_id' => 'c03bc001-7700-4187-b7d2-1b14ca5b73ef',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            424 =>
            array(
                'id' => '9ccaa9ef-7704-4b60-a577-f37cf442af48',
                'name' => 'Ninh Bình',

                'city_id' => 'eb0bef04-0188-44f2-8f7b-60152624e033',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            425 =>
            array(
                'id' => '9ceb45d9-5f7c-440f-8f55-1a77bfc4e46d',
                'name' => 'Mang Yang',

                'city_id' => '64b7dd07-06f2-4ebb-9060-5b43862c9492',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            426 =>
            array(
                'id' => '9d078012-70cc-4b0d-ad89-f3d8448e6f5d',
                'name' => 'Như Thanh',

                'city_id' => 'b577fbe5-2420-4ac7-9298-8a8bd04bc217',
                'created_at' => '2021-09-23 16:17:54',
                'updated_at' => '2021-09-23 16:17:54',
            ),
            427 =>
            array(
                'id' => '9d21a3d9-530f-438e-8622-5896eb7ded16',
                'name' => 'Tháp Mười',

                'city_id' => 'fef45e17-2058-4cb8-ac6d-51f4d082b088',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            428 =>
            array(
                'id' => '9d2aa0dc-6125-47d0-a989-57125e491ec0',
                'name' => 'Hải Dương',

                'city_id' => '45b755a9-2397-42da-b45e-2dc8e23e0f4f',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            429 =>
            array(
                'id' => '9d3b492c-4490-41fc-8a5e-21fac79ba302',
                'name' => 'Hóc Môn',

                'city_id' => 'e30bfd9c-0668-4860-b065-455cae47d328',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            430 =>
            array(
                'id' => '9d429477-47a6-4938-af3e-625c2b8b9eb0',
                'name' => 'Đồng Hỷ',

                'city_id' => '1a07bb93-f1d7-4c58-9578-036b0d20741b',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            431 =>
            array(
                'id' => '9d4cf8db-9c7e-4254-8ab5-f01d37870055',
                'name' => 'Đà Lạt',

                'city_id' => 'b01fa938-cffc-49b1-9e83-a337422f132e',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            432 =>
            array(
                'id' => '9d9af1ef-e2ca-45ef-b3db-544cf6365ca1',
                'name' => 'Thuận An',

                'city_id' => 'cfe34498-401b-4f19-8565-486da5945f30',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            433 =>
            array(
                'id' => '9e021371-0f82-4b45-b3f8-f689820fb71b',
                'name' => 'Tu Mơ Rông',

                'city_id' => '4e01437c-3ac0-4958-a3a9-125f9c375c49',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            434 =>
            array(
                'id' => '9e84d0bf-0ae6-49b9-b2eb-3d9414708e87',
                'name' => 'Yên Phong',

                'city_id' => '2ca3f74e-6ded-4339-8b12-c26e4b6d1a52',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            435 =>
            array(
                'id' => '9f6ce528-f54d-43cd-be3a-8e311234c747',
                'name' => 'Trùng Khánh',

                'city_id' => 'da297b82-b4de-4c8d-a252-b2df97fa8be7',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            436 =>
            array(
                'id' => '9f960460-0283-4224-9d5d-fe16127b0698',
                'name' => 'Văn Lâm',

                'city_id' => '312016bb-b80f-4456-aad2-9e69a0ea2f5f',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            437 =>
            array(
                'id' => 'a059ec71-221d-49f9-9429-3c90b37f426a',
                'name' => 'Thanh Chương',

                'city_id' => '80ca44a2-9bfc-448a-9b43-ca3d741fa868',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            438 =>
            array(
                'id' => 'a09d2ebe-c49a-4344-93dd-2a65f1a2c75e',
                'name' => 'Điện Biên Đông',

                'city_id' => '0acc5189-a3aa-47cb-b9ae-d2cdbd750b54',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            439 =>
            array(
                'id' => 'a13dd024-c236-49a8-8ec0-3676bbdb3d4d',
                'name' => 'Đông Hà',

                'city_id' => '6b1145ac-a1dd-42e8-9b9f-5d2cceb14253',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            440 =>
            array(
                'id' => 'a1691eec-e0df-4fb5-93b8-1f54b2f37bae',
                'name' => 'Tiên Lữ',

                'city_id' => '312016bb-b80f-4456-aad2-9e69a0ea2f5f',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            441 =>
            array(
                'id' => 'a23cd64a-6211-42e6-b600-da88da6d62d8',
                'name' => 'Tân Phú',

                'city_id' => 'e30bfd9c-0668-4860-b065-455cae47d328',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            442 =>
            array(
                'id' => 'a268fa3f-0ebd-4adf-9c71-6ba49310cdd6',
                'name' => 'Thanh Sơn',

                'city_id' => '7beeed0d-f6f7-49a3-87ff-4e363a27108a',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            443 =>
            array(
                'id' => 'a32e9086-bfc7-48b6-98ac-e43933be306a',
                'name' => 'Gò Vấp',

                'city_id' => 'e30bfd9c-0668-4860-b065-455cae47d328',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            444 =>
            array(
                'id' => 'a38093e6-8bdf-4872-aaa2-f12ca806bb32',
                'name' => 'Hàm Yên',

                'city_id' => 'b1ebf48f-56b7-4882-bf16-9271c1b75196',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            445 =>
            array(
                'id' => 'a3a9cbdf-0902-49e2-8551-75e43b930651',
                'name' => 'Nghĩa Hưng',

                'city_id' => '6d698fb4-9a6a-4504-8634-ab32e39c4aa8',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            446 =>
            array(
                'id' => 'a3ddd22a-9c86-4003-b4a6-a1ac1ba55773',
                'name' => 'Sơn La',

                'city_id' => '30e8ea4f-cd4b-4e19-b8ed-9d21e06f531b',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            447 =>
            array(
                'id' => 'a426ecb0-ed01-4b37-a8f6-5186f26c023a',
                'name' => 'M\'Đrắk',

                'city_id' => 'c0e9071f-1445-479a-b658-7d312ed909fd',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            448 =>
            array(
                'id' => 'a53ba2c2-09b0-4f4c-b350-2d1fa28ebe6b',
                'name' => 'Quận 3',

                'city_id' => 'e30bfd9c-0668-4860-b065-455cae47d328',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            449 =>
            array(
                'id' => 'a5674e80-d413-47a8-b19b-ba4728c98283',
                'name' => 'Hai Bà Trưng',

                'city_id' => '7ffe542b-8ae7-415e-b1de-6564e3f3d4ef',
                'created_at' => '2021-09-23 16:17:48',
                'updated_at' => '2021-09-23 16:17:48',
            ),
            450 =>
            array(
                'id' => 'a5d00404-0f49-4bd2-9e6b-afcc755acf39',
                'name' => 'Điện Biên',

                'city_id' => '0acc5189-a3aa-47cb-b9ae-d2cdbd750b54',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            451 =>
            array(
                'id' => 'a5e45536-8f94-489c-9818-573198247bbd',
                'name' => 'Văn Yên',

                'city_id' => 'efc143a2-35ac-4f33-9934-5d9177bcb7e1',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            452 =>
            array(
                'id' => 'a76f8f52-9670-421a-bf31-6ac58ced1d1e',
                'name' => 'Lộc Hà',

                'city_id' => '250bf51a-3b01-4246-ab2b-7583bdaf89e1',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            453 =>
            array(
                'id' => 'a86625fe-66e3-4fcd-a0d5-d84c9fd527f9',
                'name' => 'Can Lộc',

                'city_id' => '250bf51a-3b01-4246-ab2b-7583bdaf89e1',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            454 =>
            array(
                'id' => 'a87ffb11-1498-4a7f-ba18-50e463b821af',
                'name' => 'Tủa Chùa',

                'city_id' => '0acc5189-a3aa-47cb-b9ae-d2cdbd750b54',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            455 =>
            array(
                'id' => 'a8c6151e-5f21-4f9d-999b-bb7b3fc6137c',
                'name' => 'Thanh Khê',

                'city_id' => '1de081d3-e6f4-4bab-a727-bab36f976dc9',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            456 =>
            array(
                'id' => 'a9300136-1a6d-439d-b29e-ae8118432bc7',
                'name' => 'Thái Nguyên',

                'city_id' => '1a07bb93-f1d7-4c58-9578-036b0d20741b',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            457 =>
            array(
                'id' => 'a9505f88-6f10-4717-bb0f-25a866075460',
                'name' => 'Nam Sách',

                'city_id' => '45b755a9-2397-42da-b45e-2dc8e23e0f4f',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            458 =>
            array(
                'id' => 'aa7ce3a3-51df-456e-8560-c8ff501b99a8',
                'name' => 'Tân Yên',

                'city_id' => '5e97693a-356d-4886-8ed2-b78c42f56115',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            459 =>
            array(
                'id' => 'aae7cb59-7439-47b9-befe-8980b4fda327',
                'name' => 'Tân Biên',

                'city_id' => '8c1436f7-2d32-4784-afd8-70d331936e5a',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            460 =>
            array(
                'id' => 'ab40552f-4d71-407f-b57a-be2cb6a9f419',
                'name' => 'Quận 10',

                'city_id' => 'e30bfd9c-0668-4860-b065-455cae47d328',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            461 =>
            array(
                'id' => 'ac3630dc-71b6-411e-90f3-c769633c5ff4',
                'name' => 'Mỏ Cày Nam',

                'city_id' => '7e28b375-6c0b-4c30-bbb9-2fd254cf75da',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            462 =>
            array(
                'id' => 'ac51541a-92a9-4826-86bc-a20a643a956c',
                'name' => 'Bắc Yên',

                'city_id' => '30e8ea4f-cd4b-4e19-b8ed-9d21e06f531b',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            463 =>
            array(
                'id' => 'acf08408-47f7-41d3-962e-2142fa63c0a8',
                'name' => 'Tân Phú',

                'city_id' => 'a4d945b8-b02d-41c1-880e-71ceb3168a9d',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            464 =>
            array(
                'id' => 'ad1e041e-4ae3-449b-bea4-6bb24ff91945',
                'name' => 'Thanh Oai',

                'city_id' => '7ffe542b-8ae7-415e-b1de-6564e3f3d4ef',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            465 =>
            array(
                'id' => 'ad613bfb-2c86-435b-8404-587a754924ed',
                'name' => 'Thị xã Kỳ Anh',

                'city_id' => '250bf51a-3b01-4246-ab2b-7583bdaf89e1',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            466 =>
            array(
                'id' => 'add37e05-a887-48db-a5e2-e185eee853de',
                'name' => 'Lâm Thao',

                'city_id' => '7beeed0d-f6f7-49a3-87ff-4e363a27108a',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            467 =>
            array(
                'id' => 'ade63a16-9ae3-46c0-95aa-ed8266ce4b41',
                'name' => 'Quang Bình',

                'city_id' => 'd1d97f9b-ca69-415f-afcd-a3e4decd023e',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            468 =>
            array(
                'id' => 'ae0ed270-a19f-466f-9b98-66aa0d5fb461',
                'name' => 'Phú Quý',

                'city_id' => '454a9560-7637-4d5a-9792-a7a63cce6bc3',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            469 =>
            array(
                'id' => 'ae746a10-0cbd-49a7-86eb-2d5a221074f5',
                'name' => 'Tây Hồ',

                'city_id' => '7ffe542b-8ae7-415e-b1de-6564e3f3d4ef',
                'created_at' => '2021-09-23 16:17:48',
                'updated_at' => '2021-09-23 16:17:48',
            ),
            470 =>
            array(
                'id' => 'aee5240f-205e-4df3-8489-fdc8be50bb30',
                'name' => 'Phù Ninh',

                'city_id' => '7beeed0d-f6f7-49a3-87ff-4e363a27108a',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            471 =>
            array(
                'id' => 'af24d2b1-b3dc-4657-b762-06d408a42660',
                'name' => 'Định Hóa',

                'city_id' => '1a07bb93-f1d7-4c58-9578-036b0d20741b',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            472 =>
            array(
                'id' => 'af3f0f0e-b1f2-4a44-846f-16f9093587ad',
                'name' => 'Vân Hồ',

                'city_id' => '30e8ea4f-cd4b-4e19-b8ed-9d21e06f531b',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            473 =>
            array(
                'id' => 'af48fadc-5e47-451b-b28d-ce2a74c1c30e',
                'name' => 'Quận 6',

                'city_id' => 'e30bfd9c-0668-4860-b065-455cae47d328',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            474 =>
            array(
                'id' => 'b04d04f4-be8e-4e6c-bd34-bd46b678a2fc',
                'name' => 'Cà Mau',

                'city_id' => 'd37a60f8-a1b0-4152-8778-395791e523f6',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            475 =>
            array(
                'id' => 'b04f47ee-403f-42d9-b1f0-eb8d84be72cd',
                'name' => 'Ngô Quyền',

                'city_id' => '37bf04e5-d907-443f-b7b3-b45c028a3db7',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            476 =>
            array(
                'id' => 'b11d1394-d76e-4459-a432-66ce73d1cb86',
                'name' => 'Thị xã Bình Minh',

                'city_id' => '9d68ecc4-0cce-419e-baa8-9f4b320fc3da',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            477 =>
            array(
                'id' => 'b12ea620-991f-437d-b1ad-23dd29e46878',
                'name' => 'Long Hồ',

                'city_id' => '9d68ecc4-0cce-419e-baa8-9f4b320fc3da',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            478 =>
            array(
                'id' => 'b137c2dd-c804-478f-9d41-e8cdfffbf441',
                'name' => 'Phong Điền',

                'city_id' => '313269fe-b585-4e5f-9f4d-b94113fc2ae7',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            479 =>
            array(
                'id' => 'b149e781-e180-4f68-88aa-42db3eaaeb72',
                'name' => 'Mường Lát',

                'city_id' => 'b577fbe5-2420-4ac7-9298-8a8bd04bc217',
                'created_at' => '2021-09-23 16:17:54',
                'updated_at' => '2021-09-23 16:17:54',
            ),
            480 =>
            array(
                'id' => 'b16b34c3-5926-4bfd-becf-8e86e541e602',
                'name' => 'Duyên Hải',

                'city_id' => 'f6275b3f-09de-44b3-87a2-b9cec4ae89c8',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            481 =>
            array(
                'id' => 'b17c71d9-d3ba-4fe2-acb7-a7760236fb81',
                'name' => 'Lương Tài',

                'city_id' => '2ca3f74e-6ded-4339-8b12-c26e4b6d1a52',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            482 =>
            array(
                'id' => 'b19f5e22-ca0b-436d-a718-4206a636ce58',
                'name' => 'Krông Nô',

                'city_id' => '5563c615-1302-4c13-994c-4ed3f3695f76',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            483 =>
            array(
                'id' => 'b1abd79b-fa81-400a-ba45-9c04e0d6a53e',
                'name' => 'Tây Sơn',

                'city_id' => '10878756-f388-482c-bdf2-c9a0b5f4ef7c',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            484 =>
            array(
                'id' => 'b21648fb-11bd-4e1c-91b8-d9563ef67b16',
                'name' => 'Bắc Quang',

                'city_id' => 'd1d97f9b-ca69-415f-afcd-a3e4decd023e',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            485 =>
            array(
                'id' => 'b225f32c-e575-4b26-b8ee-3d58ad081b43',
                'name' => 'Nha Trang',

                'city_id' => '67c9c91d-e4d5-4541-babb-2a5232c6ff7d',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            486 =>
            array(
                'id' => 'b3960f2c-d0c8-4139-a626-6800b83b44c5',
                'name' => 'Nho Quan',

                'city_id' => 'eb0bef04-0188-44f2-8f7b-60152624e033',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            487 =>
            array(
                'id' => 'b3d3392f-1f2f-433f-b5b7-59d7bd44546c',
                'name' => 'Mường Chà',

                'city_id' => '0acc5189-a3aa-47cb-b9ae-d2cdbd750b54',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            488 =>
            array(
                'id' => 'b48b769b-f232-4bdc-93b3-af981c6780d6',
                'name' => 'Tam Nông',

                'city_id' => 'fef45e17-2058-4cb8-ac6d-51f4d082b088',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            489 =>
            array(
                'id' => 'b549f1fb-2298-42c0-906e-4845c8afb849',
                'name' => 'Quảng Trạch',

                'city_id' => '1182ce56-8620-4d32-a32c-9561dcb52983',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            490 =>
            array(
                'id' => 'b5541c06-7a6f-430f-8e74-86c7dd77ecec',
                'name' => 'Côn Đảo',

                'city_id' => 'b720536f-26aa-41c5-b29c-e0dc9fad61ad',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            491 =>
            array(
                'id' => 'b575bca1-7b0a-4381-88a2-b10768dd9432',
                'name' => 'Mộ Đức',

                'city_id' => 'bc4e7995-4afa-4f16-aa08-3a5c690d79b6',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            492 =>
            array(
                'id' => 'b5b7a738-5798-40ff-8c7b-48cdf4cedcf3',
                'name' => 'Nam Đông',

                'city_id' => '313269fe-b585-4e5f-9f4d-b94113fc2ae7',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            493 =>
            array(
                'id' => 'b5bf1785-45e0-4018-b7ac-e0fedfb50039',
                'name' => 'Lạc Sơn',

                'city_id' => 'f05ae9d8-a765-482b-90cf-2ba6434ee185',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            494 =>
            array(
                'id' => 'b642ed02-23a7-451a-8814-7c24655afc72',
                'name' => 'Kỳ Sơn',

                'city_id' => '80ca44a2-9bfc-448a-9b43-ca3d741fa868',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            495 =>
            array(
                'id' => 'b65c2b93-e5ce-4fe7-8ddc-b826180140ef',
                'name' => 'Nhà Bè',

                'city_id' => 'e30bfd9c-0668-4860-b065-455cae47d328',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            496 =>
            array(
                'id' => 'b6c93aee-b22b-4dd2-8118-43a1479712c2',
                'name' => 'Lục Nam',

                'city_id' => '5e97693a-356d-4886-8ed2-b78c42f56115',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            497 =>
            array(
                'id' => 'b6ecefc1-f90f-416f-b8b5-dafa73fd72b9',
                'name' => 'Tràng Định',

                'city_id' => '01822d18-7a7e-4b64-970c-c00bde7cae5e',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            498 =>
            array(
                'id' => 'b6f1a72d-9073-4bf9-9578-73ad16f1f5db',
                'name' => 'Kiến Xương',

                'city_id' => '0dcb18c9-edea-4255-81ea-34ab31c60c28',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            499 =>
            array(
                'id' => 'b727e6ad-977e-4dd4-ad36-fba6f25285c3',
                'name' => 'Phú Lộc',

                'city_id' => '313269fe-b585-4e5f-9f4d-b94113fc2ae7',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
        ));
        \DB::table('districts')->insert(array(
            0 =>
            array(
                'id' => 'b756ff56-1205-4a13-a4bb-0538b8c002ff',
                'name' => 'An Dương',

                'city_id' => '37bf04e5-d907-443f-b7b3-b45c028a3db7',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            1 =>
            array(
                'id' => 'b794d4d7-5b8d-46d7-bd63-403ec1c3bd36',
                'name' => 'Đồng Văn',

                'city_id' => 'd1d97f9b-ca69-415f-afcd-a3e4decd023e',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            2 =>
            array(
                'id' => 'b7cd95e5-39f0-4ba2-8952-1c6286662c42',
                'name' => 'Bình Sơn',

                'city_id' => 'bc4e7995-4afa-4f16-aa08-3a5c690d79b6',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            3 =>
            array(
                'id' => 'b827b878-c418-49d8-999c-2d47222efc0c',
                'name' => 'Thuận Thành',

                'city_id' => '2ca3f74e-6ded-4339-8b12-c26e4b6d1a52',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            4 =>
            array(
                'id' => 'b9e9fd34-ac2b-4a07-88f6-95b64f28413d',
                'name' => 'Thị xã Cửa Lò',

                'city_id' => '80ca44a2-9bfc-448a-9b43-ca3d741fa868',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            5 =>
            array(
                'id' => 'ba13625d-814c-4f7e-af4a-fca7dffe495f',
                'name' => 'Thuận Nam',

                'city_id' => '0a602243-f105-4c21-9a39-a9317d4c8aae',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            6 =>
            array(
                'id' => 'ba27018a-a340-43f3-a8ba-954accfc2f24',
                'name' => 'Gia Lâm',

                'city_id' => '7ffe542b-8ae7-415e-b1de-6564e3f3d4ef',
                'created_at' => '2021-09-23 16:17:48',
                'updated_at' => '2021-09-23 16:17:48',
            ),
            7 =>
            array(
                'id' => 'ba5667e6-c578-4c04-bb3c-e95a21f7713c',
                'name' => 'Bình Đại',

                'city_id' => '7e28b375-6c0b-4c30-bbb9-2fd254cf75da',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            8 =>
            array(
                'id' => 'ba9ea679-1617-4614-97d4-1c556f0be99c',
                'name' => 'Thị xã Quảng Yên',

                'city_id' => 'd4dcf702-42a9-4068-8d9e-176d22279e32',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            9 =>
            array(
                'id' => 'bb12545e-8bc0-41d7-9e9b-5c4181665a59',
                'name' => 'Định Quán',

                'city_id' => 'a4d945b8-b02d-41c1-880e-71ceb3168a9d',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            10 =>
            array(
                'id' => 'bb6f3ab9-dc94-41ec-ad04-88692bc3b0b1',
                'name' => 'Bình Thạnh',

                'city_id' => 'e30bfd9c-0668-4860-b065-455cae47d328',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            11 =>
            array(
                'id' => 'bb72b8b9-db64-4cf9-b186-2ce1de0499cb',
                'name' => 'Gò Công Tây',

                'city_id' => '80180775-e6f5-4b0d-b606-ac976283638c',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            12 =>
            array(
                'id' => 'bb7ddb71-f2f7-49d8-ade2-4bcd46e08d48',
                'name' => 'Gò Công Đông',

                'city_id' => '80180775-e6f5-4b0d-b606-ac976283638c',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            13 =>
            array(
                'id' => 'bbefa52a-9758-4fd7-9152-ec5525787595',
                'name' => 'Nguyên Bình',

                'city_id' => 'da297b82-b4de-4c8d-a252-b2df97fa8be7',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            14 =>
            array(
                'id' => 'bc094f2b-277a-489f-b87c-428c8c88df2a',
                'name' => 'Phúc Yên',

                'city_id' => '90bbe443-069a-4354-8e96-8fcb1c2870bf',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            15 =>
            array(
                'id' => 'bc4172d4-36de-4a24-90bf-816cbd123d7b',
                'name' => 'Vũng Tàu',

                'city_id' => 'b720536f-26aa-41c5-b29c-e0dc9fad61ad',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            16 =>
            array(
                'id' => 'bd2429b5-2d20-44b9-a368-eb40e659cb39',
                'name' => 'Tam Đảo',

                'city_id' => '90bbe443-069a-4354-8e96-8fcb1c2870bf',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            17 =>
            array(
                'id' => 'bd7f241f-967a-4bab-8fe2-d5ccdfc8fdfe',
                'name' => 'Trà Cú',

                'city_id' => 'f6275b3f-09de-44b3-87a2-b9cec4ae89c8',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            18 =>
            array(
                'id' => 'bdaac641-407c-459f-98df-c8be179c35bc',
                'name' => 'Sơn Tây',

                'city_id' => 'bc4e7995-4afa-4f16-aa08-3a5c690d79b6',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            19 =>
            array(
                'id' => 'be1cce7c-d61f-45b2-9076-631fad5a968e',
                'name' => 'Tuần Giáo',

                'city_id' => '0acc5189-a3aa-47cb-b9ae-d2cdbd750b54',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            20 =>
            array(
                'id' => 'bec6f38f-a69f-4672-a74d-b59e53c707c6',
                'name' => 'Krông Pắc',

                'city_id' => 'c0e9071f-1445-479a-b658-7d312ed909fd',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            21 =>
            array(
                'id' => 'bf65cb50-f2cd-4668-b5fb-fa1021b97cca',
                'name' => 'Tư Nghĩa',

                'city_id' => 'bc4e7995-4afa-4f16-aa08-3a5c690d79b6',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            22 =>
            array(
                'id' => 'bf7998bc-45c2-4882-9238-1dd1e03f15e6',
                'name' => 'Cẩm Thủy',

                'city_id' => 'b577fbe5-2420-4ac7-9298-8a8bd04bc217',
                'created_at' => '2021-09-23 16:17:54',
                'updated_at' => '2021-09-23 16:17:54',
            ),
            23 =>
            array(
                'id' => 'bf806f22-079c-47dc-8389-eae8e0064bd8',
                'name' => 'Krông Búk',

                'city_id' => 'c0e9071f-1445-479a-b658-7d312ed909fd',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            24 =>
            array(
                'id' => 'c0303434-0a1c-432d-9d25-7e833cd90d99',
                'name' => 'Châu Thành',

                'city_id' => 'fb0e6f30-8a60-44f2-85b9-4c3c13c14220',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            25 =>
            array(
                'id' => 'c0feca56-2c3f-4c8f-8c9e-8262fc80f85b',
                'name' => 'Đăk Đoa',

                'city_id' => '64b7dd07-06f2-4ebb-9060-5b43862c9492',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            26 =>
            array(
                'id' => 'c126e890-aa20-4db0-a0f6-d8fa75b44a4c',
                'name' => 'Phú Nhuận',

                'city_id' => 'e30bfd9c-0668-4860-b065-455cae47d328',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            27 =>
            array(
                'id' => 'c14b81ae-fc28-49c4-8552-ca30033fcd94',
                'name' => 'Phú Lương',

                'city_id' => '1a07bb93-f1d7-4c58-9578-036b0d20741b',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            28 =>
            array(
                'id' => 'c1d64e1f-e5f6-42cd-a4f8-74947f433cbb',
                'name' => 'Củ Chi',

                'city_id' => 'e30bfd9c-0668-4860-b065-455cae47d328',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            29 =>
            array(
                'id' => 'c32f8b26-de66-4ce1-b041-252a55e93736',
                'name' => 'Vĩnh Thuận',

                'city_id' => '9104b60d-125b-45de-8f0c-e14893ef5ee3',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            30 =>
            array(
                'id' => 'c36525ff-e177-4951-ad81-8928b13ce42f',
                'name' => 'Yên Sơn',

                'city_id' => 'b1ebf48f-56b7-4882-bf16-9271c1b75196',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            31 =>
            array(
                'id' => 'c3ac081d-45dd-4acf-b67a-0baa6fffb953',
                'name' => 'Hoàng Su Phì',

                'city_id' => 'd1d97f9b-ca69-415f-afcd-a3e4decd023e',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            32 =>
            array(
                'id' => 'c3d4de12-99a2-4f6a-b4a0-fd626c12eb4c',
                'name' => 'Quế Sơn',

                'city_id' => 'e51deafd-86b7-493d-a035-b369ed6e5b5f',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            33 =>
            array(
                'id' => 'c3ff7412-5a9f-4a03-a487-fe6a81a77a01',
                'name' => 'Ninh Kiều',

                'city_id' => '78810fa4-611c-4088-aa1b-777926ec9b13',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            34 =>
            array(
                'id' => 'c433bc70-b036-4a99-bef3-897352c54d18',
                'name' => 'Vĩnh Thạnh',

                'city_id' => '78810fa4-611c-4088-aa1b-777926ec9b13',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            35 =>
            array(
                'id' => 'c43c033e-eb16-4b2e-bd73-a505f7cff73b',
                'name' => 'Phú Hoà',

                'city_id' => '0920c620-d074-492e-8c99-3fb5aab15d3c',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            36 =>
            array(
                'id' => 'c460f834-f68a-4d5d-9a93-c01c5986211e',
                'name' => 'Kim Bôi',

                'city_id' => 'f05ae9d8-a765-482b-90cf-2ba6434ee185',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            37 =>
            array(
                'id' => 'c4f0df3a-e7b0-4b59-a772-e4fa1a885fa2',
                'name' => 'Bảo Thắng',

                'city_id' => '637ad6dd-e601-46db-9f06-a36937ff1b0a',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            38 =>
            array(
                'id' => 'c58f8a43-860a-4158-b961-8d9fdf4d903e',
                'name' => 'Thị xã Long Mỹ',

                'city_id' => '63cea115-2d29-4893-ba22-518aa3451f35',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            39 =>
            array(
                'id' => 'c5e198e7-9c04-4c67-955d-dd8f17d4a044',
                'name' => 'Tiên Yên',

                'city_id' => 'd4dcf702-42a9-4068-8d9e-176d22279e32',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            40 =>
            array(
                'id' => 'c5f05720-90b7-4b6f-a40c-b31c0e895ce9',
                'name' => 'Quảng Ninh',

                'city_id' => '1182ce56-8620-4d32-a32c-9561dcb52983',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            41 =>
            array(
                'id' => 'c649d0f1-0f24-41e9-bef7-386180d4431b',
                'name' => 'Mèo Vạc',

                'city_id' => 'd1d97f9b-ca69-415f-afcd-a3e4decd023e',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            42 =>
            array(
                'id' => 'c672c8de-5192-442e-b505-95f4af6df4b2',
                'name' => 'Sông Hinh',

                'city_id' => '0920c620-d074-492e-8c99-3fb5aab15d3c',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            43 =>
            array(
                'id' => 'c71f2087-3ddb-4ba4-9974-91b1defd799e',
                'name' => 'Hàm Tân',

                'city_id' => '454a9560-7637-4d5a-9792-a7a63cce6bc3',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            44 =>
            array(
                'id' => 'c8ec7dd2-59f6-4bcb-b109-eecf18b5a1af',
                'name' => 'Cư M\'Gar',

                'city_id' => 'c0e9071f-1445-479a-b658-7d312ed909fd',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            45 =>
            array(
                'id' => 'c8f576f3-04e9-471b-bbd6-dcff46dfcde8',
                'name' => 'Thạch Thành',

                'city_id' => 'b577fbe5-2420-4ac7-9298-8a8bd04bc217',
                'created_at' => '2021-09-23 16:17:54',
                'updated_at' => '2021-09-23 16:17:54',
            ),
            46 =>
            array(
                'id' => 'c8fadad0-ab39-41e2-b6c1-00c0f0efb1cb',
                'name' => 'Ia Grai',

                'city_id' => '64b7dd07-06f2-4ebb-9060-5b43862c9492',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            47 =>
            array(
                'id' => 'c938bf28-762a-4ec8-b929-60eaefeb62e0',
                'name' => 'Ô Môn',

                'city_id' => '78810fa4-611c-4088-aa1b-777926ec9b13',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            48 =>
            array(
                'id' => 'ca26bff6-1e09-4b40-b200-623c25228d31',
                'name' => 'Giồng Riềng',

                'city_id' => '9104b60d-125b-45de-8f0c-e14893ef5ee3',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            49 =>
            array(
                'id' => 'ca665392-3263-4e89-bfb7-003f6c182f7f',
                'name' => 'Yên Khánh',

                'city_id' => 'eb0bef04-0188-44f2-8f7b-60152624e033',
                'created_at' => '2021-09-23 16:17:54',
                'updated_at' => '2021-09-23 16:17:54',
            ),
            50 =>
            array(
                'id' => 'ca704088-7b69-48a6-82ff-2fa0b8c3f8e1',
                'name' => 'Lương Sơn',

                'city_id' => 'f05ae9d8-a765-482b-90cf-2ba6434ee185',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            51 =>
            array(
                'id' => 'ca8542f6-9d20-48dc-b92b-b2f2c505a69d',
                'name' => 'Lý Nhân',

                'city_id' => '485eb0a2-0f49-4690-a615-e2e8ed951656',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            52 =>
            array(
                'id' => 'cb231a52-c218-45a3-a7fd-805e83b2cdea',
                'name' => 'Thị xã Hương Trà',

                'city_id' => '313269fe-b585-4e5f-9f4d-b94113fc2ae7',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            53 =>
            array(
                'id' => 'cbbfa014-777d-47de-bc25-1b7b3c952df8',
                'name' => 'Thanh Thủy',

                'city_id' => '7beeed0d-f6f7-49a3-87ff-4e363a27108a',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            54 =>
            array(
                'id' => 'cc001dd5-6ae5-4299-a530-7139f2771241',
                'name' => 'Cẩm Xuyên',

                'city_id' => '250bf51a-3b01-4246-ab2b-7583bdaf89e1',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            55 =>
            array(
                'id' => 'cc163319-8680-47bb-b9c7-e7612b0da781',
                'name' => 'Pleiku',

                'city_id' => '64b7dd07-06f2-4ebb-9060-5b43862c9492',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            56 =>
            array(
                'id' => 'cc83d25f-8573-43ff-b80d-9e17db514184',
                'name' => 'Bến Tre',

                'city_id' => '7e28b375-6c0b-4c30-bbb9-2fd254cf75da',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            57 =>
            array(
                'id' => 'cc87e0ac-a141-47f3-8636-ea986ab81c54',
                'name' => 'Tây Hoà',

                'city_id' => '0920c620-d074-492e-8c99-3fb5aab15d3c',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            58 =>
            array(
                'id' => 'ccbad638-d43e-4024-bd29-948173074f78',
                'name' => 'Mường Ảng',

                'city_id' => '0acc5189-a3aa-47cb-b9ae-d2cdbd750b54',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            59 =>
            array(
                'id' => 'cd1635b1-6d4c-4917-8fd9-3a1ade3896ee',
                'name' => 'Lục Ngạn',

                'city_id' => '5e97693a-356d-4886-8ed2-b78c42f56115',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            60 =>
            array(
                'id' => 'cd23bfe4-ca23-42dd-9801-7fd252334952',
                'name' => 'Tam Dương',

                'city_id' => '90bbe443-069a-4354-8e96-8fcb1c2870bf',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            61 =>
            array(
                'id' => 'ce785b62-8067-43e0-9733-3bffee52f21d',
                'name' => 'Thị xã Sơn Tây',

                'city_id' => '7ffe542b-8ae7-415e-b1de-6564e3f3d4ef',
                'created_at' => '2021-09-23 16:17:48',
                'updated_at' => '2021-09-23 16:17:48',
            ),
            62 =>
            array(
                'id' => 'ce932b06-4f9b-4c00-96b8-acfc4d7c5523',
                'name' => 'Cao Bằng',

                'city_id' => 'da297b82-b4de-4c8d-a252-b2df97fa8be7',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            63 =>
            array(
                'id' => 'cea132c5-5fb0-4aa3-aa41-5c58b0544e6e',
                'name' => 'Mỹ Tú',

                'city_id' => '1a71e7ff-a963-4364-bbbd-ecf59ae7f965',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            64 =>
            array(
                'id' => 'cf09ad5a-a1f6-43ba-86d6-b25f9197af78',
                'name' => 'Thới Bình',

                'city_id' => 'd37a60f8-a1b0-4152-8778-395791e523f6',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            65 =>
            array(
                'id' => 'cf51493c-74af-4584-80ff-49ca9861c603',
                'name' => 'Quế Võ',

                'city_id' => '2ca3f74e-6ded-4339-8b12-c26e4b6d1a52',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            66 =>
            array(
                'id' => 'cff3c4e2-5ece-4374-aca9-11b62356b537',
                'name' => 'Mai Sơn',

                'city_id' => '30e8ea4f-cd4b-4e19-b8ed-9d21e06f531b',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            67 =>
            array(
                'id' => 'd0858dd0-7eff-4c02-ac70-d8456d336e94',
                'name' => 'Bắc Ninh',

                'city_id' => '2ca3f74e-6ded-4339-8b12-c26e4b6d1a52',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            68 =>
            array(
                'id' => 'd0c6e26d-49f7-48b1-ac53-2af7aff0db81',
                'name' => 'Giang Thành',

                'city_id' => '9104b60d-125b-45de-8f0c-e14893ef5ee3',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            69 =>
            array(
                'id' => 'd0ffc366-2d9a-4497-a637-0ed7eef5fb1f',
                'name' => 'Đại Lộc',

                'city_id' => 'e51deafd-86b7-493d-a035-b369ed6e5b5f',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            70 =>
            array(
                'id' => 'd1844222-7a51-44ee-8f9b-f3d49c4f4d52',
                'name' => 'Minh Hóa',

                'city_id' => '1182ce56-8620-4d32-a32c-9561dcb52983',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            71 =>
            array(
                'id' => 'd28c0f60-7344-4339-857a-8bc1c0c0108b',
                'name' => 'Hải Châu',

                'city_id' => '1de081d3-e6f4-4bab-a727-bab36f976dc9',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            72 =>
            array(
                'id' => 'd3797347-3ff0-4d88-a55d-c911b74768e4',
                'name' => 'Long Biên',

                'city_id' => '7ffe542b-8ae7-415e-b1de-6564e3f3d4ef',
                'created_at' => '2021-09-23 16:17:48',
                'updated_at' => '2021-09-23 16:17:48',
            ),
            73 =>
            array(
                'id' => 'd3e18fae-e0a5-4974-8b5b-0100a4f3f0d6',
                'name' => 'Thị xã Phú Thọ',

                'city_id' => '7beeed0d-f6f7-49a3-87ff-4e363a27108a',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            74 =>
            array(
                'id' => 'd407d833-d67e-4f53-bc74-3627fb6b9e64',
                'name' => 'Thị xã Duyên Hải',

                'city_id' => 'f6275b3f-09de-44b3-87a2-b9cec4ae89c8',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            75 =>
            array(
                'id' => 'd4a05e1e-f903-4769-8beb-ccaa9db05b3b',
                'name' => 'Thanh Xuân',

                'city_id' => '7ffe542b-8ae7-415e-b1de-6564e3f3d4ef',
                'created_at' => '2021-09-23 16:17:48',
                'updated_at' => '2021-09-23 16:17:48',
            ),
            76 =>
            array(
                'id' => 'd4c0832b-1f61-4a8f-b145-1f91c2766e92',
                'name' => 'Mường La',

                'city_id' => '30e8ea4f-cd4b-4e19-b8ed-9d21e06f531b',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            77 =>
            array(
                'id' => 'd4d48c0d-5130-402d-a73f-ec5e15630a97',
                'name' => 'Thuận Bắc',

                'city_id' => '0a602243-f105-4c21-9a39-a9317d4c8aae',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            78 =>
            array(
                'id' => 'd4ded0e9-741a-4c64-9e72-2dfad576d785',
                'name' => 'Lào Cai',

                'city_id' => '637ad6dd-e601-46db-9f06-a36937ff1b0a',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            79 =>
            array(
                'id' => 'd53257ac-e1bd-4233-9ced-df7c79eb6e53',
                'name' => 'Mỹ Đức',

                'city_id' => '7ffe542b-8ae7-415e-b1de-6564e3f3d4ef',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            80 =>
            array(
                'id' => 'd57f24b5-8c7e-451a-b2af-301bd12bd006',
                'name' => 'Cái Răng',

                'city_id' => '78810fa4-611c-4088-aa1b-777926ec9b13',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            81 =>
            array(
                'id' => 'd6561e56-c9ea-43ca-b6af-fccbaa3b73e4',
                'name' => 'Đà Bắc',

                'city_id' => 'f05ae9d8-a765-482b-90cf-2ba6434ee185',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            82 =>
            array(
                'id' => 'd748776f-5d7e-41ad-af34-511f73d04d19',
                'name' => 'Hiệp Hòa',

                'city_id' => '5e97693a-356d-4886-8ed2-b78c42f56115',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            83 =>
            array(
                'id' => 'd7662375-3233-4d4c-ae55-9019f1d3dc63',
                'name' => 'Hòn Đất',

                'city_id' => '9104b60d-125b-45de-8f0c-e14893ef5ee3',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            84 =>
            array(
                'id' => 'd776a733-8aff-47b1-b4ad-2638a0037338',
                'name' => 'Cái Nước',

                'city_id' => 'd37a60f8-a1b0-4152-8778-395791e523f6',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            85 =>
            array(
                'id' => 'd7d2af83-ce07-4d1d-8869-94272be91eca',
                'name' => 'Lộc Ninh',

                'city_id' => 'f1282eac-a136-42f4-a1ad-76096405ba95',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            86 =>
            array(
                'id' => 'd7e27b8a-c7f1-4917-bed4-65c9b02e39dc',
                'name' => 'Nga Sơn',

                'city_id' => 'b577fbe5-2420-4ac7-9298-8a8bd04bc217',
                'created_at' => '2021-09-23 16:17:54',
                'updated_at' => '2021-09-23 16:17:54',
            ),
            87 =>
            array(
                'id' => 'd7f5be30-ba85-4d50-b757-5160bb088863',
                'name' => 'Lạc Dương',

                'city_id' => 'b01fa938-cffc-49b1-9e83-a337422f132e',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            88 =>
            array(
                'id' => 'd87bb8af-e28e-4bc9-936f-d85638bbd8d0',
                'name' => 'Thị xã Gò Công',

                'city_id' => '80180775-e6f5-4b0d-b606-ac976283638c',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            89 =>
            array(
                'id' => 'd8ee240e-85ae-4bd3-a0c8-d27d7d979d13',
                'name' => 'Thủ Đức',

                'city_id' => 'e30bfd9c-0668-4860-b065-455cae47d328',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            90 =>
            array(
                'id' => 'd938058c-2255-4ae5-809f-6126d98803a7',
                'name' => 'Mai Châu',

                'city_id' => 'f05ae9d8-a765-482b-90cf-2ba6434ee185',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            91 =>
            array(
                'id' => 'd9578243-8346-4737-b2f1-b0357bb6d959',
                'name' => 'Thốt Nốt',

                'city_id' => '78810fa4-611c-4088-aa1b-777926ec9b13',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            92 =>
            array(
                'id' => 'd9a4b3c2-52f2-4ee1-b330-44ab0a4d4447',
                'name' => 'Hướng Hóa',

                'city_id' => '6b1145ac-a1dd-42e8-9b9f-5d2cceb14253',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            93 =>
            array(
                'id' => 'd9e68c77-059f-4843-b29c-886911a55ba2',
                'name' => 'Lâm Bình',

                'city_id' => 'b1ebf48f-56b7-4882-bf16-9271c1b75196',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            94 =>
            array(
                'id' => 'da447348-615c-483c-acbd-fc092db5cbf4',
                'name' => 'Đức Cơ',

                'city_id' => '64b7dd07-06f2-4ebb-9060-5b43862c9492',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            95 =>
            array(
                'id' => 'da4ed0c4-ea0e-45de-9370-0da9e097a418',
                'name' => 'Đại Từ',

                'city_id' => '1a07bb93-f1d7-4c58-9578-036b0d20741b',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            96 =>
            array(
                'id' => 'da6755d7-99da-47e3-8fc1-a5c5eca14735',
                'name' => 'Nông Sơn',

                'city_id' => 'e51deafd-86b7-493d-a035-b369ed6e5b5f',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            97 =>
            array(
                'id' => 'da9cc05d-d411-4621-8793-d76b20b3e977',
                'name' => 'Phú Ninh',

                'city_id' => 'e51deafd-86b7-493d-a035-b369ed6e5b5f',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            98 =>
            array(
                'id' => 'dad4d62b-aab3-4c2a-8e4d-927a16b8e54e',
                'name' => 'Tân Kỳ',

                'city_id' => '80ca44a2-9bfc-448a-9b43-ca3d741fa868',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            99 =>
            array(
                'id' => 'db2511f9-f417-4707-9dcb-f8277f132ca9',
                'name' => 'Vĩnh Cửu',

                'city_id' => 'a4d945b8-b02d-41c1-880e-71ceb3168a9d',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            100 =>
            array(
                'id' => 'dc3e3950-a96c-4965-adae-63591622a5b1',
                'name' => 'Buôn Đôn',

                'city_id' => 'c0e9071f-1445-479a-b658-7d312ed909fd',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            101 =>
            array(
                'id' => 'dc88eabf-f652-451d-a5a9-9da24609eeeb',
                'name' => 'Cẩm Mỹ',

                'city_id' => 'a4d945b8-b02d-41c1-880e-71ceb3168a9d',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            102 =>
            array(
                'id' => 'dd105dfe-2680-4bd9-b93a-affa79df2011',
                'name' => 'Vinh',

                'city_id' => '80ca44a2-9bfc-448a-9b43-ca3d741fa868',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            103 =>
            array(
                'id' => 'ddacf405-9591-4551-ae09-666e9d88e9ea',
                'name' => 'Đô Lương',

                'city_id' => '80ca44a2-9bfc-448a-9b43-ca3d741fa868',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            104 =>
            array(
                'id' => 'ddfa9979-4d87-4b45-8900-792a3df1334c',
                'name' => 'Hồng Ngự',

                'city_id' => 'fef45e17-2058-4cb8-ac6d-51f4d082b088',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            105 =>
            array(
                'id' => 'de0d1170-7a30-412b-9a5f-bc211aee42df',
                'name' => 'Chợ Mới',

                'city_id' => 'fb0e6f30-8a60-44f2-85b9-4c3c13c14220',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            106 =>
            array(
                'id' => 'def15846-9f86-4af1-bc63-54c1eaf4c23b',
                'name' => 'Phong Thổ',

                'city_id' => 'f69c204f-2c46-44dc-a932-12d7cec3a669',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            107 =>
            array(
                'id' => 'defbb1f4-1ece-4228-b5e7-95c3ab0e0cc0',
                'name' => 'Ninh Giang',

                'city_id' => '45b755a9-2397-42da-b45e-2dc8e23e0f4f',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            108 =>
            array(
                'id' => 'df06694a-8f87-4404-a259-211fc8a4aa9b',
                'name' => 'Xín Mần',

                'city_id' => 'd1d97f9b-ca69-415f-afcd-a3e4decd023e',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            109 =>
            array(
                'id' => 'df084cac-4280-46bb-86a4-76d1cfea33c0',
                'name' => 'Long Thành',

                'city_id' => 'a4d945b8-b02d-41c1-880e-71ceb3168a9d',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            110 =>
            array(
                'id' => 'df63a98c-c2a8-48a2-a2ef-8c3d2e24a0df',
                'name' => 'Bảo Lâm',

                'city_id' => 'da297b82-b4de-4c8d-a252-b2df97fa8be7',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            111 =>
            array(
                'id' => 'dfb2b04d-f7b6-4189-9d2f-b2742049a888',
                'name' => 'Thới Lai',

                'city_id' => '78810fa4-611c-4088-aa1b-777926ec9b13',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            112 =>
            array(
                'id' => 'dfcf67db-7073-44fd-8301-2928d68c335b',
                'name' => 'Bảo Lâm',

                'city_id' => 'b01fa938-cffc-49b1-9e83-a337422f132e',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            113 =>
            array(
                'id' => 'e0b7fdff-cf10-4f8b-b793-c175db4b22f0',
                'name' => 'Tân Sơn',

                'city_id' => '7beeed0d-f6f7-49a3-87ff-4e363a27108a',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            114 =>
            array(
                'id' => 'e14c53a9-b9e3-4ea5-b178-abe27ff78f3c',
                'name' => 'Kỳ Anh',

                'city_id' => '250bf51a-3b01-4246-ab2b-7583bdaf89e1',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            115 =>
            array(
                'id' => 'e1ee13e0-def3-4aba-b16b-3a66b627b8ee',
                'name' => 'Tân Hồng',

                'city_id' => 'fef45e17-2058-4cb8-ac6d-51f4d082b088',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            116 =>
            array(
                'id' => 'e21e7fd4-bc17-488f-b222-7212de5cd76a',
                'name' => 'Krông Năng',

                'city_id' => 'c0e9071f-1445-479a-b658-7d312ed909fd',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            117 =>
            array(
                'id' => 'e2327307-5d82-4ec4-a408-dbdac71e01b3',
                'name' => 'Tam Nông',

                'city_id' => '7beeed0d-f6f7-49a3-87ff-4e363a27108a',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            118 =>
            array(
                'id' => 'e284d10c-a540-4637-baa4-60a07e0fd91c',
                'name' => 'Tiểu Cần',

                'city_id' => 'f6275b3f-09de-44b3-87a2-b9cec4ae89c8',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            119 =>
            array(
                'id' => 'e2faea7a-dac8-4eb1-80e7-217bdbd0f739',
                'name' => 'Hà Trung',

                'city_id' => 'b577fbe5-2420-4ac7-9298-8a8bd04bc217',
                'created_at' => '2021-09-23 16:17:54',
                'updated_at' => '2021-09-23 16:17:54',
            ),
            120 =>
            array(
                'id' => 'e3c57b48-7287-4f1f-a373-5293c3b80f9b',
                'name' => 'Di Linh',

                'city_id' => 'b01fa938-cffc-49b1-9e83-a337422f132e',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            121 =>
            array(
                'id' => 'e3f4e409-9087-461f-aa9b-d03501449260',
                'name' => 'Sơn Tịnh',

                'city_id' => 'bc4e7995-4afa-4f16-aa08-3a5c690d79b6',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            122 =>
            array(
                'id' => 'e40139a6-642b-4ae0-9ecb-5dd972e4bf32',
                'name' => 'Thị xã Giá Rai',

                'city_id' => '65d1fabe-3373-4612-bb48-4fd92866c5fe',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            123 =>
            array(
                'id' => 'e486fba4-a859-4fc9-9788-a74582e4de07',
                'name' => 'Thị xã Sa Pa',

                'city_id' => '637ad6dd-e601-46db-9f06-a36937ff1b0a',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            124 =>
            array(
                'id' => 'e4b1120b-b2ec-4f95-b77f-ea9b30226fc6',
                'name' => 'Ứng Hòa',

                'city_id' => '7ffe542b-8ae7-415e-b1de-6564e3f3d4ef',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            125 =>
            array(
                'id' => 'e4da37bf-177c-46de-89ed-5bf390e32a20',
                'name' => 'Trà Ôn',

                'city_id' => '9d68ecc4-0cce-419e-baa8-9f4b320fc3da',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            126 =>
            array(
                'id' => 'e4de54a5-928e-4f2e-a124-ffce0a6437d3',
                'name' => 'Đắk R\'Lấp',

                'city_id' => '5563c615-1302-4c13-994c-4ed3f3695f76',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            127 =>
            array(
                'id' => 'e516557c-0291-4dd8-a8b8-cdd91f96b69f',
                'name' => 'Ea H\'leo',

                'city_id' => 'c0e9071f-1445-479a-b658-7d312ed909fd',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            128 =>
            array(
                'id' => 'e5a51abf-d741-4b86-a6a7-5c08a5f5a3c2',
                'name' => 'An Minh',

                'city_id' => '9104b60d-125b-45de-8f0c-e14893ef5ee3',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            129 =>
            array(
                'id' => 'e60a4981-8a55-4425-82d6-a13f75c189aa',
                'name' => 'Tánh Linh',

                'city_id' => '454a9560-7637-4d5a-9792-a7a63cce6bc3',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            130 =>
            array(
                'id' => 'e61f5ec8-ee8e-471c-b802-c77709e83cf0',
                'name' => 'Thị xã Thái Hoà',

                'city_id' => '80ca44a2-9bfc-448a-9b43-ca3d741fa868',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            131 =>
            array(
                'id' => 'e6bd1b48-94db-44ce-aab0-3db8679d560d',
                'name' => 'Đắk Glei',

                'city_id' => '4e01437c-3ac0-4958-a3a9-125f9c375c49',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            132 =>
            array(
                'id' => 'e7252378-1282-426b-9f54-ec344a9b0b4b',
                'name' => 'Thạnh Hóa',

                'city_id' => 'a3e0801f-502d-4b6e-bc7e-20f616ac3931',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            133 =>
            array(
                'id' => 'e7704060-3288-47c0-a804-a9eda90a5efa',
                'name' => 'Vũ Quang',

                'city_id' => '250bf51a-3b01-4246-ab2b-7583bdaf89e1',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            134 =>
            array(
                'id' => 'e818058b-49f2-4b8e-b2dd-74b08ed26e09',
                'name' => 'Bắc Bình',

                'city_id' => '454a9560-7637-4d5a-9792-a7a63cce6bc3',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            135 =>
            array(
                'id' => 'e8496ee0-49ba-404b-880f-722f9278ac52',
                'name' => 'Yên Thế',

                'city_id' => '5e97693a-356d-4886-8ed2-b78c42f56115',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            136 =>
            array(
                'id' => 'e877a691-1fd5-4de2-b656-32b88939cf19',
                'name' => 'Si Ma Cai',

                'city_id' => '637ad6dd-e601-46db-9f06-a36937ff1b0a',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            137 =>
            array(
                'id' => 'e8d4d2be-deaf-4a94-8b54-5bd27992b6ea',
                'name' => 'Châu Đức',

                'city_id' => 'b720536f-26aa-41c5-b29c-e0dc9fad61ad',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            138 =>
            array(
                'id' => 'e8ffc839-b821-421e-bac9-c2b95f4b9263',
                'name' => 'Đức Hòa',

                'city_id' => 'a3e0801f-502d-4b6e-bc7e-20f616ac3931',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            139 =>
            array(
                'id' => 'e9892d19-de00-4fcc-9f66-ce510bc1f3e7',
                'name' => 'Bá Thước',

                'city_id' => 'b577fbe5-2420-4ac7-9298-8a8bd04bc217',
                'created_at' => '2021-09-23 16:17:54',
                'updated_at' => '2021-09-23 16:17:54',
            ),
            140 =>
            array(
                'id' => 'e9ad0770-bd48-4cf8-98c4-98719c94255b',
                'name' => 'Phong Điền',

                'city_id' => '78810fa4-611c-4088-aa1b-777926ec9b13',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            141 =>
            array(
                'id' => 'e9d070d7-09d8-476d-b4b6-0222f4647ba3',
                'name' => 'Đầm Dơi',

                'city_id' => 'd37a60f8-a1b0-4152-8778-395791e523f6',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            142 =>
            array(
                'id' => 'e9f458b3-c822-4b1e-8780-0da79a873559',
                'name' => 'Lắk',

                'city_id' => 'c0e9071f-1445-479a-b658-7d312ed909fd',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            143 =>
            array(
                'id' => 'ea329371-276b-4a31-bdad-93c3faebb9fc',
                'name' => 'Đầm Hà',

                'city_id' => 'd4dcf702-42a9-4068-8d9e-176d22279e32',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            144 =>
            array(
                'id' => 'ea563b40-4a53-420a-9bcf-1ea305dcfeaa',
                'name' => 'Thoại Sơn',

                'city_id' => 'fb0e6f30-8a60-44f2-85b9-4c3c13c14220',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            145 =>
            array(
                'id' => 'ea830db7-7fbf-4a24-97b8-b2335c9c34d2',
                'name' => 'Hương Sơn',

                'city_id' => '250bf51a-3b01-4246-ab2b-7583bdaf89e1',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            146 =>
            array(
                'id' => 'eb1969c5-602a-43c1-85ff-d68b26fc6fa9',
                'name' => 'Thăng Bình',

                'city_id' => 'e51deafd-86b7-493d-a035-b369ed6e5b5f',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            147 =>
            array(
                'id' => 'eb1fc0f4-64a4-402f-8e72-99f5dacd88ea',
                'name' => 'Thị xã Từ Sơn',

                'city_id' => '2ca3f74e-6ded-4339-8b12-c26e4b6d1a52',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            148 =>
            array(
                'id' => 'eb253af0-09b8-4805-92ab-0dffb634f96b',
                'name' => 'Châu Thành',

                'city_id' => '7e28b375-6c0b-4c30-bbb9-2fd254cf75da',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            149 =>
            array(
                'id' => 'eb5cb6cc-8fe6-4176-944f-b23edf22f23b',
                'name' => 'Sa Đéc',

                'city_id' => 'fef45e17-2058-4cb8-ac6d-51f4d082b088',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            150 =>
            array(
                'id' => 'edef831c-7b73-4c56-9e01-2f96787bbf15',
                'name' => 'Mê Linh',

                'city_id' => '7ffe542b-8ae7-415e-b1de-6564e3f3d4ef',
                'created_at' => '2021-09-23 16:17:48',
                'updated_at' => '2021-09-23 16:17:48',
            ),
            151 =>
            array(
                'id' => 'edf25fef-a9aa-4229-87d4-a8b5881d24f6',
                'name' => 'Chợ Gạo',

                'city_id' => '80180775-e6f5-4b0d-b606-ac976283638c',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            152 =>
            array(
                'id' => 'eea20bb0-e728-449e-9466-4564c612f4cd',
                'name' => 'Vân Đồn',

                'city_id' => 'd4dcf702-42a9-4068-8d9e-176d22279e32',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            153 =>
            array(
                'id' => 'eec13a74-6424-4e0e-a411-62731e5f5fda',
                'name' => 'Dầu Tiếng',

                'city_id' => 'cfe34498-401b-4f19-8565-486da5945f30',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            154 =>
            array(
                'id' => 'efb3f732-c2a6-4f1f-beb5-717409405952',
                'name' => 'Hoài Ân',

                'city_id' => '10878756-f388-482c-bdf2-c9a0b5f4ef7c',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            155 =>
            array(
                'id' => 'efd1c93e-cddc-4fdb-94ad-7624fa00dc4c',
                'name' => 'Châu Thành',

                'city_id' => '63cea115-2d29-4893-ba22-518aa3451f35',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            156 =>
            array(
                'id' => 'f04259fe-0a2e-4f5a-bdb1-841d8f8007ec',
                'name' => 'Mù Căng Chải',

                'city_id' => 'efc143a2-35ac-4f33-9934-5d9177bcb7e1',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            157 =>
            array(
                'id' => 'f04414de-6627-486d-8472-79061c66950b',
                'name' => 'Đa Krông',

                'city_id' => '6b1145ac-a1dd-42e8-9b9f-5d2cceb14253',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            158 =>
            array(
                'id' => 'f0e73811-6ae6-4b0f-bce2-c625b215f641',
                'name' => 'Long Phú',

                'city_id' => '1a71e7ff-a963-4364-bbbd-ecf59ae7f965',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            159 =>
            array(
                'id' => 'f11ecc29-5f9e-456d-8520-ea0d04eb760a',
                'name' => 'Trần Đề',

                'city_id' => '1a71e7ff-a963-4364-bbbd-ecf59ae7f965',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            160 =>
            array(
                'id' => 'f1e4e3a5-d59f-4f36-900b-7c82f6b22e03',
                'name' => 'Bạc Liêu',

                'city_id' => '65d1fabe-3373-4612-bb48-4fd92866c5fe',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            161 =>
            array(
                'id' => 'f204582a-b98e-4e17-a98e-95c01f9e76c6',
                'name' => 'Cần Giờ',

                'city_id' => 'e30bfd9c-0668-4860-b065-455cae47d328',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            162 =>
            array(
                'id' => 'f2aa04c0-d348-418a-8458-1b9fd4f88522',
                'name' => 'Đất Đỏ',

                'city_id' => 'b720536f-26aa-41c5-b29c-e0dc9fad61ad',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            163 =>
            array(
                'id' => 'f3b0b644-1fe6-46da-995e-41eef7ef6d15',
                'name' => 'Phú Tân',

                'city_id' => 'd37a60f8-a1b0-4152-8778-395791e523f6',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            164 =>
            array(
                'id' => 'f3f00a6b-df8b-44fd-82c4-084babc12c63',
                'name' => 'Quy Nhơn',

                'city_id' => '10878756-f388-482c-bdf2-c9a0b5f4ef7c',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            165 =>
            array(
                'id' => 'f3f99400-83f6-40d9-ac8c-67c14acf9845',
                'name' => 'Thị xã Mỹ Hào',

                'city_id' => '312016bb-b80f-4456-aad2-9e69a0ea2f5f',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            166 =>
            array(
                'id' => 'f4bc853c-2795-4518-9f85-68fc63c5e296',
                'name' => 'Phú Bình',

                'city_id' => '1a07bb93-f1d7-4c58-9578-036b0d20741b',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            167 =>
            array(
                'id' => 'f537ba22-a1f8-483e-bf1b-ada9cdb1e324',
                'name' => 'Nghi Xuân',

                'city_id' => '250bf51a-3b01-4246-ab2b-7583bdaf89e1',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            168 =>
            array(
                'id' => 'f58cf4a9-ab5b-4ab9-87e3-6b0254ab93a9',
                'name' => 'Thị xã Trảng Bàng',

                'city_id' => '8c1436f7-2d32-4784-afd8-70d331936e5a',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            169 =>
            array(
                'id' => 'f5e59e77-2c8e-47f0-adbf-bb99b47338d2',
                'name' => 'Trảng Bom',

                'city_id' => 'a4d945b8-b02d-41c1-880e-71ceb3168a9d',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            170 =>
            array(
                'id' => 'f67921ad-ce69-465f-a3db-760502601c39',
                'name' => 'Bình Gia',

                'city_id' => '01822d18-7a7e-4b64-970c-c00bde7cae5e',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            171 =>
            array(
                'id' => 'f67aa185-32fc-4343-ad69-68ad78e7dfc6',
                'name' => 'Phú Giáo',

                'city_id' => 'cfe34498-401b-4f19-8565-486da5945f30',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            172 =>
            array(
                'id' => 'f695a66f-ac74-441c-b2e2-654526273df2',
                'name' => 'Quỳ Châu',

                'city_id' => '80ca44a2-9bfc-448a-9b43-ca3d741fa868',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            173 =>
            array(
                'id' => 'f6eac311-7159-4e71-a969-ab9eb08517ca',
                'name' => 'Yên Định',

                'city_id' => 'b577fbe5-2420-4ac7-9298-8a8bd04bc217',
                'created_at' => '2021-09-23 16:17:54',
                'updated_at' => '2021-09-23 16:17:54',
            ),
            174 =>
            array(
                'id' => 'f72dc4e9-b21c-4bcf-b5f8-34891a5ea8de',
                'name' => 'Quan Hóa',

                'city_id' => 'b577fbe5-2420-4ac7-9298-8a8bd04bc217',
                'created_at' => '2021-09-23 16:17:54',
                'updated_at' => '2021-09-23 16:17:54',
            ),
            175 =>
            array(
                'id' => 'f7e99017-4af9-4ae3-aa62-0354a9579a59',
                'name' => 'Phù Yên',

                'city_id' => '30e8ea4f-cd4b-4e19-b8ed-9d21e06f531b',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            176 =>
            array(
                'id' => 'f8256f11-4723-48d5-9d7d-90ab3c250e46',
                'name' => 'Tân Trụ',

                'city_id' => 'a3e0801f-502d-4b6e-bc7e-20f616ac3931',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            177 =>
            array(
                'id' => 'f85ab081-60d2-4869-9d70-c7083a81e4ca',
                'name' => 'Lạng Sơn',

                'city_id' => '01822d18-7a7e-4b64-970c-c00bde7cae5e',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            178 =>
            array(
                'id' => 'f874f625-0936-44d8-90f2-ec6442184d3e',
                'name' => 'Tân An',

                'city_id' => 'a3e0801f-502d-4b6e-bc7e-20f616ac3931',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            179 =>
            array(
                'id' => 'f8ae9547-c8aa-420b-aff0-07e2ed3289a9',
                'name' => 'Cẩm Phả',

                'city_id' => 'd4dcf702-42a9-4068-8d9e-176d22279e32',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            180 =>
            array(
                'id' => 'f930d847-d7c3-4115-ad35-30ad579d9cdd',
                'name' => 'Vũng Liêm',

                'city_id' => '9d68ecc4-0cce-419e-baa8-9f4b320fc3da',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            181 =>
            array(
                'id' => 'f94d07da-cb97-475f-bc04-d89dbe68e504',
                'name' => 'Sơn Trà',

                'city_id' => '1de081d3-e6f4-4bab-a727-bab36f976dc9',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            182 =>
            array(
                'id' => 'f998db5f-f774-42b3-bc8f-73db7f6562cf',
                'name' => 'Hòa An',

                'city_id' => 'da297b82-b4de-4c8d-a252-b2df97fa8be7',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            183 =>
            array(
                'id' => 'f9cb20af-9dab-41f1-9395-e898ba2da979',
                'name' => 'Buôn Ma Thuột',

                'city_id' => 'c0e9071f-1445-479a-b658-7d312ed909fd',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            184 =>
            array(
                'id' => 'fa02e499-8fbb-492d-bda7-b0d1f3a2a51b',
                'name' => 'KBang',

                'city_id' => '64b7dd07-06f2-4ebb-9060-5b43862c9492',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            185 =>
            array(
                'id' => 'fa0ecbc6-f28b-44f2-943c-43354df50408',
                'name' => 'Phú Quốc',

                'city_id' => '9104b60d-125b-45de-8f0c-e14893ef5ee3',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            186 =>
            array(
                'id' => 'fa1046f1-b7ff-4851-9595-3eb44eb18584',
                'name' => 'Sốp Cộp',

                'city_id' => '30e8ea4f-cd4b-4e19-b8ed-9d21e06f531b',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            187 =>
            array(
                'id' => 'fa834174-85c2-42da-9fff-47aeb308d6ce',
                'name' => 'Bác Ái',

                'city_id' => '0a602243-f105-4c21-9a39-a9317d4c8aae',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            188 =>
            array(
                'id' => 'fae69d3c-f679-4027-830f-0ba26a2462aa',
                'name' => 'Thị xã Hương Thủy',

                'city_id' => '313269fe-b585-4e5f-9f4d-b94113fc2ae7',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            189 =>
            array(
                'id' => 'fb2540e6-3ea3-4cd0-be06-6f89fb704755',
                'name' => 'Vĩnh Long',

                'city_id' => '9d68ecc4-0cce-419e-baa8-9f4b320fc3da',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            190 =>
            array(
                'id' => 'fc07c784-5985-4cc2-9c77-4e8f12b6c37d',
                'name' => 'Cam Lộ',

                'city_id' => '6b1145ac-a1dd-42e8-9b9f-5d2cceb14253',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            191 =>
            array(
                'id' => 'fd95867e-5280-4f27-b6e2-0702f6eaa389',
                'name' => 'Bắc Trà My',

                'city_id' => 'e51deafd-86b7-493d-a035-b369ed6e5b5f',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            192 =>
            array(
                'id' => 'fdeee45c-6bf8-43d0-ad89-d35126d7fe6d',
                'name' => 'Thủ Dầu Một',

                'city_id' => 'cfe34498-401b-4f19-8565-486da5945f30',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            193 =>
            array(
                'id' => 'fe800038-1b11-4afd-ab83-e5faabaeb8a7',
                'name' => 'Lập Thạch',

                'city_id' => '90bbe443-069a-4354-8e96-8fcb1c2870bf',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            194 =>
            array(
                'id' => 'fe93cf05-87dd-4747-9d8b-ab0067996801',
                'name' => 'Kiến An',

                'city_id' => '37bf04e5-d907-443f-b7b3-b45c028a3db7',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            195 =>
            array(
                'id' => 'ff11a25e-c689-4637-8d81-b1de35792e73',
                'name' => 'Kim Sơn',

                'city_id' => 'eb0bef04-0188-44f2-8f7b-60152624e033',
                'created_at' => '2021-09-23 16:17:54',
                'updated_at' => '2021-09-23 16:17:54',
            ),
            196 =>
            array(
                'id' => 'ff569075-12ca-4e9c-b969-b02ee9a62331',
                'name' => 'Lạc Thủy',

                'city_id' => 'f05ae9d8-a765-482b-90cf-2ba6434ee185',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            197 =>
            array(
                'id' => 'ff5f54e7-a976-40ef-afba-647186caea8e',
                'name' => 'Hưng Hà',

                'city_id' => '0dcb18c9-edea-4255-81ea-34ab31c60c28',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            198 =>
            array(
                'id' => 'ffafacff-064f-45ed-afab-4f8c743e64b9',
                'name' => 'Châu Thành',

                'city_id' => '1a71e7ff-a963-4364-bbbd-ecf59ae7f965',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            199 =>
            array(
                'id' => 'ffb645dc-0920-49b2-9761-85e632c90a3d',
                'name' => 'Cô Tô',

                'city_id' => 'd4dcf702-42a9-4068-8d9e-176d22279e32',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
        ));
    }
}
