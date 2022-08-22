<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ProvincesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('provinces')->delete();
        
        \DB::table('provinces')->insert(array (
            0 => 
            array (
                'id' => '9ce4d4af-1c39-4df6-9b44-5cd2f07d4776',
                'code' => '01',
                'name' => 'Thành phố Hà Nội',
                'rank' => 'Thành phố Trung ương',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            1 => 
            array (
                'id' => 'c1734588-1a77-48a6-a13d-7056c3fa4acd',
                'code' => '79',
                'name' => 'Thành phố Hồ Chí Minh',
                'rank' => 'Thành phố Trung ương',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            2 => 
            array (
                'id' => '8b6fc2d0-2407-4499-93f0-7f8d1bb9fa6f',
                'code' => '48',
                'name' => 'Thành phố Đà Nẵng',
                'rank' => 'Thành phố Trung ương',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            3 => 
            array (
                'id' => '40c6997e-0c90-45c9-b35a-6336c94e563e',
                'code' => '31',
                'name' => 'Thành phố Hải Phòng',
                'rank' => 'Thành phố Trung ương',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            4 => 
            array (
                'id' => 'b3b3d756-a488-4a6c-86bc-4b98ae308a86',
                'code' => '92',
                'name' => 'Thành phố Cần Thơ',
                'rank' => 'Thành phố Trung ương',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            5 => 
            array (
                'id' => '66ee9311-daa9-4526-9307-f4280f0d5a8c',
                'code' => '89',
                'name' => 'An Giang',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            6 => 
            array (
                'id' => '16ac6e25-7813-44da-873f-5660a3b23aac',
                'code' => '77',
                'name' => 'Bà Rịa - Vũng Tàu',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            7 => 
            array (
                'id' => '8cc3e89b-d110-4365-90e9-c11b55b9af34',
                'code' => '95',
                'name' => 'Bạc Liêu',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            8 => 
            array (
                'id' => '06cae2bd-3d32-4931-a01b-2b4f4bb46a1a',
                'code' => '06',
                'name' => 'Bắc Kạn',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            9 => 
            array (
                'id' => 'dde9f1ad-24bc-48be-8da5-3f565b5d52ca',
                'code' => '24',
                'name' => 'Bắc Giang',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            10 => 
            array (
                'id' => 'caa789e8-5782-41cc-b349-b78f6ca0b88e',
                'code' => '27',
                'name' => 'Bắc Ninh',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            11 => 
            array (
                'id' => '85c1d43a-7f21-428c-95a6-286843a425ca',
                'code' => '83',
                'name' => 'Bến Tre',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            12 => 
            array (
                'id' => '32c34afb-a61c-4d6e-80d4-8b37763e5ccc',
                'code' => '74',
                'name' => 'Bình Dương',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            13 => 
            array (
                'id' => '9ca29f6d-3ee2-4863-847f-88125bfb4453',
                'code' => '52',
                'name' => 'Bình Định',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            14 => 
            array (
                'id' => 'fba45bf1-8833-47c7-8f10-523c7bba777a',
                'code' => '70',
                'name' => 'Bình Phước',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            15 => 
            array (
                'id' => 'ceeb9197-bebd-4d79-89c5-9d1a4e5662f6',
                'code' => '60',
                'name' => 'Bình Thuận',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            16 => 
            array (
                'id' => '4b398bb1-ff9f-49fb-9794-6411cbb45473',
                'code' => '96',
                'name' => 'Cà Mau',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            17 => 
            array (
                'id' => '5cc4a223-9890-4d8e-bd30-a4ee941d1ede',
                'code' => '04',
                'name' => 'Cao Bằng',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            18 => 
            array (
                'id' => 'c8964b7e-a42c-41af-b776-cc652c62a649',
                'code' => '66',
                'name' => 'Đắc Lắk',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            19 => 
            array (
                'id' => '8009c388-3bcd-4a44-aa56-a7c6d96194a8',
                'code' => '67',
                'name' => 'Đắc Nông',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            20 => 
            array (
                'id' => 'e7d99377-a7bd-4b42-a9da-01f51693a935',
                'code' => '75',
                'name' => 'Đồng Nai',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            21 => 
            array (
                'id' => '12b5fe73-3dd3-4f1c-b71b-9563744fec7d',
                'code' => '87',
                'name' => 'Đồng Tháp',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            22 => 
            array (
                'id' => '25213900-4103-4d64-a65e-78db7f8faa6d',
                'code' => '11',
                'name' => 'Điện Biên',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            23 => 
            array (
                'id' => 'f1a0f0e8-3053-4dae-b229-5b2295725d3c',
                'code' => '64',
                'name' => 'Gia Lai',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            24 => 
            array (
                'id' => '5a9ef602-5285-4e9b-a2df-299094946433',
                'code' => '02',
                'name' => 'Hà Giang',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            25 => 
            array (
                'id' => '1c1ff33c-20de-4975-b213-fe61ea6ada71',
                'code' => '35',
                'name' => 'Hà Nam',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            26 => 
            array (
                'id' => '02f8bca5-7b16-41e2-bc2d-df1c58e87f6a',
                'code' => '42',
                'name' => 'Hà Tĩnh',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            27 => 
            array (
                'id' => '8920ea56-1a29-4f0d-ad9d-0c40e8eb815e',
                'code' => '30',
                'name' => 'Hải Dương',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            28 => 
            array (
                'id' => '8edb089a-0fb2-43fb-9a32-bca23929f293',
                'code' => '17',
                'name' => 'Hoà Bình',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            29 => 
            array (
                'id' => '922e3dbb-b50b-4435-8348-2d9c4eefa697',
                'code' => '93',
                'name' => 'Hậu Giang',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            30 => 
            array (
                'id' => '27db5f44-5ee5-4b5a-aaf1-6b7dd3c8913b',
                'code' => '33',
                'name' => 'Hưng Yên',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            31 => 
            array (
                'id' => '14545869-ab4b-49a7-93a5-8bcfa575a282',
                'code' => '56',
                'name' => 'Khánh Hoà',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            32 => 
            array (
                'id' => 'bb10c0c1-7fea-491a-8d21-7ab5503b6919',
                'code' => '91',
                'name' => 'Kiên Giang',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            33 => 
            array (
                'id' => '83b644f4-f9e0-4474-8bd8-354a2429b1a3',
                'code' => '62',
                'name' => 'Kon Tum',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            34 => 
            array (
                'id' => '1e9cee6d-c628-4e58-8b1a-1eae223c157a',
                'code' => '12',
                'name' => 'Lai Châu',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            35 => 
            array (
                'id' => '7d80f848-1a07-4d53-9357-a17eef4dca16',
                'code' => '10',
                'name' => 'Lào Cai',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            36 => 
            array (
                'id' => '6e8b8d0d-c675-4962-837d-3fb8804eef4d',
                'code' => '20',
                'name' => 'Lạng Sơn',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            37 => 
            array (
                'id' => 'db57304a-a40e-4faf-ae8e-45982b54c80e',
                'code' => '68',
                'name' => 'Lâm Đồng',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            38 => 
            array (
                'id' => 'f9f395c4-4230-45cc-9422-2af3f4bedda8',
                'code' => '80',
                'name' => 'Long An',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            39 => 
            array (
                'id' => 'b0fc3f2c-57a5-479b-b881-ddd9e3e02e6c',
                'code' => '36',
                'name' => 'Nam Định',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            40 => 
            array (
                'id' => '8c57567b-4043-4a45-a835-a27b99c186a0',
                'code' => '40',
                'name' => 'Nghệ An',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            41 => 
            array (
                'id' => '6200d5d3-626b-4404-8511-effa3e7149f7',
                'code' => '37',
                'name' => 'Ninh Bình',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            42 => 
            array (
                'id' => '677b1318-d880-424c-90cf-39f6c712988b',
                'code' => '58',
                'name' => 'Ninh Thuận',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            43 => 
            array (
                'id' => 'b338d60c-596f-4735-a1d9-723e9cff67cb',
                'code' => '25',
                'name' => 'Phú Thọ',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            44 => 
            array (
                'id' => 'ccc8c213-df71-4fd9-8c52-5ba166058ec3',
                'code' => '54',
                'name' => 'Phú Yên',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            45 => 
            array (
                'id' => '5ce44c1a-b96c-4ed1-aa50-b0c9c2bd44d5',
                'code' => '44',
                'name' => 'Quảng Bình',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            46 => 
            array (
                'id' => 'e69119ca-5f50-4cea-ab8e-f16265f823c5',
                'code' => '49',
                'name' => 'Quảng Nam',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            47 => 
            array (
                'id' => 'd0f20cd1-3f36-4ee2-960b-b5a47ec15193',
                'code' => '51',
                'name' => 'Quảng Ngãi',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            48 => 
            array (
                'id' => 'a50390b1-2aa7-451b-9d63-a81334ee4aea',
                'code' => '22',
                'name' => 'Quảng Ninh',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            49 => 
            array (
                'id' => '73610688-06f9-48ab-91f5-d96e409ce7ea',
                'code' => '45',
                'name' => 'Quảng Trị',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            50 => 
            array (
                'id' => '110f25d5-1995-4c57-b3c9-7038cb962870',
                'code' => '94',
                'name' => 'Sóc Trăng',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            51 => 
            array (
                'id' => '672ccf42-3d5e-4691-bc96-e7d11604142a',
                'code' => '14',
                'name' => 'Sơn La',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            52 => 
            array (
                'id' => '3494ed39-0c8d-41f5-9161-c61ce759e7aa',
                'code' => '72',
                'name' => 'Tây Ninh',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            53 => 
            array (
                'id' => '4d577fca-664b-4de8-b087-c1ea9baaf3ff',
                'code' => '34',
                'name' => 'Thái Bình',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            54 => 
            array (
                'id' => '71c981f9-de5c-433f-a770-fcd210ecd8c5',
                'code' => '19',
                'name' => 'Thái Nguyên',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            55 => 
            array (
                'id' => 'eb005cee-de22-43bc-a029-85ccb0d37e11',
                'code' => '38',
                'name' => 'Thanh Hoá',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            56 => 
            array (
                'id' => '43254515-bea7-478c-bff1-f33d987fd5ec',
                'code' => '46',
                'name' => 'Thừa Thiên - Huế',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            57 => 
            array (
                'id' => 'c7857af4-267d-453d-8c98-7737c373028b',
                'code' => '82',
                'name' => 'Tiền Giang',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            58 => 
            array (
                'id' => '8f612d55-bfb9-4c75-af6a-84dc18a588f8',
                'code' => '84',
                'name' => 'Trà Vinh',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            59 => 
            array (
                'id' => '437f1dbd-35cd-4d26-b806-2bbe7de59eb6',
                'code' => '08',
                'name' => 'Tuyên Quang',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            60 => 
            array (
                'id' => 'f986a9a1-d26d-4213-bb53-9a6322a21113',
                'code' => '86',
                'name' => 'Vĩnh Long',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            61 => 
            array (
                'id' => 'a187a9c8-8688-4dc6-b382-a63272825c87',
                'code' => '26',
                'name' => 'Vĩnh Phúc',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
            62 => 
            array (
                'id' => '67d28f5a-d70e-4851-8477-ee810560d336',
                'code' => '15',
                'name' => 'Yên Bái',
                'rank' => 'Tỉnh',
                'created_at' => '2021-11-19 10:46:01',
                'updated_at' => '2021-11-19 10:46:01',
                'deleted_at' => NULL,
            ),
        ));
        
        
    }
}