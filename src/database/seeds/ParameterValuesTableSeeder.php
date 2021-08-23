<?php

use Illuminate\Database\Seeder;

class ParameterValuesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('ParameterValues')->delete();
        
        \DB::table('ParameterValues')->insert(array (
            0 => 
            array (
                'Id' => '35a7b6d1-0c11-4ef2-bb69-39e5cde04751',
                'Code' => 'THUONG_THANG_13',
                'Name' => 'Thưởng tháng 13',
                'ApplyDate' => '2021-06-01',
                'ValueDefault' => '0',
                'Note' => 'Không',
                'Type' => 'DECLARE',
                'CreationTime' => '2021-06-23 08:04:09',
                'LastModificationTime' => '2021-06-23 08:04:09',
            ),
            1 => 
            array (
                'Id' => '2db95d9e-eaee-4607-9c4b-3b2b9494fa16',
                'Code' => 'TRUY_LINH',
                'Name' => 'Truy lĩnh',
                'ApplyDate' => '2021-06-09',
                'ValueDefault' => '0',
                'Note' => 'Không',
                'Type' => 'DECLARE',
                'CreationTime' => '2021-06-23 08:04:27',
                'LastModificationTime' => '2021-06-23 08:04:27',
            ),
            2 => 
            array (
                'Id' => 'b3616804-414d-4daf-b7c4-104ed1b61da6',
                'Code' => 'THANH_TOAN_TU_BHXH',
                'Name' => 'Thanh toán từ BHXH',
                'ApplyDate' => '2021-06-02',
                'ValueDefault' => '0',
                'Note' => 'Không',
                'Type' => 'DECLARE',
                'CreationTime' => '2021-06-23 08:04:59',
                'LastModificationTime' => '2021-06-23 08:04:59',
            ),
            3 => 
            array (
                'Id' => '689b9204-6a5d-40d0-bce8-6c6e5509e027',
                'Code' => 'DIEU_CHINH_BHXH _NLD',
                'Name' => 'Điều chỉnh BHXH người lao động',
                'ApplyDate' => '2021-06-01',
                'ValueDefault' => '0',
                'Note' => 'Không',
                'Type' => 'DECLARE',
                'CreationTime' => '2021-06-23 08:05:14',
                'LastModificationTime' => '2021-06-23 08:05:14',
            ),
            4 => 
            array (
                'Id' => '78197da9-c87c-4997-96e8-d3a49da25a62',
                'Code' => 'DIEU_CHINH_BHXH_CTT',
                'Name' => 'Điều chỉnh BHXH công ty trả',
                'ApplyDate' => '2021-06-02',
                'ValueDefault' => '0',
                'Note' => 'Không',
                'Type' => 'DECLARE',
                'CreationTime' => '2021-06-23 08:05:28',
                'LastModificationTime' => '2021-06-23 08:05:28',
            ),
            5 => 
            array (
                'Id' => 'e5d89251-87a5-4151-94ab-26013366b553',
                'Code' => 'DONG_GOP_TU_THIEN',
                'Name' => 'Đóng góp từ thiện',
                'ApplyDate' => '2021-06-01',
                'ValueDefault' => '0',
                'Note' => 'Không',
                'Type' => 'DECLARE',
                'CreationTime' => '2021-06-23 08:05:46',
                'LastModificationTime' => '2021-06-23 08:05:46',
            ),
            6 => 
            array (
                'Id' => '8887f093-2cfd-477b-a447-1f7a5431bd99',
                'Code' => 'THUONG_DANH_GIA_CV',
                'Name' => 'Thưởng đánh giá công việc',
                'ApplyDate' => '2021-06-02',
                'ValueDefault' => '0',
                'Note' => 'Không',
                'Type' => 'DECLARE',
                'CreationTime' => '2021-06-23 08:06:06',
                'LastModificationTime' => '2021-06-23 08:06:06',
            ),
            7 => 
            array (
                'Id' => 'ea497555-94c7-4e04-be7c-bede3afdaaf5',
                'Code' => 'PC_TRACH_NHIEM',
                'Name' => 'Phụ cấp trách nhiệm',
                'ApplyDate' => '2021-05-01',
                'ValueDefault' => '0',
                'Note' => 'Không',
                'Type' => 'CONTRACT',
                'CreationTime' => '2021-06-23 07:49:12',
                'LastModificationTime' => '2021-06-23 07:49:12',
            ),
            8 => 
            array (
                'Id' => 'e509bd5f-76ab-45b2-be92-7e8ff9248879',
                'Code' => 'PC_XANG_XE',
                'Name' => 'Phụ cấp xăng xe',
                'ApplyDate' => '2021-05-01',
                'ValueDefault' => '1100000',
                'Note' => 'Không',
                'Type' => 'CONTRACT',
                'CreationTime' => '2021-06-23 07:49:45',
                'LastModificationTime' => '2021-06-23 07:49:45',
            ),
            9 => 
            array (
                'Id' => 'c7051157-205b-44b5-8d21-7c52a40ae88e',
                'Code' => 'PC_DONG_PHUC',
                'Name' => 'Phụ cấp đồng phục',
                'ApplyDate' => '2021-05-01',
                'ValueDefault' => '400000',
                'Note' => 'Không',
                'Type' => 'CONTRACT',
                'CreationTime' => '2021-06-23 07:50:22',
                'LastModificationTime' => '2021-06-23 07:50:22',
            ),
            10 => 
            array (
                'Id' => 'bdba76a3-b295-4f8b-b23d-cd691b2726a8',
                'Code' => 'PC_CHUYEN_CAN',
                'Name' => 'Phụ cấp chuyên cần',
                'ApplyDate' => '2021-05-01',
                'ValueDefault' => '1800000',
                'Note' => 'Không',
                'Type' => 'CONTRACT',
                'CreationTime' => '2021-06-23 07:50:53',
                'LastModificationTime' => '2021-06-23 07:50:53',
            ),
            11 => 
            array (
                'Id' => '5f917cd8-bcc3-4b2a-9c19-24b8ef1478cc',
                'Code' => 'PC_AN_TRUA',
                'Name' => 'Phụ cấp ăn trưa',
                'ApplyDate' => '2021-05-01',
                'ValueDefault' => '750000',
                'Note' => 'Không',
                'Type' => 'CONTRACT',
                'CreationTime' => '2021-06-23 07:51:11',
                'LastModificationTime' => '2021-06-23 07:51:11',
            ),
            12 => 
            array (
                'Id' => 'bab94dec-9f8f-4e28-8bec-365e35b29479',
                'Code' => 'PC_DIEN_THOAI',
                'Name' => 'Phụ cấp điện thoại',
                'ApplyDate' => '2021-05-01',
                'ValueDefault' => '300000',
                'Note' => 'Không',
                'Type' => 'CONTRACT',
                'CreationTime' => '2021-06-23 07:51:36',
                'LastModificationTime' => '2021-06-23 07:51:36',
            ),
            13 => 
            array (
                'Id' => '5b7bde65-1039-4f08-994e-964395c907fe',
                'Code' => 'PC_LEAD_LOP_HOC',
                'Name' => 'Phụ cấp lead lớp học',
                'ApplyDate' => '2021-05-01',
                'ValueDefault' => '0',
                'Note' => 'Không',
                'Type' => 'CONTRACT',
                'CreationTime' => '2021-06-23 07:52:05',
                'LastModificationTime' => '2021-06-23 07:52:05',
            ),
            14 => 
            array (
                'Id' => 'e21bd3ea-b026-41b9-96ad-5e4657116189',
                'Code' => 'PC_KHAC',
                'Name' => 'Phụ cấp khác',
                'ApplyDate' => '2021-05-01',
                'ValueDefault' => '0',
                'Note' => 'Không',
                'Type' => 'CONTRACT',
                'CreationTime' => '2021-06-23 07:52:23',
                'LastModificationTime' => '2021-06-23 07:52:23',
            ),
            15 => 
            array (
                'Id' => '634dbbcc-7aab-4070-a2d3-1882a4e0e162',
                'Code' => 'TIEN_DI_XE_BUS_GIO',
                'Name' => 'Tiền đi xe bus/giờ',
                'ApplyDate' => '2021-05-01',
                'ValueDefault' => '50000',
                'Note' => 'Không',
                'Type' => 'COMMON',
                'CreationTime' => '2021-06-23 08:00:44',
                'LastModificationTime' => '2021-06-23 08:00:44',
            ),
            16 => 
            array (
                'Id' => '1ea2a633-98d5-46ff-80c7-9838e69e20b1',
                'Code' => 'TI_LE_THAI_SAN',
                'Name' => 'Tỉ lệ thưởng tiền thai sản',
                'ApplyDate' => '2021-05-01',
                'ValueDefault' => '0',
                'Note' => 'Không',
                'Type' => 'COMMON',
                'CreationTime' => '2021-06-23 08:01:02',
                'LastModificationTime' => '2021-06-23 08:01:02',
            ),
            17 => 
            array (
                'Id' => 'c3ca11c2-fd99-4e6a-920b-1e5ae8a9fbea',
                'Code' => 'SO_NGAY_LAM_VIEC_TRONG_THANG',
                'Name' => 'Số ngày làm việc trong tháng',
                'ApplyDate' => '2021-05-01',
                'ValueDefault' => '0',
                'Note' => 'Không',
                'Type' => 'DECLARE',
                'CreationTime' => '2021-06-23 08:01:33',
                'LastModificationTime' => '2021-06-23 08:01:33',
            ),
            18 => 
            array (
                'Id' => '837f1b42-c9b9-4693-9442-8a5ed8185c2f',
                'Code' => 'SO_GIO_LAM_THEM_NGAY_THUONG',
                'Name' => 'Số giờ làm thêm ngày thường',
                'ApplyDate' => '2021-05-01',
                'ValueDefault' => '0',
                'Note' => 'Không',
                'Type' => 'DECLARE',
                'CreationTime' => '2021-06-23 08:01:51',
                'LastModificationTime' => '2021-06-23 08:01:51',
            ),
            19 => 
            array (
                'Id' => '9cd1644c-6cb2-494f-95d6-f56bd2e2add3',
                'Code' => 'SO_GIO_LAM_THEM_NGAY_LE',
                'Name' => 'Số giờ làm thêm ngày lễ',
                'ApplyDate' => '2021-06-23',
                'ValueDefault' => '0',
                'Note' => 'Không',
                'Type' => 'DECLARE',
                'CreationTime' => '2021-06-23 08:02:50',
                'LastModificationTime' => '2021-06-23 08:02:50',
            ),
            20 => 
            array (
                'Id' => '0778d678-3b56-455b-8f0a-ae8eef242177',
                'Code' => 'SO_NGAY_CHUAN',
                'Name' => 'Số ngày chuẩn của tháng',
                'ApplyDate' => '2021-05-02',
                'ValueDefault' => '0',
                'Note' => 'Không',
                'Type' => 'DECLARE',
                'CreationTime' => '2021-06-23 08:03:18',
                'LastModificationTime' => '2021-06-23 08:03:18',
            ),
            21 => 
            array (
                'Id' => 'c6cf430c-b96b-4780-8bda-9641a784941f',
                'Code' => 'SO_GIO_DI_XE_BUS',
                'Name' => 'Số giờ đi xe bus',
                'ApplyDate' => '2021-06-09',
                'ValueDefault' => '0',
                'Note' => 'Không',
                'Type' => 'DECLARE',
                'CreationTime' => '2021-06-23 08:03:33',
                'LastModificationTime' => '2021-06-23 08:03:33',
            ),
            22 => 
            array (
                'Id' => 'fa9afe3c-df52-4973-955d-2ceb25307fcb',
                'Code' => 'THUONG_KPI',
                'Name' => 'Thưởng KPI',
                'ApplyDate' => '2021-06-01',
                'ValueDefault' => '0',
                'Note' => 'Không',
                'Type' => 'DECLARE',
                'CreationTime' => '2021-06-23 08:06:22',
                'LastModificationTime' => '2021-06-23 08:06:22',
            ),
            23 => 
            array (
                'Id' => '7509365a-93b8-4b05-a9e2-16900d702161',
                'Code' => 'SO_TIEN_TAM_UNG',
                'Name' => 'Số tiền tạm ứng',
                'ApplyDate' => '2021-06-01',
                'ValueDefault' => '0',
                'Note' => 'Không',
                'Type' => 'DECLARE',
                'CreationTime' => '2021-06-23 08:06:46',
                'LastModificationTime' => '2021-06-23 08:06:46',
            ),
            24 => 
            array (
                'Id' => 'a3901b86-46a8-46e6-a384-fa6173b36917',
                'Code' => 'SO_GIO_LAM_THEM_CUOI_TUAN',
                'Name' => 'Số giờ làm thêm cuối tuần',
                'ApplyDate' => '2021-05-01',
                'ValueDefault' => '0',
                'Note' => 'Không',
                'Type' => 'DECLARE',
                'CreationTime' => '2021-06-23 08:02:29',
                'LastModificationTime' => '2021-06-23 08:02:29',
            ),
            25 => 
            array (
                'Id' => '2678bfa7-e7d8-4279-a467-388f460ae211',
                'Code' => 'TI_LE_BHYT_NLD',
                'Name' => 'Tỉ lệ bảo hiểm y tế người lao động',
                'ApplyDate' => '2021-04-30',
                'ValueDefault' => '0.015',
                'Note' => 'Không',
                'Type' => 'COMMON',
                'CreationTime' => '2021-06-23 07:55:05',
                'LastModificationTime' => '2021-07-27 08:44:26',
            ),
            26 => 
            array (
                'Id' => 'c97238a1-e33b-49b8-a271-7523967d5307',
                'Code' => 'PC_HT_TCSK',
                'Name' => 'Phụ cấp hội thảo, tổ chức sự kiện',
                'ApplyDate' => '2021-06-08',
                'ValueDefault' => '100000',
                'Note' => 'Không',
                'Type' => 'DECLARE',
                'CreationTime' => '2021-06-23 08:03:48',
                'LastModificationTime' => '2021-07-19 05:12:11',
            ),
            27 => 
            array (
                'Id' => 'fe87c1a6-f8c7-4e92-a18f-0f6b09a97e47',
                'Code' => 'TI_LE_THU_VIEC',
                'Name' => 'Tỉ lệ thử việc',
                'ApplyDate' => '2021-03-28',
                'ValueDefault' => '2000000',
                'Note' => 'Tỉ lệ thử việc',
                'Type' => 'CONTRACT',
                'CreationTime' => '2021-06-23 07:47:09',
                'LastModificationTime' => '2021-07-28 09:27:18',
            ),
            28 => 
            array (
                'Id' => '16575902-174c-4c97-8a12-3996904c4588',
                'Code' => 'TI_LE_BHTN_CTT',
                'Name' => 'Tỉ lệ bảo hiểm thất nghiệp công ty trả',
                'ApplyDate' => '2021-04-30',
                'ValueDefault' => '0.01',
                'Note' => 'Không',
                'Type' => 'COMMON',
                'CreationTime' => '2021-06-23 07:58:20',
                'LastModificationTime' => '2021-07-27 08:47:22',
            ),
            29 => 
            array (
                'Id' => 'f804e95c-1ade-4c21-a053-6a3090f57d0e',
                'Code' => 'TI_LE_BHXH_NLD',
                'Name' => 'Tỉ lệ bảo hiểm xã hội người lao động',
                'ApplyDate' => '2021-04-30',
                'ValueDefault' => '0.08',
                'Note' => 'Không',
                'Type' => 'COMMON',
                'CreationTime' => '2021-06-23 07:56:29',
                'LastModificationTime' => '2021-07-27 08:44:07',
            ),
            30 => 
            array (
                'Id' => '6b502d98-a49b-42c0-b403-a5f271012408',
                'Code' => 'TI_LE_BHTN_NLD',
                'Name' => 'Tỉ lệ bảo hiểm thất nghiệp người lao động',
                'ApplyDate' => '2021-04-28',
                'ValueDefault' => '0.01',
                'Note' => 'Không',
                'Type' => 'COMMON',
                'CreationTime' => '2021-06-23 07:57:10',
                'LastModificationTime' => '2021-07-27 09:00:00',
            ),
            31 => 
            array (
                'Id' => 'cd51446f-3545-4bf8-bcef-132a94c6cad4',
                'Code' => 'TI_LE_BHYT_CTT',
                'Name' => 'Tỉ lệ bảo hiểm y tế công ty trả',
                'ApplyDate' => '2021-04-29',
                'ValueDefault' => '0.03',
                'Note' => 'Không',
                'Type' => 'COMMON',
                'CreationTime' => '2021-06-23 07:57:57',
                'LastModificationTime' => '2021-07-27 09:00:41',
            ),
            32 => 
            array (
                'Id' => '444896a4-e0af-40fe-9cd8-791aea696d6a',
                'Code' => 'TI_LE_BHXH_CTT',
                'Name' => 'Tỉ lệ bảo hiểm xã hội công ty trả',
                'ApplyDate' => '2021-04-29',
                'ValueDefault' => '0.175',
                'Note' => 'Không',
                'Type' => 'COMMON',
                'CreationTime' => '2021-06-23 07:57:36',
                'LastModificationTime' => '2021-07-27 09:01:03',
            ),
            33 => 
            array (
                'Id' => '0fa9a0f3-2626-46df-a68c-4370085388b6',
                'Code' => 'TI_LE_PHI_CONG_DOAN',
                'Name' => 'Tỉ lệ phí công đoàn',
                'ApplyDate' => '2021-04-30',
                'ValueDefault' => '0.02',
                'Note' => 'Không',
                'Type' => 'COMMON',
                'CreationTime' => '2021-06-23 07:58:37',
                'LastModificationTime' => '2021-07-27 09:06:23',
            ),
            34 => 
            array (
                'Id' => '311fb993-c1c9-4a9e-8b64-13d2ec1dcb5f',
                'Code' => 'TI_LE_OT_NGAY_THUONG',
                'Name' => 'Tỉ lệ OT ngày thường',
                'ApplyDate' => '2021-04-04',
                'ValueDefault' => '1.5',
                'Note' => 'Không',
                'Type' => 'COMMON',
                'CreationTime' => '2021-06-23 07:59:48',
                'LastModificationTime' => '2021-07-27 09:35:03',
            ),
            35 => 
            array (
                'Id' => '8e0c8699-7460-4739-a93d-f7fb5620dc23',
                'Code' => 'TI_LE_OT_CUOI_TUAN',
                'Name' => 'Tỉ lệ OT cuối tuần',
                'ApplyDate' => '2021-04-04',
                'ValueDefault' => '2',
                'Note' => 'Không',
                'Type' => 'COMMON',
                'CreationTime' => '2021-06-23 08:00:09',
                'LastModificationTime' => '2021-07-27 09:35:18',
            ),
            36 => 
            array (
                'Id' => 'be04ff7e-52cc-4505-80df-7c41762cf5a2',
                'Code' => 'TI_LE_OT_NGAY_LE',
                'Name' => 'Tỉ lệ OT ngày lễ',
                'ApplyDate' => '2021-04-30',
                'ValueDefault' => '3',
                'Note' => 'Không',
                'Type' => 'COMMON',
                'CreationTime' => '2021-06-23 08:00:25',
                'LastModificationTime' => '2021-07-27 09:35:34',
            ),
            37 => 
            array (
                'Id' => '11a9dafc-320d-463a-a4e0-24fcb9de2e73',
                'Code' => 'LUONG_CB',
                'Name' => 'Lương cơ bản',
                'ApplyDate' => '2021-04-09',
                'ValueDefault' => '4800000',
                'Note' => 'Không',
                'Type' => 'CONTRACT',
                'CreationTime' => '2021-04-19 08:45:02',
                'LastModificationTime' => '2021-06-23 07:46:27',
            ),
            38 => 
            array (
                'Id' => '3fb9ba2e-804a-440e-8959-c20c96c2c020',
                'Code' => 'GIAMTRU_PHUTHUOC',
                'Name' => 'Giảm trừ người phụ thuộc',
                'ApplyDate' => '2021-04-30',
                'ValueDefault' => '4400000',
                'Note' => 'Không',
                'Type' => 'COMMON',
                'CreationTime' => '2021-06-23 07:59:04',
                'LastModificationTime' => '2021-07-27 10:16:09',
            ),
            39 => 
            array (
                'Id' => '90615929-6e92-479c-aefa-5eee926fd037',
                'Code' => 'SO_NGUOIPHUTHUOC',
                'Name' => 'Số người phụ thuộc',
                'ApplyDate' => '2021-04-01',
                'ValueDefault' => '0',
                'Note' => 'Không',
                'Type' => 'CONTRACT',
                'CreationTime' => '2021-06-23 07:47:45',
                'LastModificationTime' => '2021-06-23 07:47:45',
            ),
            40 => 
            array (
                'Id' => 'c3adc407-84c0-4bd6-98f8-3f672cc082f5',
                'Code' => 'GIAMTRU_BANTHAN',
                'Name' => 'Giảm trừ bản thân',
                'ApplyDate' => '2021-04-30',
                'ValueDefault' => '11000000',
                'Note' => 'Không',
                'Type' => 'COMMON',
                'CreationTime' => '2021-06-23 07:59:31',
                'LastModificationTime' => '2021-07-27 10:15:52',
            ),
        ));
        
        
    }
}