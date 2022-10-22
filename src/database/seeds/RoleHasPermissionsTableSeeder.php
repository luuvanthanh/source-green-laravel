<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class RoleHasPermissionsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('role_has_permissions')->delete();
        
        \DB::table('role_has_permissions')->insert(array (
            0 => 
            array (
                'permission_id' => '6df80dc3-950b-4f2b-8218-03bd6b3c8cbe',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            1 => 
            array (
                'permission_id' => '1b04a69d-64e4-4225-a706-90a3a2ee0995',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            2 => 
            array (
                'permission_id' => '09956385-0239-4a96-97ff-d05edd70dbf8',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            3 => 
            array (
                'permission_id' => '3e037837-af15-4881-a74d-6c8943294565',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            4 => 
            array (
                'permission_id' => '64bca16a-9e2f-47df-8e2e-7d5b34ea9506',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            5 => 
            array (
                'permission_id' => 'ed7ef474-754d-4b88-b651-c33da3d24999',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            6 => 
            array (
                'permission_id' => 'd7d67428-7384-45d6-8d02-8148efde0c7f',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            7 => 
            array (
                'permission_id' => '56b16e38-6bd9-4286-8993-13e4b8ad3f14',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            8 => 
            array (
                'permission_id' => '7fe27cc1-dabb-4074-8ff6-2830c693036c',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            9 => 
            array (
                'permission_id' => 'bfd1e50d-9400-42b3-aeb8-15df12db20df',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            10 => 
            array (
                'permission_id' => 'ff0a98f3-13bc-49ee-95b7-192841e9d83b',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            11 => 
            array (
                'permission_id' => 'aa43b59b-387d-46cf-a9c2-8d00d09ca1e6',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            12 => 
            array (
                'permission_id' => '5498e202-fbc7-468c-851a-18c9a07e1677',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            13 => 
            array (
                'permission_id' => '07d5876b-881f-469c-9b17-6427f2e7a9db',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            14 => 
            array (
                'permission_id' => '7e4df066-a1bc-47d0-b028-caaf16243a5c',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            15 => 
            array (
                'permission_id' => 'b1d686c7-f697-4d0a-8774-46d46483d13f',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            16 => 
            array (
                'permission_id' => '4e569566-acab-4923-9868-a3363140efd3',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            17 => 
            array (
                'permission_id' => 'cacfb042-0a9a-4ed6-bf0c-458e6c1c6917',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            18 => 
            array (
                'permission_id' => '2c1e61cb-7c9d-47a7-be78-6b949ea85cf7',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            19 => 
            array (
                'permission_id' => 'aa80b737-0b7c-43b0-bb63-c9dbe37bc58a',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            20 => 
            array (
                'permission_id' => '47d686eb-c750-47bb-8444-77faef5848e0',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            21 => 
            array (
                'permission_id' => 'e5cfd3b8-a596-4c0c-9c6f-cac624caa008',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            22 => 
            array (
                'permission_id' => 'e94d874b-8d59-49ff-bddb-c48e303f470e',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            23 => 
            array (
                'permission_id' => 'cf22381d-2a7f-45a0-bcc3-99de77296fe3',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            24 => 
            array (
                'permission_id' => '32f68cd9-0de8-4fb9-9d5f-30b92d1edf7d',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            25 => 
            array (
                'permission_id' => 'e903f3a8-a1f9-4287-bdb4-ac84812b210a',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            26 => 
            array (
                'permission_id' => '7880bf10-324e-4a22-a60e-d625f520d1b3',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            27 => 
            array (
                'permission_id' => '43621634-b057-4666-b7ea-9e0a185114aa',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            28 => 
            array (
                'permission_id' => 'cce21205-ec97-412f-b4b2-c701aecc38af',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            29 => 
            array (
                'permission_id' => 'd077c737-48b4-4c33-bd56-9b10b800bebd',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            30 => 
            array (
                'permission_id' => '13bb9958-67de-4253-8c6b-04979bd159c1',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            31 => 
            array (
                'permission_id' => '3f62b059-6828-4318-8d05-ab3f7c242f43',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            32 => 
            array (
                'permission_id' => 'e0bb7bc2-e038-4ce1-b3c8-c67a32d4cd56',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            33 => 
            array (
                'permission_id' => 'b563ce08-a8f9-4c6a-9bfd-c0bf93ce7616',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            34 => 
            array (
                'permission_id' => '1e1bcec8-d856-41cd-8227-b30049d149d1',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            35 => 
            array (
                'permission_id' => 'a84eeb2b-3b16-4805-a40b-2944a29ca9c5',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            36 => 
            array (
                'permission_id' => 'cfeb5700-93d6-4c23-b1d7-3763637f926f',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            37 => 
            array (
                'permission_id' => 'ec74056e-04eb-42fd-b72f-ab86d8ad291c',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            38 => 
            array (
                'permission_id' => '19ea1926-f8e6-4826-96f9-a553d4e2f2f4',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            39 => 
            array (
                'permission_id' => 'da79e8b1-7c35-49ca-a0bd-bc06066daba8',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            40 => 
            array (
                'permission_id' => '44bee464-1dd5-4f9d-833d-c52000243138',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            41 => 
            array (
                'permission_id' => '370b35e0-6cb0-4119-b27e-100843003ac6',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            42 => 
            array (
                'permission_id' => '9ecd0284-b94c-40a5-96e7-b255ec440d80',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            43 => 
            array (
                'permission_id' => '81fc496b-1858-47dd-bfc5-549bf360cd9d',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            44 => 
            array (
                'permission_id' => 'a218543e-6f87-4ca7-8691-e88ef9eb9129',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            45 => 
            array (
                'permission_id' => '2918be34-59d5-481e-a8ed-dc648e263a38',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            46 => 
            array (
                'permission_id' => 'fa7a61c7-734d-40b0-b098-50aad97b67bf',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            47 => 
            array (
                'permission_id' => 'b4b808a4-4d5b-4f67-885a-10eb5b97383f',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            48 => 
            array (
                'permission_id' => 'ad74b8de-a78f-4c97-8246-5fcaac6ffecd',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            49 => 
            array (
                'permission_id' => '746733a3-3445-49f5-ad29-c22042d0c2d9',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            50 => 
            array (
                'permission_id' => 'fc6c1fb6-c302-47ec-a239-d67581dba5dd',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            51 => 
            array (
                'permission_id' => 'be889db1-02ec-43b2-9798-45c53cbb7b23',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            52 => 
            array (
                'permission_id' => 'f60f7178-9b48-48ba-ba8f-58de3893c442',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            53 => 
            array (
                'permission_id' => 'f2db2616-1bd1-4117-a512-653e8b14db58',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            54 => 
            array (
                'permission_id' => '99e72460-e3f2-43ef-a1a2-57627a7c4245',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            55 => 
            array (
                'permission_id' => 'bcdaadd3-25fb-46e7-bb71-b1a7bbdaf2a3',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            56 => 
            array (
                'permission_id' => 'b12e2918-7178-45a0-b60e-ab2e9f78ba04',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            57 => 
            array (
                'permission_id' => '2a222e5d-b66b-4ed4-8ae5-db5605fd4d1c',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            58 => 
            array (
                'permission_id' => '3a82b2d7-90dd-4879-9ebf-86149d0aff1b',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            59 => 
            array (
                'permission_id' => 'b35825e2-55e6-4b3e-b0f9-e121c51e3c35',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            60 => 
            array (
                'permission_id' => 'b83dc944-6f61-44f7-9b0f-321ec5854418',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            61 => 
            array (
                'permission_id' => '93f66686-dd79-47a1-b884-9af778cd108d',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            62 => 
            array (
                'permission_id' => '0d86210f-8f0a-4370-92f3-8ad88a0bfb38',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            63 => 
            array (
                'permission_id' => '58c6e4fc-3f64-4acc-926d-79a868989dd3',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            64 => 
            array (
                'permission_id' => '935d791e-cb11-4ea7-aba2-1758df77050d',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            65 => 
            array (
                'permission_id' => 'd85895c4-4d8e-4144-9576-978d2b6e1943',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            66 => 
            array (
                'permission_id' => 'ac5f8512-7377-4821-9ca2-a18a4d6d467f',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            67 => 
            array (
                'permission_id' => 'b1ef24f8-320e-4802-9168-0f04110ec6b4',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            68 => 
            array (
                'permission_id' => '26047e45-901f-424f-8100-a1306a1a2452',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            69 => 
            array (
                'permission_id' => '9004f90c-c041-46d9-a768-d25b1f6df0da',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            70 => 
            array (
                'permission_id' => '1442d74d-d676-40a5-a091-b05af8d0e9d1',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            71 => 
            array (
                'permission_id' => '71638e5e-9c43-4c14-a40d-b10a29902fee',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            72 => 
            array (
                'permission_id' => '53a79b5c-a3ba-42da-be02-f1c03c36ea3b',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            73 => 
            array (
                'permission_id' => '6ad72af7-3f1f-442a-be8f-360f30485fc2',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            74 => 
            array (
                'permission_id' => '53c140cd-0d84-4f0f-af33-cc8bbaad514b',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            75 => 
            array (
                'permission_id' => '3946804f-48fc-432e-8fc6-76c474d4d4d1',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            76 => 
            array (
                'permission_id' => 'ce82ca95-3288-49d9-b57b-5f62b50d6444',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            77 => 
            array (
                'permission_id' => 'c710f47a-fcf8-42f9-9557-d86034c5e044',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            78 => 
            array (
                'permission_id' => '21b3a115-0344-478b-b4fe-e4a84637ab50',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            79 => 
            array (
                'permission_id' => '0b7b40ff-0371-4e6e-bd9c-426bbedb413c',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            80 => 
            array (
                'permission_id' => 'd4869b96-cc92-41b5-acae-806d37186040',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            81 => 
            array (
                'permission_id' => 'd8756b17-b0b2-43df-a01d-6c02f7441929',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            82 => 
            array (
                'permission_id' => '9af4e3cc-2079-40ba-a73e-ede3850e2766',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            83 => 
            array (
                'permission_id' => '53704a40-155e-4fbf-acef-4ba3fe75f73c',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            84 => 
            array (
                'permission_id' => '08bb5c3d-5296-4db1-94ad-5e9bb81cf37b',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            85 => 
            array (
                'permission_id' => 'c671a56a-1012-40c9-bfc0-4f20d27f0f55',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            86 => 
            array (
                'permission_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            87 => 
            array (
                'permission_id' => '9fb8242f-7604-4399-a155-7475dc69a834',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            88 => 
            array (
                'permission_id' => 'bd3d1f3a-f7f0-4902-8c60-19fca358e6ea',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
            89 => 
            array (
                'permission_id' => 'b529b9ca-4826-48c2-b737-34f1f6cfacca',
                'role_id' => '9f921779-46b0-4e46-898d-feffe8958e7c',
            ),
        ));
        
        
    }
}