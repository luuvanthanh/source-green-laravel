<?php

use Illuminate\Database\Seeder;

class CitysTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        \DB::table('Citys')->delete();

        \DB::table('Citys')->insert(array(
            0 =>
            array(
                'Id' => 'c0e9071f-1445-479a-b658-7d312ed909fd',
                'Name' => 'Đắk Lắk',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:06',
                'LastModificationTime' => '2021-09-23 16:19:06',
                'Code' => '262',
                'DeletionTime' => NULL,
            ),
            1 =>
            array(
                'Id' => '5563c615-1302-4c13-994c-4ed3f3695f76',
                'Name' => 'Đắk Nông',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:06',
                'LastModificationTime' => '2021-09-23 16:19:06',
                'Code' => '261',
                'DeletionTime' => NULL,
            ),
            2 =>
            array(
                'Id' => '1de081d3-e6f4-4bab-a727-bab36f976dc9',
                'Name' => 'Đà Nẵng',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:04',
                'LastModificationTime' => '2021-09-23 16:19:04',
                'Code' => '236',
                'DeletionTime' => NULL,
            ),
            3 =>
            array(
                'Id' => '0acc5189-a3aa-47cb-b9ae-d2cdbd750b54',
                'Name' => 'Điện Biên',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:17:50',
                'LastModificationTime' => '2021-09-23 16:17:50',
                'Code' => '215',
                'DeletionTime' => NULL,
            ),
            4 =>
            array(
                'Id' => 'a4d945b8-b02d-41c1-880e-71ceb3168a9d',
                'Name' => 'Đồng Nai',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:07',
                'LastModificationTime' => '2021-09-23 16:19:07',
                'Code' => '251',
                'DeletionTime' => NULL,
            ),
            5 =>
            array(
                'Id' => 'fef45e17-2058-4cb8-ac6d-51f4d082b088',
                'Name' => 'Đồng Tháp',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:08',
                'LastModificationTime' => '2021-09-23 16:19:08',
                'Code' => '277',
                'DeletionTime' => NULL,
            ),
            6 =>
            array(
                'Id' => '64b7dd07-06f2-4ebb-9060-5b43862c9492',
                'Name' => 'Gia Lai',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:05',
                'LastModificationTime' => '2021-09-23 16:19:05',
                'Code' => '269',
                'DeletionTime' => NULL,
            ),
            7 =>
            array(
                'Id' => 'd1d97f9b-ca69-415f-afcd-a3e4decd023e',
                'Name' => 'Hà Giang',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:17:49',
                'LastModificationTime' => '2021-09-23 16:17:49',
                'Code' => '219',
                'DeletionTime' => NULL,
            ),
            8 =>
            array(
                'Id' => '45b755a9-2397-42da-b45e-2dc8e23e0f4f',
                'Name' => 'Hải Dương',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:17:52',
                'LastModificationTime' => '2021-09-23 16:17:52',
                'Code' => '220',
                'DeletionTime' => NULL,
            ),
            9 =>
            array(
                'Id' => 'fb0e6f30-8a60-44f2-85b9-4c3c13c14220',
                'Name' => 'An Giang',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:08',
                'LastModificationTime' => '2021-09-23 16:19:08',
                'Code' => '296',
                'DeletionTime' => NULL,
            ),
            10 =>
            array(
                'Id' => '5e97693a-356d-4886-8ed2-b78c42f56115',
                'Name' => 'Bắc Giang',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:17:51',
                'LastModificationTime' => '2021-09-23 16:17:51',
                'Code' => '209',
                'DeletionTime' => NULL,
            ),
            11 =>
            array(
                'Id' => 'c03bc001-7700-4187-b7d2-1b14ca5b73ef',
                'Name' => 'Bắc Kạn',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:17:49',
                'LastModificationTime' => '2021-09-23 16:17:49',
                'Code' => '209',
                'DeletionTime' => NULL,
            ),
            12 =>
            array(
                'Id' => '37bf04e5-d907-443f-b7b3-b45c028a3db7',
                'Name' => 'Hải Phòng',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:17:52',
                'LastModificationTime' => '2021-09-23 16:17:52',
                'Code' => '225',
                'DeletionTime' => NULL,
            ),
            13 =>
            array(
                'Id' => '65d1fabe-3373-4612-bb48-4fd92866c5fe',
                'Name' => 'Bạc Liêu',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:09',
                'LastModificationTime' => '2021-09-23 16:19:09',
                'Code' => '291',
                'DeletionTime' => NULL,
            ),
            14 =>
            array(
                'Id' => '485eb0a2-0f49-4690-a615-e2e8ed951656',
                'Name' => 'Hà Nam',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:17:53',
                'LastModificationTime' => '2021-09-23 16:17:53',
                'Code' => '226',
                'DeletionTime' => NULL,
            ),
            15 =>
            array(
                'Id' => '2ca3f74e-6ded-4339-8b12-c26e4b6d1a52',
                'Name' => 'Bắc Ninh',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:17:52',
                'LastModificationTime' => '2021-09-23 16:17:52',
                'Code' => '222',
                'DeletionTime' => NULL,
            ),
            16 =>
            array(
                'Id' => '7ffe542b-8ae7-415e-b1de-6564e3f3d4ef',
                'Name' => 'Hà Nội',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:17:48',
                'LastModificationTime' => '2021-09-23 16:17:48',
                'Code' => '24',
                'DeletionTime' => NULL,
            ),
            17 =>
            array(
                'Id' => '250bf51a-3b01-4246-ab2b-7583bdaf89e1',
                'Name' => 'Hà Tĩnh',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:03',
                'LastModificationTime' => '2021-09-23 16:19:03',
                'Code' => '239',
                'DeletionTime' => NULL,
            ),
            18 =>
            array(
                'Id' => 'b720536f-26aa-41c5-b29c-e0dc9fad61ad',
                'Name' => 'Bà Rịa - Vũng Tàu',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:07',
                'LastModificationTime' => '2021-09-23 16:19:07',
                'Code' => '254',
                'DeletionTime' => NULL,
            ),
            19 =>
            array(
                'Id' => '7e28b375-6c0b-4c30-bbb9-2fd254cf75da',
                'Name' => 'Bến Tre',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:08',
                'LastModificationTime' => '2021-09-23 16:19:08',
                'Code' => '275',
                'DeletionTime' => NULL,
            ),
            20 =>
            array(
                'Id' => '10878756-f388-482c-bdf2-c9a0b5f4ef7c',
                'Name' => 'Bình Định',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:05',
                'LastModificationTime' => '2021-09-23 16:19:05',
                'Code' => '256',
                'DeletionTime' => NULL,
            ),
            21 =>
            array(
                'Id' => '63cea115-2d29-4893-ba22-518aa3451f35',
                'Name' => 'Hậu Giang',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:09',
                'LastModificationTime' => '2021-09-23 16:19:09',
                'Code' => '293',
                'DeletionTime' => NULL,
            ),
            22 =>
            array(
                'Id' => 'cfe34498-401b-4f19-8565-486da5945f30',
                'Name' => 'Bình Dương',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:06',
                'LastModificationTime' => '2021-09-23 16:19:06',
                'Code' => '274',
                'DeletionTime' => NULL,
            ),
            23 =>
            array(
                'Id' => 'f05ae9d8-a765-482b-90cf-2ba6434ee185',
                'Name' => 'Hòa Bình',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:17:50',
                'LastModificationTime' => '2021-09-23 16:17:50',
                'Code' => '218',
                'DeletionTime' => NULL,
            ),
            24 =>
            array(
                'Id' => 'e30bfd9c-0668-4860-b065-455cae47d328',
                'Name' => 'Hồ Chí Minh',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:07',
                'LastModificationTime' => '2021-09-23 16:19:07',
                'Code' => '28',
                'DeletionTime' => NULL,
            ),
            25 =>
            array(
                'Id' => '312016bb-b80f-4456-aad2-9e69a0ea2f5f',
                'Name' => 'Hưng Yên',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:17:53',
                'LastModificationTime' => '2021-09-23 16:17:53',
                'Code' => '221',
                'DeletionTime' => NULL,
            ),
            26 =>
            array(
                'Id' => 'f1282eac-a136-42f4-a1ad-76096405ba95',
                'Name' => 'Bình Phước',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:06',
                'LastModificationTime' => '2021-09-23 16:19:06',
                'Code' => '271',
                'DeletionTime' => NULL,
            ),
            27 =>
            array(
                'Id' => '67c9c91d-e4d5-4541-babb-2a5232c6ff7d',
                'Name' => 'Khánh Hòa',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:05',
                'LastModificationTime' => '2021-09-23 16:19:05',
                'Code' => '258',
                'DeletionTime' => NULL,
            ),
            28 =>
            array(
                'Id' => '454a9560-7637-4d5a-9792-a7a63cce6bc3',
                'Name' => 'Bình Thuận',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:05',
                'LastModificationTime' => '2021-09-23 16:19:05',
                'Code' => '252',
                'DeletionTime' => NULL,
            ),
            29 =>
            array(
                'Id' => '9104b60d-125b-45de-8f0c-e14893ef5ee3',
                'Name' => 'Kiên Giang',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:08',
                'LastModificationTime' => '2021-09-23 16:19:08',
                'Code' => '297',
                'DeletionTime' => NULL,
            ),
            30 =>
            array(
                'Id' => '4e01437c-3ac0-4958-a3a9-125f9c375c49',
                'Name' => 'Kon Tum',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:05',
                'LastModificationTime' => '2021-09-23 16:19:05',
                'Code' => '260',
                'DeletionTime' => NULL,
            ),
            31 =>
            array(
                'Id' => 'f69c204f-2c46-44dc-a932-12d7cec3a669',
                'Name' => 'Lai Châu',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:17:50',
                'LastModificationTime' => '2021-09-23 16:17:50',
                'Code' => '213',
                'DeletionTime' => NULL,
            ),
            32 =>
            array(
                'Id' => 'd37a60f8-a1b0-4152-8778-395791e523f6',
                'Name' => 'Cà Mau',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:09',
                'LastModificationTime' => '2021-09-23 16:19:09',
                'Code' => '290',
                'DeletionTime' => NULL,
            ),
            33 =>
            array(
                'Id' => 'b01fa938-cffc-49b1-9e83-a337422f132e',
                'Name' => 'Lâm Đồng',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:06',
                'LastModificationTime' => '2021-09-23 16:19:06',
                'Code' => '263',
                'DeletionTime' => NULL,
            ),
            34 =>
            array(
                'Id' => '01822d18-7a7e-4b64-970c-c00bde7cae5e',
                'Name' => 'Lạng Sơn',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:17:51',
                'LastModificationTime' => '2021-09-23 16:17:51',
                'Code' => '205',
                'DeletionTime' => NULL,
            ),
            35 =>
            array(
                'Id' => '637ad6dd-e601-46db-9f06-a36937ff1b0a',
                'Name' => 'Lào Cai',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:17:49',
                'LastModificationTime' => '2021-09-23 16:17:49',
                'Code' => '214',
                'DeletionTime' => NULL,
            ),
            36 =>
            array(
                'Id' => 'a3e0801f-502d-4b6e-bc7e-20f616ac3931',
                'Name' => 'Long An',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:07',
                'LastModificationTime' => '2021-09-23 16:19:07',
                'Code' => '272',
                'DeletionTime' => NULL,
            ),
            37 =>
            array(
                'Id' => '6d698fb4-9a6a-4504-8634-ab32e39c4aa8',
                'Name' => 'Nam Định',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:17:53',
                'LastModificationTime' => '2021-09-23 16:17:53',
                'Code' => '228',
                'DeletionTime' => NULL,
            ),
            38 =>
            array(
                'Id' => '80ca44a2-9bfc-448a-9b43-ca3d741fa868',
                'Name' => 'Nghệ An',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:03',
                'LastModificationTime' => '2021-09-23 16:19:03',
                'Code' => '238',
                'DeletionTime' => NULL,
            ),
            39 =>
            array(
                'Id' => 'eb0bef04-0188-44f2-8f7b-60152624e033',
                'Name' => 'Ninh Bình',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:17:53',
                'LastModificationTime' => '2021-09-23 16:17:53',
                'Code' => '229',
                'DeletionTime' => NULL,
            ),
            40 =>
            array(
                'Id' => '0a602243-f105-4c21-9a39-a9317d4c8aae',
                'Name' => 'Ninh Thuận',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:05',
                'LastModificationTime' => '2021-09-23 16:19:05',
                'Code' => '259',
                'DeletionTime' => NULL,
            ),
            41 =>
            array(
                'Id' => '7beeed0d-f6f7-49a3-87ff-4e363a27108a',
                'Name' => 'Phú Thọ',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:17:52',
                'LastModificationTime' => '2021-09-23 16:17:52',
                'Code' => '210',
                'DeletionTime' => NULL,
            ),
            42 =>
            array(
                'Id' => '0920c620-d074-492e-8c99-3fb5aab15d3c',
                'Name' => 'Phú Yên',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:05',
                'LastModificationTime' => '2021-09-23 16:19:05',
                'Code' => '257',
                'DeletionTime' => NULL,
            ),
            43 =>
            array(
                'Id' => '1182ce56-8620-4d32-a32c-9561dcb52983',
                'Name' => 'Quảng Bình',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:04',
                'LastModificationTime' => '2021-09-23 16:19:04',
                'Code' => '232',
                'DeletionTime' => NULL,
            ),
            44 =>
            array(
                'Id' => 'e51deafd-86b7-493d-a035-b369ed6e5b5f',
                'Name' => 'Quảng Nam',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:04',
                'LastModificationTime' => '2021-09-23 16:19:04',
                'Code' => '235',
                'DeletionTime' => NULL,
            ),
            45 =>
            array(
                'Id' => 'bc4e7995-4afa-4f16-aa08-3a5c690d79b6',
                'Name' => 'Quảng Ngãi',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:04',
                'LastModificationTime' => '2021-09-23 16:19:04',
                'Code' => '255',
                'DeletionTime' => NULL,
            ),
            46 =>
            array(
                'Id' => 'd4dcf702-42a9-4068-8d9e-176d22279e32',
                'Name' => 'Quảng Ninh',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:17:51',
                'LastModificationTime' => '2021-09-23 16:17:51',
                'Code' => '203',
                'DeletionTime' => NULL,
            ),
            47 =>
            array(
                'Id' => '6b1145ac-a1dd-42e8-9b9f-5d2cceb14253',
                'Name' => 'Quảng Trị',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:04',
                'LastModificationTime' => '2021-09-23 16:19:04',
                'Code' => '233',
                'DeletionTime' => NULL,
            ),
            48 =>
            array(
                'Id' => '1a71e7ff-a963-4364-bbbd-ecf59ae7f965',
                'Name' => 'Sóc Trăng',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:09',
                'LastModificationTime' => '2021-09-23 16:19:09',
                'Code' => '299',
                'DeletionTime' => NULL,
            ),
            49 =>
            array(
                'Id' => '30e8ea4f-cd4b-4e19-b8ed-9d21e06f531b',
                'Name' => 'Sơn La',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:17:50',
                'LastModificationTime' => '2021-09-23 16:17:50',
                'Code' => '212',
                'DeletionTime' => NULL,
            ),
            50 =>
            array(
                'Id' => '8c1436f7-2d32-4784-afd8-70d331936e5a',
                'Name' => 'Tây Ninh',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:06',
                'LastModificationTime' => '2021-09-23 16:19:06',
                'Code' => '276',
                'DeletionTime' => NULL,
            ),
            51 =>
            array(
                'Id' => '0dcb18c9-edea-4255-81ea-34ab31c60c28',
                'Name' => 'Thái Bình',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:17:53',
                'LastModificationTime' => '2021-09-23 16:17:53',
                'Code' => '227',
                'DeletionTime' => NULL,
            ),
            52 =>
            array(
                'Id' => '1a07bb93-f1d7-4c58-9578-036b0d20741b',
                'Name' => 'Thái Nguyên',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:17:51',
                'LastModificationTime' => '2021-09-23 16:17:51',
                'Code' => '208',
                'DeletionTime' => NULL,
            ),
            53 =>
            array(
                'Id' => 'b577fbe5-2420-4ac7-9298-8a8bd04bc217',
                'Name' => 'Thanh Hóa',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:17:54',
                'LastModificationTime' => '2021-09-23 16:17:54',
                'Code' => '237',
                'DeletionTime' => NULL,
            ),
            54 =>
            array(
                'Id' => '313269fe-b585-4e5f-9f4d-b94113fc2ae7',
                'Name' => 'Thừa Thiên Huế',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:04',
                'LastModificationTime' => '2021-09-23 16:19:04',
                'Code' => '234',
                'DeletionTime' => NULL,
            ),
            55 =>
            array(
                'Id' => '80180775-e6f5-4b0d-b606-ac976283638c',
                'Name' => 'Tiền Giang',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:07',
                'LastModificationTime' => '2021-09-23 16:19:07',
                'Code' => '273',
                'DeletionTime' => NULL,
            ),
            56 =>
            array(
                'Id' => 'f6275b3f-09de-44b3-87a2-b9cec4ae89c8',
                'Name' => 'Trà Vinh',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:08',
                'LastModificationTime' => '2021-09-23 16:19:08',
                'Code' => '294',
                'DeletionTime' => NULL,
            ),
            57 =>
            array(
                'Id' => 'b1ebf48f-56b7-4882-bf16-9271c1b75196',
                'Name' => 'Tuyên Quang',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:17:49',
                'LastModificationTime' => '2021-09-23 16:17:49',
                'Code' => '207',
                'DeletionTime' => NULL,
            ),
            58 =>
            array(
                'Id' => '9d68ecc4-0cce-419e-baa8-9f4b320fc3da',
                'Name' => 'Vĩnh Long',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:08',
                'LastModificationTime' => '2021-09-23 16:19:08',
                'Code' => '270',
                'DeletionTime' => NULL,
            ),
            59 =>
            array(
                'Id' => '90bbe443-069a-4354-8e96-8fcb1c2870bf',
                'Name' => 'Vĩnh Phúc',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:17:52',
                'LastModificationTime' => '2021-09-23 16:17:52',
                'Code' => '211',
                'DeletionTime' => NULL,
            ),
            60 =>
            array(
                'Id' => 'efc143a2-35ac-4f33-9934-5d9177bcb7e1',
                'Name' => 'Yên Bái',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:17:50',
                'LastModificationTime' => '2021-09-23 16:17:50',
                'Code' => '216',
                'DeletionTime' => NULL,
            ),
            61 =>
            array(
                'Id' => '78810fa4-611c-4088-aa1b-777926ec9b13',
                'Name' => 'Cần Thơ',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:19:09',
                'LastModificationTime' => '2021-09-23 16:19:09',
                'Code' => '292',
                'DeletionTime' => NULL,
            ),
            62 =>
            array(
                'Id' => 'da297b82-b4de-4c8d-a252-b2df97fa8be7',
                'Name' => 'Cao Bằng',
                'NumericalCity' => NULL,
                'CreationTime' => '2021-09-23 16:17:49',
                'LastModificationTime' => '2021-09-23 16:17:49',
                'Code' => '206',
                'DeletionTime' => NULL,
            ),
        ));
    }
}
