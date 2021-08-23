<?php

use Illuminate\Database\Seeder;

class ParameterFormulasTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('ParameterFormulas')->delete();
        
        \DB::table('ParameterFormulas')->insert(array (
            0 => 
            array (
                'Id' => '2da828ce-4de3-4aa4-bf61-c1b97ab41e92',
                'Code' => 'TOTAL_OT',
                'Name' => 'Tổng lương làm thêm',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 02:45:57',
                'LastModificationTime' => '2021-07-01 02:45:57',
                'Recipe' => '[{"variable":"LUONG_THEO_GIO","type":"variable","value":null,"operator":null,"formular":[]},{"type":"formular","operator":"*","value":null,"variable":null,"formular":[{"type":"formular","operator":null,"value":null,"variable":null,"formular":[{"variable":"TI_LE_OT_NGAY_THUONG","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"SO_GIO_LAM_THEM_NGAY_THUONG","type":"variable","value":null,"operator":"*","formular":[]}]},{"type":"formular","operator":"+","value":null,"variable":null,"formular":[{"variable":"TI_LE_OT_CUOI_TUAN","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"SO_GIO_LAM_THEM_CUOI_TUAN","type":"variable","value":null,"operator":"*","formular":[]}]},{"type":"formular","operator":"+","value":null,"variable":null,"formular":[{"variable":"TI_LE_OT_NGAY_LE","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"SO_GIO_LAM_THEM_NGAY_LE","type":"variable","value":null,"operator":"*","formular":[]}]}]}]',
            ),
            1 => 
            array (
                'Id' => 'e9e14831-b576-4ed3-82d6-b722620f535a',
                'Code' => 'OT_KHONG_TINH_THUE',
                'Name' => 'Lương làm thêm không tính thuế',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 02:49:41',
                'LastModificationTime' => '2021-07-01 02:49:41',
                'Recipe' => '[{"variable":"LUONG_THEO_GIO","type":"variable","value":null,"operator":null,"formular":[]},{"type":"formular","operator":"*","value":null,"variable":null,"formular":[{"type":"formular","operator":null,"value":null,"variable":null,"formular":[{"type":"formular","operator":null,"value":null,"variable":null,"formular":[{"variable":"TI_LE_OT_NGAY_THUONG","type":"variable","value":null,"operator":null,"formular":[]},{"variable":null,"type":"value","value":1,"operator":"-","formular":[]}]},{"variable":"SO_GIO_LAM_THEM_NGAY_THUONG","type":"variable","value":null,"operator":"*","formular":[]}]},{"type":"formular","operator":"+","value":null,"variable":null,"formular":[{"type":"formular","operator":null,"value":null,"variable":null,"formular":[{"variable":"TI_LE_OT_CUOI_TUAN","type":"variable","value":null,"operator":null,"formular":[]},{"variable":null,"type":"value","value":1,"operator":"-","formular":[]}]},{"variable":"SO_GIO_LAM_THEM_CUOI_TUAN","type":"variable","value":null,"operator":"*","formular":[]}]},{"type":"formular","operator":"+","value":null,"variable":null,"formular":[{"type":"formular","operator":null,"value":null,"variable":null,"formular":[{"variable":"TI_LE_OT_NGAY_LE","type":"variable","value":null,"operator":null,"formular":[]},{"variable":null,"type":"value","value":1,"operator":"-","formular":[]}]},{"variable":"SO_GIO_LAM_THEM_NGAY_LE","type":"variable","value":null,"operator":"*","formular":[]}]}]}]',
            ),
            2 => 
            array (
                'Id' => 'ea7f61c2-fd56-42fe-9717-c1fdce894ca0',
                'Code' => 'OT_TINH_THUE',
                'Name' => 'Lương làm thêm tính thuế',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 02:53:15',
                'LastModificationTime' => '2021-07-01 02:53:15',
                'Recipe' => '[{"variable":"TOTAL_OT","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"OT_KHONG_TINH_THUE","type":"variable","value":null,"operator":"-","formular":[]}]',
            ),
            3 => 
            array (
                'Id' => 'f52be798-ba62-4a74-bd8d-d6ca26e17902',
                'Code' => 'PC_BUS',
                'Name' => 'Phụ cấp xe bus',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 02:53:53',
                'LastModificationTime' => '2021-07-01 02:53:53',
                'Recipe' => '[{"variable":"TIEN_DI_XE_BUS_GIO","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"SO_GIO_DI_XE_BUS","type":"variable","value":null,"operator":"*","formular":[]}]',
            ),
            4 => 
            array (
                'Id' => 'c51faf3c-a87f-427b-a89c-d61adf98c08e',
                'Code' => 'BHXH_NLD',
                'Name' => 'BHXH Người lao động',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 02:57:25',
                'LastModificationTime' => '2021-07-01 02:57:25',
                'Recipe' => '[{"variable":"LUONG_CO_BAN","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"TI_LE_BHXH_NLD","type":"variable","value":null,"operator":"*","formular":[]}]',
            ),
            5 => 
            array (
                'Id' => '811d39c0-cbeb-4cfc-b25e-7da6d3499ea1',
                'Code' => 'BHYT_NLD',
                'Name' => 'BHYT Người lao động',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 02:57:56',
                'LastModificationTime' => '2021-07-01 02:57:56',
                'Recipe' => '[{"variable":"LUONG_CO_BAN","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"TI_LE_BHYT_NLD","type":"variable","value":null,"operator":"*","formular":[]}]',
            ),
            6 => 
            array (
                'Id' => 'e4045bdb-c115-4709-905e-33b30a9ab27d',
                'Code' => 'BHTN_NLD',
                'Name' => 'BHTN Người lao động',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 02:58:20',
                'LastModificationTime' => '2021-07-01 02:58:20',
                'Recipe' => '[{"variable":"LUONG_CO_BAN","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"TI_LE_BHTN_NLD","type":"variable","value":null,"operator":"*","formular":[]}]',
            ),
            7 => 
            array (
                'Id' => 'bcee7c78-6078-4048-ac92-cfeaad8108d6',
                'Code' => 'BHXH_CTT',
                'Name' => 'BHXH Công ty',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 03:00:19',
                'LastModificationTime' => '2021-07-01 03:00:19',
                'Recipe' => '[{"variable":"LUONG_CO_BAN","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"TI_LE_BHXH_CTT","type":"variable","value":null,"operator":"*","formular":[]}]',
            ),
            8 => 
            array (
                'Id' => '4440fc0f-358a-4cbe-82a5-94f02f6539b4',
                'Code' => 'BHYT_CTT',
                'Name' => 'BHYT Công ty',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 03:00:40',
                'LastModificationTime' => '2021-07-01 03:00:40',
                'Recipe' => '[{"variable":"LUONG_CO_BAN","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"TI_LE_BHYT_CTT","type":"variable","value":null,"operator":"*","formular":[]}]',
            ),
            9 => 
            array (
                'Id' => 'bc1db45e-56e1-4185-afe9-a05f499a71bc',
                'Code' => 'BHTN_CTT',
                'Name' => 'BHTN Công ty',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 03:01:02',
                'LastModificationTime' => '2021-07-01 03:01:02',
                'Recipe' => '[{"variable":"LUONG_CO_BAN","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"TI_LE_BHTN_CTT","type":"variable","value":null,"operator":"*","formular":[]}]',
            ),
            10 => 
            array (
                'Id' => 'd629f56e-92d0-4d08-9fe9-9a457bd6db6b',
                'Code' => 'TNCN_GIAM_TRU_BAN_THAN',
                'Name' => 'Giảm trừ bản thân và người phụ thuộc',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 03:05:50',
                'LastModificationTime' => '2021-07-01 03:05:50',
                'Recipe' => '[{"variable":"TNCN_GIAM_TRU_BAN_THAN","type":"variable","value":null,"operator":null,"formular":[]},{"type":"formular","operator":"+","value":null,"variable":null,"formular":[{"variable":"TNCN_NGUOI_PHU_THUOC","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"SO_NGUOI_PHU_THUOC","type":"variable","value":null,"operator":"*","formular":[]}]}]',
            ),
            11 => 
            array (
                'Id' => '4de96879-cf90-44e8-9652-c843d3075220',
                'Code' => 'LUONG_THUC_NHAN',
                'Name' => 'Lương thực nhận',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 03:57:08',
                'LastModificationTime' => '2021-08-23 09:08:45',
                'Recipe' => '[{"variable":"TONG_THU_NHAP","type":"variable","value":null,"operator":null,"formular":[]},{"type":"formular","operator":"-","value":null,"variable":null,"formular":[{"variable":"TONG_BH_NLD","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"DIEU_CHINH_BHXH_NLD","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"THUE_TNCN","type":"variable","value":null,"operator":"+","formular":[]}]},{"variable":"THANH_TOAN_TU_BHXH","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"SO_TIEN_TAM_UNG","type":"variable","value":null,"operator":"-","formular":[]}]',
            ),
            12 => 
            array (
                'Id' => '9c450fd7-6a8a-43d8-9b11-787071bbe6d5',
                'Code' => 'THUNHAP_TINHTHUE',
                'Name' => 'Thu nhập tính thuế',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 03:12:12',
                'LastModificationTime' => '2021-08-23 09:06:09',
                'Recipe' => '[{"variable":"THUNHAP_CHIUTHUE","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"TONG_GIAMTRU","type":"variable","value":null,"operator":"-","formular":[]}]',
            ),
            13 => 
            array (
                'Id' => '0479869f-4317-47f4-a1cb-2bb4008ed6ee',
                'Code' => 'TONG_THU_NHAP_TRONG_THANG',
                'Name' => 'Tổng thu nhập trong tháng',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-07 07:12:23',
                'LastModificationTime' => '2021-07-07 07:12:23',
                'Recipe' => '[{"variable":"TONG_THU_NHAP","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"SO_NGAY_CHUAN","type":"variable","value":null,"operator":"\\/","formular":[]},{"variable":"SO_NGAY_LAM_VIEC_TRONG_THANG","type":"variable","value":null,"operator":"*","formular":[]},{"variable":"PC_HT_TCSK","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"PC_BUS","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"PC_LEAD_LOP_HOC","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"THUONG_THANG_13","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"THUONG_KPI","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"TRUY_LINH","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"THUONG_DANH_GIA_CV","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"TOTAL_OT","type":"variable","value":null,"operator":"+","formular":[]}]',
            ),
            14 => 
            array (
                'Id' => '6dd0b39a-6f70-4639-a2a4-6dbae943d4e1',
                'Code' => 'GIAM_TRU_BAN_THAN_PHU_THUOC',
                'Name' => 'Giảm trừ bản thân và người phụ thuộc',
                'ApplyDate' => '2020-12-31',
                'CreationTime' => '2021-07-07 07:29:07',
                'LastModificationTime' => '2021-07-17 07:47:52',
                'Recipe' => '[{"type":"variable","variable":"TNCN_GIAM_TRU_BAN_THAN","value":null,"operator":null,"formular":[]},{"type":"variable","variable":"TNCN_GIAM_TRU_BAN_THAN","value":null,"operator":"+","formular":[]},{"type":"variable","variable":"SO_NGUOI_PHU_THUOC","value":null,"operator":"*","formular":[]}]',
            ),
            15 => 
            array (
                'Id' => 'e9abca87-792c-4632-b51f-9a919fe6ea5a',
                'Code' => 'PHI_CONG_DOAN',
                'Name' => 'Phí công đoàn',
                'ApplyDate' => '2021-04-04',
                'CreationTime' => '2021-07-27 09:27:41',
                'LastModificationTime' => '2021-07-27 09:27:41',
                'Recipe' => '[{"type":"variable","variable":"LUONG_CO_BAN","value":null,"operator":null,"formular":[]},{"type":"variable","variable":"TI_LE_PHI_CONG_DOAN","value":null,"operator":"*","formular":[]}]',
            ),
            16 => 
            array (
                'Id' => '88c9a3e1-45c5-454f-a5cd-5b504e76f62c',
                'Code' => 'LUONG_THEO_GIO',
                'Name' => 'Lương trên mỗi giờ làm việc',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 02:44:10',
                'LastModificationTime' => '2021-08-23 08:16:28',
                'Recipe' => '[{"variable":"LUONG_CB","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"SO_NGAY_CHUAN","type":"variable","value":null,"operator":"\\/","formular":[]},{"variable":null,"type":"value","value":8,"operator":"\\/","formular":[]}]',
            ),
            17 => 
            array (
                'Id' => '5b694da8-8731-40d8-9b5b-51d2af2c074a',
                'Code' => 'TONG_BH_NLD',
                'Name' => 'Tổng tiền bảo hiểm Người lao động đóng',
                'ApplyDate' => '2021-04-04',
                'CreationTime' => '2021-08-23 08:21:41',
                'LastModificationTime' => '2021-08-23 08:21:41',
                'Recipe' => '[{"type":"variable","variable":"BHXH_NLD","value":null,"operator":null,"formular":[]},{"type":"variable","variable":"BHYT_NLD","value":null,"operator":"+","formular":[]},{"type":"variable","variable":"BHTN_NLD","value":null,"operator":"+","formular":[]}]',
            ),
            18 => 
            array (
                'Id' => '0b8711e7-dec2-419b-8f42-377566542822',
                'Code' => 'TONG_BH_CTT',
                'Name' => 'Tổng tiền bảo hiểm Công ty trả',
                'ApplyDate' => '2021-04-04',
                'CreationTime' => '2021-08-23 08:21:49',
                'LastModificationTime' => '2021-08-23 08:21:49',
                'Recipe' => '[{"type":"variable","variable":"BHXH_CTT","value":null,"operator":null,"formular":[]},{"type":"variable","variable":"BHYT_CTT","value":null,"operator":"+","formular":[]},{"type":"variable","variable":"BHTN_CTT","value":null,"operator":"+","formular":[]}]',
            ),
            19 => 
            array (
                'Id' => '2f82c0ba-9506-4cc8-bac7-e88990243772',
                'Code' => 'TONG_PC',
                'Name' => 'Tổng tiền các khoản phụ cấp hàng tháng',
                'ApplyDate' => '2021-04-04',
                'CreationTime' => '2021-08-23 08:22:02',
                'LastModificationTime' => '2021-08-23 08:22:02',
                'Recipe' => '[{"type":"variable","variable":"PC_TRACH_NHIEM","value":null,"operator":null,"formular":[]},{"type":"variable","variable":"PC_XANG_XE","value":null,"operator":"+","formular":[]},{"type":"variable","variable":"PC_DONG_PHUC","value":null,"operator":"+","formular":[]},{"type":"variable","variable":"PC_CHUYEN_CAN","value":null,"operator":"+","formular":[]},{"type":"variable","variable":"PC_AN_TRUA","value":null,"operator":"+","formular":[]},{"type":"variable","variable":"PC_DIEN_THOAI","value":null,"operator":"+","formular":[]},{"type":"variable","variable":"PC_HT_TCSK","value":null,"operator":"+","formular":[]},{"type":"variable","variable":"PC_BUS","value":null,"operator":"+","formular":[]},{"type":"variable","variable":"PC_LEAD_LOP_HOC","value":null,"operator":"+","formular":[]},{"type":"variable","variable":"THUONG_THANG_13","value":null,"operator":"+","formular":[]},{"type":"variable","variable":"THUONG_KPI","value":null,"operator":"+","formular":[]},{"type":"variable","variable":"TRUY_LINH","value":null,"operator":"+","formular":[]},{"type":"variable","variable":"THUONG_DANH_GIA_CV","value":null,"operator":"+","formular":[]},{"type":"variable","variable":"PC_KHAC","value":null,"operator":"+","formular":[]}]',
            ),
            20 => 
            array (
                'Id' => 'ad69f9fc-756a-48ba-9d7b-8ab34c82e91e',
                'Code' => 'THUNHAP_CHIUTHUE',
                'Name' => 'Thu nhập chịu thuế',
                'ApplyDate' => '2021-04-04',
                'CreationTime' => '2021-08-23 08:22:20',
                'LastModificationTime' => '2021-08-23 08:22:20',
                'Recipe' => '[{"type":"variable","variable":"TONG_THUNHAP","value":null,"operator":null,"formular":[]},{"type":"variable","variable":"TONG_MIENTHUE","value":null,"operator":"-","formular":[]}]',
            ),
            21 => 
            array (
                'Id' => '853fb70d-ab4c-4572-b350-ee0e9f7c67ce',
                'Code' => 'TONG_MIENTHUE',
                'Name' => 'Tổng các khoản được miễn thuế',
                'ApplyDate' => '2021-04-04',
                'CreationTime' => '2021-08-23 08:22:28',
                'LastModificationTime' => '2021-08-23 08:22:28',
                'Recipe' => '[{"type":"variable","variable":"TONG_PC_HANGTHANG","value":null,"operator":null,"formular":[]},{"type":"variable","variable":"LUONG_OT_KHONGTINHTHUE","value":null,"operator":"+","formular":[]}]',
            ),
            22 => 
            array (
                'Id' => '6a0b2929-6dd7-4e2f-826c-d39f0faef266',
                'Code' => 'TONG_THUNHAP_NV_THU_VIEC',
                'Name' => 'Tổng các khoản thu nhập nhân viên thử việc',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-08-23 08:29:31',
                'LastModificationTime' => '2021-08-23 08:29:31',
                'Recipe' => '[{"variable":"TI_LE_THU_VIEC","type":"variable","value":null,"operator":null,"formular":[]},{"type":"formular","operator":"*","value":null,"variable":null,"formular":[{"type":"formular","operator":null,"value":null,"variable":null,"formular":[{"variable":"LUONG_CB","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"SO_NGAY_CHUAN","type":"variable","value":null,"operator":"\\/","formular":[]},{"variable":"SO_NGAY_LAM_VIEC_TRONG_THANG","type":"variable","value":null,"operator":"*","formular":[]}]},{"variable":"TONG_PC","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"TOTAL_OT","type":"variable","value":null,"operator":"+","formular":[]}]}]',
            ),
            23 => 
            array (
                'Id' => '5e98898d-d442-4a8a-b9c3-757b2754c17f',
                'Code' => 'TONG_THUNHAP_NV_CHINH_THUC',
                'Name' => 'Tổng thu nhập nhân viên chính thức',
                'ApplyDate' => '2021-04-04',
                'CreationTime' => '2021-08-23 08:30:14',
                'LastModificationTime' => '2021-08-23 08:30:14',
                'Recipe' => '[{"type":"formular","operator":null,"value":null,"variable":null,"formular":[{"variable":"LUONG_CO_BAN","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"SO_NGAY_CHUAN","type":"variable","value":null,"operator":"\\/","formular":[]},{"variable":"SO_NGAY_LAM_VIEC_TRONG_THANG","type":"variable","value":null,"operator":"*","formular":[]}]},{"variable":"TONG_PC","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"TOTAL_OT","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"THUONG","type":"variable","value":null,"operator":"+","formular":[]}]',
            ),
            24 => 
            array (
                'Id' => 'edcef5de-d4a4-42ac-8cf1-369f3ebd9be7',
                'Code' => 'TONG_GIAMTRU',
                'Name' => 'Tổng giảm trừ',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 04:07:57',
                'LastModificationTime' => '2021-08-23 09:01:42',
                'Recipe' => '[{"variable":"GIAMTRU_BANTHAN","type":"variable","value":null,"operator":null,"formular":[]},{"type":"formular","operator":"+","value":null,"variable":null,"formular":[{"variable":"GIAMTRU_PHUTHUOC","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"SO_NGUOIPHUTHUOC","type":"variable","value":null,"operator":"*","formular":[]}]},{"variable":"TONG_BH_NLD","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"DONG_GOP_TU_THIEN","type":"variable","value":null,"operator":"+","formular":[]}]',
            ),
        ));
        
        
    }
}