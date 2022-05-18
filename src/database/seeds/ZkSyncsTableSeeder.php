<?php

use Illuminate\Database\Seeder;

class ZkSyncsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('ZkSyncs')->delete();
        
        \DB::table('ZkSyncs')->insert(array (
            0 => 
            array (
                'id' => 1,
                'SubjectType' => 'GGPHP\\Users\\Models\\User',
                'Action' => 'created',
                'SubjectId' => '9b1e5e80-7f00-4478-8ec9-10793ad202a4',
                'Payload' => '{"Address":"\\u0110\\u00e0 N\\u1eb5ng","Code":"dangnv","DateOfBirth":"1999-09-20T00:00:00+00:00","DateOfIssueIdCard":"2022-02-10T00:00:00+00:00","DegreeId":"978be04d-5dbc-41b8-96a5-c07da638f125","Email":"dangnv@greenglobal.vn","FileImage":"[\\"\\/file-storage\\/2022\\/02\\/20220225\\/3a0241f3-ba48-d8a7-6079-e2a7bba80f04.jpeg\\"]","FullName":"Nguy\\u1ec5n V\\u0103n \\u0110\\u00e1ng","Gender":"MALE","IdCard":"525252552","Married":false,"Nation":"Kinh","Nationality":"Vi\\u1ec7t Nam","PermanentAddress":"Qu\\u1ea3ng Nam","PhoneNumber":"0823573189","PlaceOfBirth":"Qu\\u1ea3ng Nam","PlaceOfIssueIdCard":"Qu\\u1ea3ng Nam","Religion":"kh\\u00f4ng","Status":0,"TaxCode":"52525","Category":0,"TrainingMajorId":"610e7e68-ae32-4b44-98b0-d7bc92dd1c98","TrainingSchoolId":"f2c7d6b2-48cd-49f4-bb20-b3f9dc52c71a","Id":"9b1e5e80-7f00-4478-8ec9-10793ad202a4","LastModificationTime":"2022-03-23T03:37:14+00:00","CreationTime":"2022-03-23T03:37:14+00:00"}',
                'CreationTime' => '2022-03-23 03:37:14',
                'LastModificationTime' => '2022-03-23 03:37:14',
                'DeletionTime' => NULL,
            ),
            1 => 
            array (
                'id' => 2,
                'SubjectType' => 'GGPHP\\Users\\Models\\User',
                'Action' => 'updated',
                'SubjectId' => '9b1e5e80-7f00-4478-8ec9-10793ad202a4',
                'Payload' => '{"FingerprintId":1,"Id":"9b1e5e80-7f00-4478-8ec9-10793ad202a4","FullName":"H\\u1ed3 Th\\u1ecb M\\u1ef9 Duy\\u00ean","DateOfBirth":"1999-09-20T00:00:00+00:00","PlaceOfBirth":"Qu\\u1ea3ng Nam","Email":"dangnv@greenglobal.vn","PhoneNumber":"0823573189","Code":"nv001","PermanentAddress":"Qu\\u1ea3ng Nam","Nationality":"Vi\\u1ec7t Nam","Nation":"Kinh","IdCard":"525252552","DateOfIssueIdCard":"2022-02-10T00:00:00+00:00","PlaceOfIssueIdCard":"Qu\\u1ea3ng Nam","Religion":"kh\\u00f4ng","Gender":"MALE","TaxCode":"52525","TrainingSchoolId":"f2c7d6b2-48cd-49f4-bb20-b3f9dc52c71a","DateOff":null,"Address":"\\u0110\\u00e0 N\\u1eb5ng","EducationalLevelId":null,"WorkDate":null,"HealthInsuranceBookNumber":null,"HospitalAddress":null,"SocialInsuranceBooknumber":null,"BankName":null,"BankNumberOfAccount":null,"Note":null,"MaternityLeave":false,"MaternityLeaveFrom":null,"MaternityLeaveTo":null,"Status":0,"Category":0,"FileImage":"[\\"\\/file-storage\\/2022\\/02\\/20220225\\/3a0241f3-ba48-d8a7-6079-e2a7bba80f04.jpeg\\"]","Married":false,"EmployeeIdCrm":null,"Description":null,"DegreeId":"978be04d-5dbc-41b8-96a5-c07da638f125","TrainingMajorId":"610e7e68-ae32-4b44-98b0-d7bc92dd1c98","CreationTime":"2022-03-23T03:37:14+00:00","LastModificationTime":"2022-03-28T09:19:04+00:00","DeletionTime":null}',
                'CreationTime' => '2022-03-28 09:19:04',
                'LastModificationTime' => '2022-03-28 09:19:04',
                'DeletionTime' => NULL,
            ),
            2 => 
            array (
                'id' => 3,
                'SubjectType' => 'GGPHP\\Users\\Models\\User',
                'Action' => 'updated',
                'SubjectId' => '9b1e5e80-7f00-4478-8ec9-10793ad202a4',
                'Payload' => '{"FingerprintId":1,"Id":"9b1e5e80-7f00-4478-8ec9-10793ad202a4","FullName":"H\\u1ed3 Th\\u1ecb M\\u1ef9 Duy\\u00ean","DateOfBirth":"1999-09-20T00:00:00+00:00","PlaceOfBirth":"Qu\\u1ea3ng Nam","Email":"dangnv@greenglobal.vn","PhoneNumber":"0823573189","Code":"NV001","PermanentAddress":"Qu\\u1ea3ng Nam","Nationality":"Vi\\u1ec7t Nam","Nation":"Kinh","IdCard":"525252552","DateOfIssueIdCard":"2022-02-10T00:00:00+00:00","PlaceOfIssueIdCard":"Qu\\u1ea3ng Nam","Religion":"kh\\u00f4ng","Gender":"MALE","TaxCode":"52525","TrainingSchoolId":"f2c7d6b2-48cd-49f4-bb20-b3f9dc52c71a","DateOff":null,"Address":"\\u0110\\u00e0 N\\u1eb5ng","EducationalLevelId":null,"WorkDate":null,"HealthInsuranceBookNumber":null,"HospitalAddress":null,"SocialInsuranceBooknumber":null,"BankName":null,"BankNumberOfAccount":null,"Note":null,"MaternityLeave":false,"MaternityLeaveFrom":null,"MaternityLeaveTo":null,"Status":0,"Category":0,"FileImage":"[\\"\\/file-storage\\/2022\\/02\\/20220225\\/3a0241f3-ba48-d8a7-6079-e2a7bba80f04.jpeg\\"]","Married":false,"EmployeeIdCrm":null,"Description":null,"DegreeId":"978be04d-5dbc-41b8-96a5-c07da638f125","TrainingMajorId":"610e7e68-ae32-4b44-98b0-d7bc92dd1c98","CreationTime":"2022-03-23T03:37:14+00:00","LastModificationTime":"2022-03-28T09:19:13+00:00","DeletionTime":null}',
                'CreationTime' => '2022-03-28 09:19:13',
                'LastModificationTime' => '2022-03-28 09:19:13',
                'DeletionTime' => NULL,
            ),
            3 => 
            array (
                'id' => 4,
                'SubjectType' => 'GGPHP\\Users\\Models\\User',
                'Action' => 'created',
                'SubjectId' => '21e460f7-351b-4f30-adce-7876cad3c572',
                'Payload' => '{"FullName":"Nguy\\u1ec5n H\\u1ea3i D\\u01b0\\u01a1ng","Code":"NV002","DateOfBirth":"2022-03-07T00:00:00+00:00","PhoneNumber":"0978555221","Email":"duong@arkki.vn","Gender":"MALE","IdCard":"205478256","DateOfIssueIdCard":"2022-03-08T00:00:00+00:00","PlaceOfIssueIdCard":"H\\u1ed3 Ch\\u00ed Minh","Married":false,"FileImage":"[\\"\\/file-storage\\/2022\\/02\\/20220225\\/3a0241f3-ba48-d8a7-6079-e2a7bba80f04.jpeg\\"]","Status":0,"Id":"21e460f7-351b-4f30-adce-7876cad3c572","LastModificationTime":"2022-03-28T09:20:42+00:00","CreationTime":"2022-03-28T09:20:42+00:00"}',
                'CreationTime' => '2022-03-28 09:20:42',
                'LastModificationTime' => '2022-03-28 09:20:42',
                'DeletionTime' => NULL,
            ),
            4 => 
            array (
                'id' => 5,
                'SubjectType' => 'GGPHP\\Users\\Models\\User',
                'Action' => 'created',
                'SubjectId' => '226c70aa-b385-4d21-9f6a-e9f0cd63a4a0',
                'Payload' => '{"FullName":"Nguy\\u1ec5n Tr\\u1ea7n Kh\\u00e1nh Ng\\u1ecdc","Code":"NV003","DateOfBirth":"2022-03-28T00:00:00+00:00","PhoneNumber":"0978555222","Email":"khanhngoc@arkki.vn","Gender":"MALE","IdCard":"205248635","DateOfIssueIdCard":"2022-03-28T00:00:00+00:00","PlaceOfIssueIdCard":"H\\u1ed3 Ch\\u00ed Minh","Married":false,"FileImage":"[\\"\\/file-storage\\/2022\\/02\\/20220225\\/3a0241f3-ba48-d8a7-6079-e2a7bba80f04.jpeg\\"]","Status":0,"Id":"226c70aa-b385-4d21-9f6a-e9f0cd63a4a0","LastModificationTime":"2022-03-28T09:21:34+00:00","CreationTime":"2022-03-28T09:21:34+00:00"}',
                'CreationTime' => '2022-03-28 09:21:34',
                'LastModificationTime' => '2022-03-28 09:21:34',
                'DeletionTime' => NULL,
            ),
            5 => 
            array (
                'id' => 6,
                'SubjectType' => 'GGPHP\\Users\\Models\\User',
                'Action' => 'created',
                'SubjectId' => '6846d859-deb4-43dc-9e0d-67a9b9e5a5f6',
                'Payload' => '{"FullName":"Nguy\\u1ec5n Thu\\u1ef3 Trang","Code":"NV004","DateOfBirth":"1993-03-07T00:00:00+00:00","PhoneNumber":"0978555224","Email":"thuytrang@arkki.vn","Gender":"FEMALE","IdCard":"205488263","DateOfIssueIdCard":"2020-03-29T00:00:00+00:00","PlaceOfIssueIdCard":"H\\u1ed3 Ch\\u00ed Minh","Married":false,"FileImage":"[\\"\\/file-storage\\/2022\\/02\\/20220225\\/3a0241f3-ba48-d8a7-6079-e2a7bba80f04.jpeg\\"]","Status":0,"Id":"6846d859-deb4-43dc-9e0d-67a9b9e5a5f6","LastModificationTime":"2022-03-29T03:32:17+00:00","CreationTime":"2022-03-29T03:32:17+00:00"}',
                'CreationTime' => '2022-03-29 03:32:17',
                'LastModificationTime' => '2022-03-29 03:32:17',
                'DeletionTime' => NULL,
            ),
            6 => 
            array (
                'id' => 7,
                'SubjectType' => 'GGPHP\\Users\\Models\\User',
                'Action' => 'updated',
                'SubjectId' => '6846d859-deb4-43dc-9e0d-67a9b9e5a5f6',
                'Payload' => '{"FingerprintId":4,"Id":"6846d859-deb4-43dc-9e0d-67a9b9e5a5f6","FullName":"Nguy\\u1ec5n Thu\\u1ef3 Trang","DateOfBirth":"1993-03-07T00:00:00+00:00","PlaceOfBirth":null,"Email":"thuytrang@arkki.vn","PhoneNumber":"0978555224","Code":"NV004","PermanentAddress":null,"Nationality":null,"Nation":null,"IdCard":"205488263","DateOfIssueIdCard":"2020-03-29T00:00:00+00:00","PlaceOfIssueIdCard":"H\\u1ed3 Ch\\u00ed Minh","Religion":null,"Gender":"FEMALE","TaxCode":null,"TrainingSchoolId":"f2c7d6b2-48cd-49f4-bb20-b3f9dc52c71a","DateOff":null,"Address":null,"EducationalLevelId":null,"WorkDate":null,"HealthInsuranceBookNumber":null,"HospitalAddress":null,"SocialInsuranceBooknumber":null,"BankName":null,"BankNumberOfAccount":null,"Note":null,"MaternityLeave":false,"MaternityLeaveFrom":null,"MaternityLeaveTo":null,"Status":0,"Category":0,"FileImage":"[\\"\\/file-storage\\/2022\\/02\\/20220225\\/3a0241f3-ba48-d8a7-6079-e2a7bba80f04.jpeg\\"]","Married":false,"EmployeeIdCrm":null,"Description":null,"DegreeId":"f046c0a8-f80d-44e8-b198-3e8f07854e64","TrainingMajorId":"610e7e68-ae32-4b44-98b0-d7bc92dd1c98","CreationTime":"2022-03-29T03:32:17+00:00","LastModificationTime":"2022-03-29T03:32:38+00:00","DeletionTime":null}',
                'CreationTime' => '2022-03-29 03:32:38',
                'LastModificationTime' => '2022-03-29 03:32:38',
                'DeletionTime' => NULL,
            ),
            7 => 
            array (
                'id' => 8,
                'SubjectType' => 'GGPHP\\Users\\Models\\User',
                'Action' => 'created',
                'SubjectId' => 'b205917d-dd2a-41a4-9c4c-d68e6d76552a',
                'Payload' => '{"FullName":"\\u0110\\u1ed5ng Ng\\u1ecdc Di\\u1ec7p Th\\u1ea3o","Code":"NV005","DateOfBirth":"2022-03-28T00:00:00+00:00","PhoneNumber":"0978555226","Email":"diepthao@arkki.vn","Gender":"MALE","IdCard":"0979099078","DateOfIssueIdCard":"2022-03-28T00:00:00+00:00","PlaceOfIssueIdCard":"H\\u1ed3 Ch\\u00ed Minh","FileImage":"[\\"\\/file-storage\\/2022\\/02\\/20220225\\/3a0241f3-ba48-d8a7-6079-e2a7bba80f04.jpeg\\"]","Status":0,"Id":"b205917d-dd2a-41a4-9c4c-d68e6d76552a","LastModificationTime":"2022-03-29T03:40:45+00:00","CreationTime":"2022-03-29T03:40:45+00:00"}',
                'CreationTime' => '2022-03-29 03:40:45',
                'LastModificationTime' => '2022-03-29 03:40:45',
                'DeletionTime' => NULL,
            ),
            8 => 
            array (
                'id' => 9,
                'SubjectType' => 'GGPHP\\Users\\Models\\User',
                'Action' => 'created',
                'SubjectId' => 'fba95caf-5e37-49cc-a5f8-46490e2e00e3',
                'Payload' => '{"FullName":"L\\u00e2m \\u0110\\u1ee9c Tr\\u1ecdng","Code":"NV006","DateOfBirth":"1993-03-14T00:00:00+00:00","PhoneNumber":"0978555228","Email":"ductrong@arkki.vn","Gender":"MALE","IdCard":"205485263","DateOfIssueIdCard":"2022-03-07T00:00:00+00:00","PlaceOfIssueIdCard":"H\\u1ed3 Ch\\u00ed Minh","FileImage":"[\\"\\/file-storage\\/2022\\/02\\/20220225\\/3a0241f3-ba48-d8a7-6079-e2a7bba80f04.jpeg\\"]","Status":0,"Id":"fba95caf-5e37-49cc-a5f8-46490e2e00e3","LastModificationTime":"2022-03-29T03:41:40+00:00","CreationTime":"2022-03-29T03:41:40+00:00"}',
                'CreationTime' => '2022-03-29 03:41:40',
                'LastModificationTime' => '2022-03-29 03:41:40',
                'DeletionTime' => NULL,
            ),
            9 => 
            array (
                'id' => 10,
                'SubjectType' => 'GGPHP\\Users\\Models\\User',
                'Action' => 'created',
                'SubjectId' => 'c288ca21-0dce-4931-a49e-07b2ed512e10',
                'Payload' => '{"FullName":"Tr\\u01b0\\u01a1ng Hu\\u1ef3nh Nguy\\u00ean H\\u00e2n","Code":"NV008","DateOfBirth":"1993-03-28T00:00:00+00:00","PhoneNumber":"0978555215","Email":"hannguyen@arkki.vn","Gender":"MALE","IdCard":"0979099077","DateOfIssueIdCard":"1993-03-28T00:00:00+00:00","PlaceOfIssueIdCard":"H\\u1ed3 Ch\\u00ed Minh","FileImage":"[\\"\\/file-storage\\/2022\\/02\\/20220225\\/3a0241f3-ba48-d8a7-6079-e2a7bba80f04.jpeg\\"]","Status":0,"Id":"c288ca21-0dce-4931-a49e-07b2ed512e10","LastModificationTime":"2022-03-29T03:48:23+00:00","CreationTime":"2022-03-29T03:48:23+00:00"}',
                'CreationTime' => '2022-03-29 03:48:23',
                'LastModificationTime' => '2022-03-29 03:48:23',
                'DeletionTime' => NULL,
            ),
            10 => 
            array (
                'id' => 11,
                'SubjectType' => 'GGPHP\\Users\\Models\\User',
                'Action' => 'created',
                'SubjectId' => '93bbe4a6-ddcf-4a7e-b7d9-88fff8c95d43',
                'Payload' => '{"FullName":"Nguy\\u1ec5n Th\\u1ecb Thanh Th\\u1ea3o","Code":"NV009","DateOfBirth":"1993-03-14T00:00:00+00:00","PhoneNumber":"0978555221","Email":"thanhthao@arkki.vn","Gender":"MALE","IdCard":"205785425","DateOfIssueIdCard":"1993-03-14T00:00:00+00:00","PlaceOfIssueIdCard":"H\\u1ed3 Ch\\u00ed Minh","FileImage":"[\\"\\/file-storage\\/2022\\/02\\/20220225\\/3a0241f3-ba48-d8a7-6079-e2a7bba80f04.jpeg\\"]","Status":0,"Id":"93bbe4a6-ddcf-4a7e-b7d9-88fff8c95d43","LastModificationTime":"2022-03-29T03:49:49+00:00","CreationTime":"2022-03-29T03:49:49+00:00"}',
                'CreationTime' => '2022-03-29 03:49:49',
                'LastModificationTime' => '2022-03-29 03:49:49',
                'DeletionTime' => NULL,
            ),
            11 => 
            array (
                'id' => 12,
                'SubjectType' => 'GGPHP\\Users\\Models\\User',
                'Action' => 'created',
                'SubjectId' => '13d5fddd-ec5e-43d3-bdff-700da7639603',
                'Payload' => '{"FullName":"L\\u00ea Th\\u1ecb Lan Anh","Code":"NV007","DateOfBirth":"1993-03-14T00:00:00+00:00","PhoneNumber":"0978555229","Email":"lananh@arkki.vn","Gender":"MALE","IdCard":"0979099078","DateOfIssueIdCard":"2000-03-21T00:00:00+00:00","PlaceOfIssueIdCard":"H\\u1ed3 Ch\\u00ed Minh","FileImage":"[\\"\\/file-storage\\/2022\\/02\\/20220225\\/3a0241f3-ba48-d8a7-6079-e2a7bba80f04.jpeg\\"]","Status":0,"Id":"13d5fddd-ec5e-43d3-bdff-700da7639603","LastModificationTime":"2022-03-29T03:52:34+00:00","CreationTime":"2022-03-29T03:52:34+00:00"}',
                'CreationTime' => '2022-03-29 03:52:34',
                'LastModificationTime' => '2022-03-29 03:52:34',
                'DeletionTime' => NULL,
            ),
            12 => 
            array (
                'id' => 13,
                'SubjectType' => 'GGPHP\\Users\\Models\\User',
                'Action' => 'created',
                'SubjectId' => '7f192d8d-6294-4c37-80c2-b86d2a318057',
                'Payload' => '{"FullName":"Tr\\u1ecbnh Th\\u1ecb Thu Thu\\u1ef7","Code":"NV010","DateOfBirth":"1993-03-28T00:00:00+00:00","PhoneNumber":"0978555224","Email":"thuthuy@arkki.vn","Gender":"MALE","IdCard":"0979152589","DateOfIssueIdCard":"2022-03-28T00:00:00+00:00","PlaceOfIssueIdCard":"\\u0110\\u00e0 N\\u1eb5ng","FileImage":"[\\"\\/file-storage\\/2022\\/02\\/20220225\\/3a0241f3-ba48-d8a7-6079-e2a7bba80f04.jpeg\\"]","Status":0,"Id":"7f192d8d-6294-4c37-80c2-b86d2a318057","LastModificationTime":"2022-03-29T03:53:24+00:00","CreationTime":"2022-03-29T03:53:24+00:00"}',
                'CreationTime' => '2022-03-29 03:53:24',
                'LastModificationTime' => '2022-03-29 03:53:24',
                'DeletionTime' => NULL,
            ),
            13 => 
            array (
                'id' => 14,
                'SubjectType' => 'GGPHP\\Users\\Models\\User',
                'Action' => 'created',
                'SubjectId' => 'be94bd73-99b3-4eff-844b-3986a8cdee82',
                'Payload' => '{"FullName":"Nguy\\u1ec5n K\\u1ef3 V\\u00e2n N\\u1eef","Code":"NV012","DateOfBirth":"1993-03-21T00:00:00+00:00","PhoneNumber":"0978555228","Email":"kyvan@arkki.vn","Gender":"MALE","IdCard":"0979099077","DateOfIssueIdCard":"2022-03-28T00:00:00+00:00","PlaceOfIssueIdCard":"\\u0110\\u00e0 N\\u1eb5ng","Married":false,"FileImage":"[\\"\\/file-storage\\/2022\\/02\\/20220225\\/3a0241f3-ba48-d8a7-6079-e2a7bba80f04.jpeg\\"]","Status":0,"Id":"be94bd73-99b3-4eff-844b-3986a8cdee82","LastModificationTime":"2022-03-29T03:54:22+00:00","CreationTime":"2022-03-29T03:54:22+00:00"}',
                'CreationTime' => '2022-03-29 03:54:22',
                'LastModificationTime' => '2022-03-29 03:54:22',
                'DeletionTime' => NULL,
            ),
            14 => 
            array (
                'id' => 15,
                'SubjectType' => 'GGPHP\\Users\\Models\\User',
                'Action' => 'created',
                'SubjectId' => '218b5086-aabc-4bbf-9422-455b6d36ba6e',
                'Payload' => '{"FullName":"Nguy\\u1ec5n V\\u0169 T\\u01b0\\u1eddng Vy","Code":"NV0013","DateOfBirth":"1993-03-14T00:00:00+00:00","PhoneNumber":"012589421","Email":"tuognvy@arkki.vn","Gender":"FEMALE","IdCard":"0979099012","DateOfIssueIdCard":"2022-03-07T00:00:00+00:00","PlaceOfIssueIdCard":"H\\u1ed3 Ch\\u00ed Minh","Nation":"Kinh","Religion":"Kh\\u00f4ng","Married":false,"FileImage":"[\\"\\/file-storage\\/2022\\/02\\/20220225\\/3a0241f3-ba48-d8a7-6079-e2a7bba80f04.jpeg\\"]","Status":0,"Id":"218b5086-aabc-4bbf-9422-455b6d36ba6e","LastModificationTime":"2022-03-29T03:55:21+00:00","CreationTime":"2022-03-29T03:55:21+00:00"}',
                'CreationTime' => '2022-03-29 03:55:21',
                'LastModificationTime' => '2022-03-29 03:55:21',
                'DeletionTime' => NULL,
            ),
            15 => 
            array (
                'id' => 16,
                'SubjectType' => 'GGPHP\\Users\\Models\\User',
                'Action' => 'created',
                'SubjectId' => 'df052bd0-955c-4047-a15d-020c67e02b12',
                'Payload' => '{"FullName":"D\\u01b0\\u01a1ng Th\\u1ecb Th\\u1ea3o","Code":"NV014","DateOfBirth":"1993-03-14T00:00:00+00:00","PhoneNumber":"0978256412","Email":"thithao@arkki.vn","Gender":"FEMALE","IdCard":"205748225","DateOfIssueIdCard":"2022-03-07T00:00:00+00:00","PlaceOfIssueIdCard":"H\\u1ed3 Ch\\u00ed Minh","FileImage":"[\\"\\/file-storage\\/2022\\/02\\/20220225\\/3a0241f3-ba48-d8a7-6079-e2a7bba80f04.jpeg\\"]","Status":0,"Id":"df052bd0-955c-4047-a15d-020c67e02b12","LastModificationTime":"2022-03-29T03:56:28+00:00","CreationTime":"2022-03-29T03:56:28+00:00"}',
                'CreationTime' => '2022-03-29 03:56:28',
                'LastModificationTime' => '2022-03-29 03:56:28',
                'DeletionTime' => NULL,
            ),
            16 => 
            array (
                'id' => 17,
                'SubjectType' => 'GGPHP\\Users\\Models\\User',
                'Action' => 'created',
                'SubjectId' => '157d5658-50e3-4cba-8a6c-911aed296575',
                'Payload' => '{"FullName":"Nguy\\u1ec5n C\\u00e1t Nguy\\u00ean","Code":"NV014","DateOfBirth":"1993-03-14T00:00:00+00:00","PhoneNumber":"0978555229","Email":"catnguyen@arkki.vn","Gender":"FEMALE","IdCard":"205145236","DateOfIssueIdCard":"2022-03-21T00:00:00+00:00","PlaceOfIssueIdCard":"H\\u1ed3 Ch\\u00ed Minh","FileImage":"[\\"\\/file-storage\\/2022\\/02\\/20220225\\/3a0241f3-ba48-d8a7-6079-e2a7bba80f04.jpeg\\"]","Status":0,"Id":"157d5658-50e3-4cba-8a6c-911aed296575","LastModificationTime":"2022-03-29T03:57:56+00:00","CreationTime":"2022-03-29T03:57:56+00:00"}',
                'CreationTime' => '2022-03-29 03:57:56',
                'LastModificationTime' => '2022-03-29 03:57:56',
                'DeletionTime' => NULL,
            ),
            17 => 
            array (
                'id' => 18,
                'SubjectType' => 'GGPHP\\Users\\Models\\User',
                'Action' => 'created',
                'SubjectId' => '4a73039c-88a5-457d-97ec-d846bffeaf35',
                'Payload' => '{"FullName":"C\\u00f4 Huy\\u1ec1n","Code":"NV004","DateOfBirth":"2020-04-22T00:00:00+00:00","PhoneNumber":"0978555225","Email":"huyen.ptt@arkki.edu.vn","Gender":"FEMALE","IdCard":"0979099078","DateOfIssueIdCard":"2022-04-04T00:00:00+00:00","PlaceOfIssueIdCard":"H\\u1ed3 Ch\\u00ed Minh","Married":true,"FileImage":"[]","Status":0,"Id":"4a73039c-88a5-457d-97ec-d846bffeaf35","LastModificationTime":"2022-04-07T23:36:36+00:00","CreationTime":"2022-04-07T23:36:36+00:00"}',
                'CreationTime' => '2022-04-07 23:36:36',
                'LastModificationTime' => '2022-04-07 23:36:36',
                'DeletionTime' => NULL,
            ),
            18 => 
            array (
                'id' => 19,
                'SubjectType' => 'GGPHP\\Users\\Models\\User',
                'Action' => 'created',
                'SubjectId' => '46e8a4af-3fd3-4904-a04f-219859aa20e1',
                'Payload' => '{"FullName":"C\\u00f4 Ng\\u1ecdc","Code":"NV005","DateOfBirth":"2022-04-04T00:00:00+00:00","PhoneNumber":"0978555228","Email":"ngoc.ntk@arkki.edu.vn","Gender":"FEMALE","IdCard":"0979152589","DateOfIssueIdCard":"2022-04-08T00:00:00+00:00","PlaceOfIssueIdCard":"H\\u1ed3 Ch\\u00ed Minh","FileImage":"[\\"\\/file-storage\\/2022\\/02\\/20220225\\/3a0241f3-ba48-d8a7-6079-e2a7bba80f04.jpeg\\"]","Status":0,"Id":"46e8a4af-3fd3-4904-a04f-219859aa20e1","LastModificationTime":"2022-04-07T23:41:04+00:00","CreationTime":"2022-04-07T23:41:04+00:00"}',
                'CreationTime' => '2022-04-07 23:41:04',
                'LastModificationTime' => '2022-04-07 23:41:04',
                'DeletionTime' => NULL,
            ),
            19 => 
            array (
                'id' => 20,
                'SubjectType' => 'GGPHP\\Users\\Models\\User',
                'Action' => 'updated',
                'SubjectId' => '7f192d8d-6294-4c37-80c2-b86d2a318057',
                'Payload' => '{"FingerprintId":10,"Id":"7f192d8d-6294-4c37-80c2-b86d2a318057","FullName":"Tr\\u1ecbnh Th\\u1ecb Thu Thu\\u1ef7","DateOfBirth":"1993-03-28T00:00:00+00:00","PlaceOfBirth":null,"Email":"thuthuy@arkki.vn","PhoneNumber":"0978555224","Code":"NV010","PermanentAddress":null,"Nationality":null,"Nation":null,"IdCard":"0979152589","DateOfIssueIdCard":"2022-03-28T00:00:00+00:00","PlaceOfIssueIdCard":"\\u0110\\u00e0 N\\u1eb5ng","Religion":null,"Gender":"FEMALE","TaxCode":null,"TrainingSchoolId":null,"DateOff":null,"Address":null,"EducationalLevelId":null,"WorkDate":null,"HealthInsuranceBookNumber":null,"HospitalAddress":null,"SocialInsuranceBooknumber":null,"BankName":null,"BankNumberOfAccount":null,"Note":null,"MaternityLeave":false,"MaternityLeaveFrom":null,"MaternityLeaveTo":null,"Status":0,"Category":0,"FileImage":"[\\"\\/file-storage\\/2022\\/02\\/20220225\\/3a0241f3-ba48-d8a7-6079-e2a7bba80f04.jpeg\\"]","Married":null,"EmployeeIdCrm":null,"Description":null,"DegreeId":null,"TrainingMajorId":null,"CreationTime":"2022-03-29T03:53:24+00:00","LastModificationTime":"2022-05-12T13:24:08+00:00","DeletionTime":null}',
                'CreationTime' => '2022-05-12 13:24:08',
                'LastModificationTime' => '2022-05-12 13:24:08',
                'DeletionTime' => NULL,
            ),
            20 => 
            array (
                'id' => 21,
                'SubjectType' => 'GGPHP\\Users\\Models\\User',
                'Action' => 'updated',
                'SubjectId' => '46e8a4af-3fd3-4904-a04f-219859aa20e1',
                'Payload' => '{"FingerprintId":16,"Id":"46e8a4af-3fd3-4904-a04f-219859aa20e1","FullName":"C\\u00f4 Ng\\u1ecdc","DateOfBirth":"2022-04-04T00:00:00+00:00","PlaceOfBirth":null,"Email":"ngoc.ntk@arkki.edu.vn","PhoneNumber":"0978555228","Code":"NV016","PermanentAddress":null,"Nationality":null,"Nation":null,"IdCard":"0979152589","DateOfIssueIdCard":"2022-04-08T00:00:00+00:00","PlaceOfIssueIdCard":"H\\u1ed3 Ch\\u00ed Minh","Religion":null,"Gender":"FEMALE","TaxCode":null,"TrainingSchoolId":null,"DateOff":null,"Address":null,"EducationalLevelId":null,"WorkDate":null,"HealthInsuranceBookNumber":null,"HospitalAddress":null,"SocialInsuranceBooknumber":null,"BankName":null,"BankNumberOfAccount":null,"Note":null,"MaternityLeave":false,"MaternityLeaveFrom":null,"MaternityLeaveTo":null,"Status":0,"Category":0,"FileImage":"[\\"\\/file-storage\\/2022\\/02\\/20220225\\/3a0241f3-ba48-d8a7-6079-e2a7bba80f04.jpeg\\"]","Married":null,"EmployeeIdCrm":null,"Description":null,"DegreeId":null,"TrainingMajorId":null,"CreationTime":"2022-04-07T23:41:04+00:00","LastModificationTime":"2022-05-12T13:48:18+00:00","DeletionTime":null}',
                'CreationTime' => '2022-05-12 13:48:18',
                'LastModificationTime' => '2022-05-12 13:48:18',
                'DeletionTime' => NULL,
            ),
            21 => 
            array (
                'id' => 22,
                'SubjectType' => 'GGPHP\\Users\\Models\\User',
                'Action' => 'updated',
                'SubjectId' => '4a73039c-88a5-457d-97ec-d846bffeaf35',
                'Payload' => '{"FingerprintId":15,"Id":"4a73039c-88a5-457d-97ec-d846bffeaf35","FullName":"C\\u00f4 Huy\\u1ec1n","DateOfBirth":"2020-04-22T00:00:00+00:00","PlaceOfBirth":null,"Email":"huyen.ptt@arkki.edu.vn","PhoneNumber":"0978555225","Code":"NV015","PermanentAddress":null,"Nationality":null,"Nation":null,"IdCard":"0979099078","DateOfIssueIdCard":"2022-04-04T00:00:00+00:00","PlaceOfIssueIdCard":"H\\u1ed3 Ch\\u00ed Minh","Religion":null,"Gender":"FEMALE","TaxCode":null,"TrainingSchoolId":null,"DateOff":null,"Address":null,"EducationalLevelId":null,"WorkDate":null,"HealthInsuranceBookNumber":null,"HospitalAddress":null,"SocialInsuranceBooknumber":null,"BankName":null,"BankNumberOfAccount":null,"Note":null,"MaternityLeave":false,"MaternityLeaveFrom":null,"MaternityLeaveTo":null,"Status":0,"Category":0,"FileImage":"[]","Married":true,"EmployeeIdCrm":null,"Description":null,"DegreeId":null,"TrainingMajorId":null,"CreationTime":"2022-04-07T23:36:36+00:00","LastModificationTime":"2022-05-12T13:48:39+00:00","DeletionTime":null}',
                'CreationTime' => '2022-05-12 13:48:39',
                'LastModificationTime' => '2022-05-12 13:48:39',
                'DeletionTime' => NULL,
            ),
            22 => 
            array (
                'id' => 23,
                'SubjectType' => 'GGPHP\\Users\\Models\\User',
                'Action' => 'created',
                'SubjectId' => '9148317a-df19-4eb7-b5ae-1915031c6388',
                'Payload' => '{"FullName":"Mai Tr\\u01b0\\u01a1ng T\\u01b0\\u1eddng Vy","Code":"NV017","DateOfBirth":"1996-05-01T00:00:00+00:00","PhoneNumber":"0964123012","Email":"maitruongtuongvy@gmail.com","Gender":"FEMALE","IdCard":"2309912321","DateOfIssueIdCard":"2019-11-02T00:00:00+00:00","PlaceOfIssueIdCard":"Gia Lai","Nation":"Kinh","Religion":"Kh\\u00f4ng","Married":false,"PlaceOfBirth":"Gia Lai","Nationality":"Vi\\u1ec7t Nam","PermanentAddress":"Gia Lai","Address":"\\u0110\\u00e0 N\\u1eb5ng","DegreeId":"f046c0a8-f80d-44e8-b198-3e8f07854e64","TrainingMajorId":"803de363-4368-43c9-8e08-322c147dda4b","FileImage":"[]","Status":0,"Id":"9148317a-df19-4eb7-b5ae-1915031c6388","LastModificationTime":"2022-05-12T13:50:23+00:00","CreationTime":"2022-05-12T13:50:23+00:00"}',
                'CreationTime' => '2022-05-12 13:50:23',
                'LastModificationTime' => '2022-05-12 13:50:23',
                'DeletionTime' => NULL,
            ),
        ));
        
        
    }
}