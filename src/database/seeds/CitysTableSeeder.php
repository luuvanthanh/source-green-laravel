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
        
        \DB::table('citys')->delete();
        
        \DB::table('citys')->insert(array (
            0 => 
            array (
                'id' => '01822d18-7a7e-4b64-970c-c00bde7cae5e',
                'name' => 'Lạng Sơn',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            1 => 
            array (
                'id' => '0920c620-d074-492e-8c99-3fb5aab15d3c',
                'name' => 'Phú Yên',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            2 => 
            array (
                'id' => '0a602243-f105-4c21-9a39-a9317d4c8aae',
                'name' => 'Ninh Thuận',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            3 => 
            array (
                'id' => '0acc5189-a3aa-47cb-b9ae-d2cdbd750b54',
                'name' => 'Điện Biên',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            4 => 
            array (
                'id' => '0dcb18c9-edea-4255-81ea-34ab31c60c28',
                'name' => 'Thái Bình',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            5 => 
            array (
                'id' => '10878756-f388-482c-bdf2-c9a0b5f4ef7c',
                'name' => 'Bình Định',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            6 => 
            array (
                'id' => '1182ce56-8620-4d32-a32c-9561dcb52983',
                'name' => 'Quảng Bình',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            7 => 
            array (
                'id' => '1a07bb93-f1d7-4c58-9578-036b0d20741b',
                'name' => 'Thái Nguyên',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            8 => 
            array (
                'id' => '1a71e7ff-a963-4364-bbbd-ecf59ae7f965',
                'name' => 'Sóc Trăng',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            9 => 
            array (
                'id' => '1de081d3-e6f4-4bab-a727-bab36f976dc9',
                'name' => 'Đà Nẵng',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            10 => 
            array (
                'id' => '250bf51a-3b01-4246-ab2b-7583bdaf89e1',
                'name' => 'Hà Tĩnh',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            11 => 
            array (
                'id' => '2ca3f74e-6ded-4339-8b12-c26e4b6d1a52',
                'name' => 'Bắc Ninh',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            12 => 
            array (
                'id' => '30e8ea4f-cd4b-4e19-b8ed-9d21e06f531b',
                'name' => 'Sơn La',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            13 => 
            array (
                'id' => '312016bb-b80f-4456-aad2-9e69a0ea2f5f',
                'name' => 'Hưng Yên',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            14 => 
            array (
                'id' => '313269fe-b585-4e5f-9f4d-b94113fc2ae7',
                'name' => 'Thừa Thiên Huế',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            15 => 
            array (
                'id' => '37bf04e5-d907-443f-b7b3-b45c028a3db7',
                'name' => 'Hải Phòng',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            16 => 
            array (
                'id' => '454a9560-7637-4d5a-9792-a7a63cce6bc3',
                'name' => 'Bình Thuận',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            17 => 
            array (
                'id' => '45b755a9-2397-42da-b45e-2dc8e23e0f4f',
                'name' => 'Hải Dương',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            18 => 
            array (
                'id' => '485eb0a2-0f49-4690-a615-e2e8ed951656',
                'name' => 'Hà Nam',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            19 => 
            array (
                'id' => '4e01437c-3ac0-4958-a3a9-125f9c375c49',
                'name' => 'Kon Tum',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            20 => 
            array (
                'id' => '5563c615-1302-4c13-994c-4ed3f3695f76',
                'name' => 'Đắk Nông',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            21 => 
            array (
                'id' => '5e97693a-356d-4886-8ed2-b78c42f56115',
                'name' => 'Bắc Giang',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            22 => 
            array (
                'id' => '637ad6dd-e601-46db-9f06-a36937ff1b0a',
                'name' => 'Lào Cai',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            23 => 
            array (
                'id' => '63cea115-2d29-4893-ba22-518aa3451f35',
                'name' => 'Hậu Giang',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            24 => 
            array (
                'id' => '64b7dd07-06f2-4ebb-9060-5b43862c9492',
                'name' => 'Gia Lai',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            25 => 
            array (
                'id' => '65d1fabe-3373-4612-bb48-4fd92866c5fe',
                'name' => 'Bạc Liêu',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            26 => 
            array (
                'id' => '67c9c91d-e4d5-4541-babb-2a5232c6ff7d',
                'name' => 'Khánh Hòa',
                'created_at' => '2021-09-23 16:19:05',
                'updated_at' => '2021-09-23 16:19:05',
            ),
            27 => 
            array (
                'id' => '6b1145ac-a1dd-42e8-9b9f-5d2cceb14253',
                'name' => 'Quảng Trị',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            28 => 
            array (
                'id' => '6d698fb4-9a6a-4504-8634-ab32e39c4aa8',
                'name' => 'Nam Định',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            29 => 
            array (
                'id' => '78810fa4-611c-4088-aa1b-777926ec9b13',
                'name' => 'Cần Thơ',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            30 => 
            array (
                'id' => '7beeed0d-f6f7-49a3-87ff-4e363a27108a',
                'name' => 'Phú Thọ',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            31 => 
            array (
                'id' => '7e28b375-6c0b-4c30-bbb9-2fd254cf75da',
                'name' => 'Bến Tre',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            32 => 
            array (
                'id' => '7ffe542b-8ae7-415e-b1de-6564e3f3d4ef',
                'name' => 'Hà Nội',
                'created_at' => '2021-09-23 16:17:48',
                'updated_at' => '2021-09-23 16:17:48',
            ),
            33 => 
            array (
                'id' => '80180775-e6f5-4b0d-b606-ac976283638c',
                'name' => 'Tiền Giang',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            34 => 
            array (
                'id' => '80ca44a2-9bfc-448a-9b43-ca3d741fa868',
                'name' => 'Nghệ An',
                'created_at' => '2021-09-23 16:19:03',
                'updated_at' => '2021-09-23 16:19:03',
            ),
            35 => 
            array (
                'id' => '8c1436f7-2d32-4784-afd8-70d331936e5a',
                'name' => 'Tây Ninh',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            36 => 
            array (
                'id' => '90bbe443-069a-4354-8e96-8fcb1c2870bf',
                'name' => 'Vĩnh Phúc',
                'created_at' => '2021-09-23 16:17:52',
                'updated_at' => '2021-09-23 16:17:52',
            ),
            37 => 
            array (
                'id' => '9104b60d-125b-45de-8f0c-e14893ef5ee3',
                'name' => 'Kiên Giang',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            38 => 
            array (
                'id' => '9d68ecc4-0cce-419e-baa8-9f4b320fc3da',
                'name' => 'Vĩnh Long',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            39 => 
            array (
                'id' => 'a3e0801f-502d-4b6e-bc7e-20f616ac3931',
                'name' => 'Long An',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            40 => 
            array (
                'id' => 'a4d945b8-b02d-41c1-880e-71ceb3168a9d',
                'name' => 'Đồng Nai',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            41 => 
            array (
                'id' => 'b01fa938-cffc-49b1-9e83-a337422f132e',
                'name' => 'Lâm Đồng',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            42 => 
            array (
                'id' => 'b1ebf48f-56b7-4882-bf16-9271c1b75196',
                'name' => 'Tuyên Quang',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            43 => 
            array (
                'id' => 'b577fbe5-2420-4ac7-9298-8a8bd04bc217',
                'name' => 'Thanh Hóa',
                'created_at' => '2021-09-23 16:17:54',
                'updated_at' => '2021-09-23 16:17:54',
            ),
            44 => 
            array (
                'id' => 'b720536f-26aa-41c5-b29c-e0dc9fad61ad',
                'name' => 'Bà Rịa - Vũng Tàu',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            45 => 
            array (
                'id' => 'bc4e7995-4afa-4f16-aa08-3a5c690d79b6',
                'name' => 'Quảng Ngãi',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            46 => 
            array (
                'id' => 'c03bc001-7700-4187-b7d2-1b14ca5b73ef',
                'name' => 'Bắc Kạn',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            47 => 
            array (
                'id' => 'c0e9071f-1445-479a-b658-7d312ed909fd',
                'name' => 'Đắk Lắk',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            48 => 
            array (
                'id' => 'cfe34498-401b-4f19-8565-486da5945f30',
                'name' => 'Bình Dương',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            49 => 
            array (
                'id' => 'd1d97f9b-ca69-415f-afcd-a3e4decd023e',
                'name' => 'Hà Giang',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            50 => 
            array (
                'id' => 'd37a60f8-a1b0-4152-8778-395791e523f6',
                'name' => 'Cà Mau',
                'created_at' => '2021-09-23 16:19:09',
                'updated_at' => '2021-09-23 16:19:09',
            ),
            51 => 
            array (
                'id' => 'd4dcf702-42a9-4068-8d9e-176d22279e32',
                'name' => 'Quảng Ninh',
                'created_at' => '2021-09-23 16:17:51',
                'updated_at' => '2021-09-23 16:17:51',
            ),
            52 => 
            array (
                'id' => 'da297b82-b4de-4c8d-a252-b2df97fa8be7',
                'name' => 'Cao Bằng',
                'created_at' => '2021-09-23 16:17:49',
                'updated_at' => '2021-09-23 16:17:49',
            ),
            53 => 
            array (
                'id' => 'e30bfd9c-0668-4860-b065-455cae47d328',
                'name' => 'Hồ Chí Minh',
                'created_at' => '2021-09-23 16:19:07',
                'updated_at' => '2021-09-23 16:19:07',
            ),
            54 => 
            array (
                'id' => 'e51deafd-86b7-493d-a035-b369ed6e5b5f',
                'name' => 'Quảng Nam',
                'created_at' => '2021-09-23 16:19:04',
                'updated_at' => '2021-09-23 16:19:04',
            ),
            55 => 
            array (
                'id' => 'eb0bef04-0188-44f2-8f7b-60152624e033',
                'name' => 'Ninh Bình',
                'created_at' => '2021-09-23 16:17:53',
                'updated_at' => '2021-09-23 16:17:53',
            ),
            56 => 
            array (
                'id' => 'efc143a2-35ac-4f33-9934-5d9177bcb7e1',
                'name' => 'Yên Bái',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            57 => 
            array (
                'id' => 'f05ae9d8-a765-482b-90cf-2ba6434ee185',
                'name' => 'Hòa Bình',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            58 => 
            array (
                'id' => 'f1282eac-a136-42f4-a1ad-76096405ba95',
                'name' => 'Bình Phước',
                'created_at' => '2021-09-23 16:19:06',
                'updated_at' => '2021-09-23 16:19:06',
            ),
            59 => 
            array (
                'id' => 'f6275b3f-09de-44b3-87a2-b9cec4ae89c8',
                'name' => 'Trà Vinh',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            60 => 
            array (
                'id' => 'f69c204f-2c46-44dc-a932-12d7cec3a669',
                'name' => 'Lai Châu',
                'created_at' => '2021-09-23 16:17:50',
                'updated_at' => '2021-09-23 16:17:50',
            ),
            61 => 
            array (
                'id' => 'fb0e6f30-8a60-44f2-85b9-4c3c13c14220',
                'name' => 'An Giang',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
            62 => 
            array (
                'id' => 'fef45e17-2058-4cb8-ac6d-51f4d082b088',
                'name' => 'Đồng Tháp',
                'created_at' => '2021-09-23 16:19:08',
                'updated_at' => '2021-09-23 16:19:08',
            ),
        ));
        
        
    }
}