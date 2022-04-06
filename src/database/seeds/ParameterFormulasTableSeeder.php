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
                'Id' => 'ea7f61c2-fd56-42fe-9717-c1fdce894ca0',
                'Code' => 'OT_TINH_THUE',
                'Name' => 'Lương làm thêm tính thuế',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 02:53:15',
                'LastModificationTime' => '2021-07-01 02:53:15',
                'Recipe' => '[{"variable":"TOTAL_OT","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"OT_KHONG_TINH_THUE","type":"variable","value":null,"operator":"-","formular":[]}]',
            ),
            1 => 
            array (
                'Id' => 'f52be798-ba62-4a74-bd8d-d6ca26e17902',
                'Code' => 'PC_BUS',
                'Name' => 'Phụ cấp xe bus',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 02:53:53',
                'LastModificationTime' => '2021-07-01 02:53:53',
                'Recipe' => '[{"variable":"TIEN_DI_XE_BUS_GIO","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"SO_GIO_DI_XE_BUS","type":"variable","value":null,"operator":"*","formular":[]}]',
            ),
            2 => 
            array (
                'Id' => '88c9a3e1-45c5-454f-a5cd-5b504e76f62c',
                'Code' => 'LUONG_THEO_GIO',
                'Name' => 'Lương trên mỗi giờ làm việc',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 02:44:10',
                'LastModificationTime' => '2021-09-03 12:10:42',
                'Recipe' => '[{"variable":"LUONG_CB","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"SO_NGAY_CHUAN","type":"variable","value":null,"operator":"\\/","formular":[]},{"variable":null,"type":"value","value":8,"operator":"\\/","formular":[]}]',
            ),
            3 => 
            array (
                'Id' => 'c51faf3c-a87f-427b-a89c-d61adf98c08e',
                'Code' => 'BHXH_NLD',
                'Name' => 'BHXH Người lao động',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 02:57:25',
                'LastModificationTime' => '2021-09-03 12:16:42',
                'Recipe' => '[{"variable":null,"type":"formular","value":null,"operator":null,"formular":[{"variable":"LUONG_CB","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"PC_TRACH_NHIEM","type":"variable","value":null,"operator":"+","formular":[]}]},{"variable":"TI_LE_BHXH_NLD","type":"variable","value":null,"operator":"*","formular":[]}]',
            ),
            4 => 
            array (
                'Id' => '811d39c0-cbeb-4cfc-b25e-7da6d3499ea1',
                'Code' => 'BHYT_NLD',
                'Name' => 'BHYT Người lao động',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 02:57:56',
                'LastModificationTime' => '2021-09-03 12:17:36',
                'Recipe' => '[{"variable":null,"type":"formular","value":null,"operator":null,"formular":[{"variable":"LUONG_CB","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"PC_TRACH_NHIEM","type":"variable","value":null,"operator":"+","formular":[]}]},{"variable":"TI_LE_BHYT_NLD","type":"variable","value":null,"operator":"*","formular":[]}]',
            ),
            5 => 
            array (
                'Id' => 'e4045bdb-c115-4709-905e-33b30a9ab27d',
                'Code' => 'BHTN_NLD',
                'Name' => 'BHTN Người lao động',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 02:58:20',
                'LastModificationTime' => '2021-09-03 12:18:23',
                'Recipe' => '[{"variable":null,"type":"formular","value":null,"operator":null,"formular":[{"variable":"LUONG_CB","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"PC_TRACH_NHIEM","type":"variable","value":null,"operator":"+","formular":[]}]},{"variable":"TI_LE_BHTN_NLD","type":"variable","value":null,"operator":"*","formular":[]}]',
            ),
            6 => 
            array (
                'Id' => '4440fc0f-358a-4cbe-82a5-94f02f6539b4',
                'Code' => 'BHYT_CTT',
                'Name' => 'BHYT Công ty',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 03:00:40',
                'LastModificationTime' => '2021-09-03 12:21:40',
                'Recipe' => '[{"variable":null,"type":"formular","value":null,"operator":null,"formular":[{"variable":"LUONG_CB","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"PC_TRACH_NHIEM","type":"variable","value":null,"operator":"+","formular":[]}]},{"variable":"TI_LE_BHYT_CTT","type":"variable","value":null,"operator":"*","formular":[]}]',
            ),
            7 => 
            array (
                'Id' => 'bcee7c78-6078-4048-ac92-cfeaad8108d6',
                'Code' => 'BHXH_CTT',
                'Name' => 'BHXH Công ty',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 03:00:19',
                'LastModificationTime' => '2021-09-03 12:21:17',
                'Recipe' => '[{"variable":null,"type":"formular","value":null,"operator":null,"formular":[{"variable":"LUONG_CB","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"PC_TRACH_NHIEM","type":"variable","value":null,"operator":"+","formular":[]}]},{"variable":"TI_LE_BHXH_CTT","type":"variable","value":null,"operator":"*","formular":[]}]',
            ),
            8 => 
            array (
                'Id' => 'bc1db45e-56e1-4185-afe9-a05f499a71bc',
                'Code' => 'BHTN_CTT',
                'Name' => 'BHTN Công ty',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 03:01:02',
                'LastModificationTime' => '2021-09-03 12:22:00',
                'Recipe' => '[{"variable":null,"type":"formular","value":null,"operator":null,"formular":[{"variable":"LUONG_CB","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"PC_TRACH_NHIEM","type":"variable","value":null,"operator":"+","formular":[]}]},{"variable":"TI_LE_BHTN_CTT","type":"variable","value":null,"operator":"*","formular":[]}]',
            ),
            9 => 
            array (
                'Id' => 'd49c58b9-068a-4185-9513-8117c0478c2e',
                'Code' => 'TONG_BH_NLD',
                'Name' => 'Tổng tiền bảo hiểm Người lao động đóng',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-09-03 12:20:32',
                'LastModificationTime' => '2021-09-03 12:20:32',
                'Recipe' => '[{"variable":"BHXH_NLD","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"BHYT_NLD","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"BHTN_NLD","type":"variable","value":null,"operator":"+","formular":[]}]',
            ),
            10 => 
            array (
                'Id' => '96372254-826b-47ee-8134-7c37b4ccd06a',
                'Code' => 'TONG_BH_CTT',
                'Name' => 'Tổng tiền bảo hiểm Công ty trả',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-09-03 12:22:35',
                'LastModificationTime' => '2021-09-03 12:22:35',
                'Recipe' => '[{"variable":"BHXH_CTT","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"BHYT_CTT","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"BHTN_CTT","type":"variable","value":null,"operator":"+","formular":[]}]',
            ),
            11 => 
            array (
                'Id' => 'f2b0c15e-cddb-419f-8d00-95cddf6315b7',
                'Code' => 'PC_THEOHD',
                'Name' => 'Tổng tiền phụ cấp theo Hợp đồng',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-09-03 12:25:35',
                'LastModificationTime' => '2021-09-03 12:25:35',
                'Recipe' => '[{"variable":"PC_TRACH_NHIEM","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"PC_XANG_XE","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"PC_DONG_PHUC","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"PC_CHUYEN_CAN","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"PC_AN_TRUA","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"PC_DIEN_THOAI","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"PC_KHAC","type":"variable","value":null,"operator":"+","formular":[]}]',
            ),
            12 => 
            array (
                'Id' => '6b9501ca-4f0f-4257-9630-393991992630',
                'Code' => 'PC_HANGTHANG',
                'Name' => 'Tổng tiền các khoản phụ cấp hàng tháng',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-09-03 12:26:37',
                'LastModificationTime' => '2021-09-03 12:26:37',
                'Recipe' => '[{"variable":"PC_BUS","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"PC_HT_TCSK","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"PC_LEAD_LOP_HOC","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"THUONG_THANG_13","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"TRUY_LINH","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"THUONG_DANH_GIA_CV","type":"variable","value":null,"operator":"+","formular":[]}]',
            ),
            13 => 
            array (
                'Id' => 'dbf33d5a-9ea9-4086-a60d-6fece599236a',
                'Code' => 'TONG_THUNHAP',
                'Name' => 'Tổng thu nhập theo Hợp đồng',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 02:42:24',
                'LastModificationTime' => '2021-09-03 12:27:47',
                'Recipe' => '[{"variable":"LUONG_CB","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"PC_THEOHD","type":"variable","value":null,"operator":"+","formular":[]}]',
            ),
            14 => 
            array (
                'Id' => 'e9abca87-792c-4632-b51f-9a919fe6ea5a',
                'Code' => 'PHI_CONG_DOAN',
                'Name' => 'Phí công đoàn',
                'ApplyDate' => '2021-04-04',
                'CreationTime' => '2021-07-27 09:27:41',
                'LastModificationTime' => '2022-04-04 07:02:26',
                'Recipe' => '[{"variable":null,"type":"formular","value":null,"operator":null,"formular":[{"variable":"LUONG_CB","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"PC_TRACH_NHIEM","type":"variable","value":null,"operator":"+","formular":[]}]},{"variable":"TI_LE_PHI_CONG_DOAN","type":"variable","value":null,"operator":"*","formular":[]}]',
            ),
            15 => 
            array (
                'Id' => '9c450fd7-6a8a-43d8-9b11-787071bbe6d5',
                'Code' => 'THUNHAP_TINHTHUE',
                'Name' => 'Thu nhập tính thuế',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 03:12:12',
                'LastModificationTime' => '2021-09-03 12:39:16',
                'Recipe' => '[{"variable":"TONG_THUNHAP_TRONG_THANG","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"TONG_GIAMTRU","type":"variable","value":null,"operator":"-","formular":[]}]',
            ),
            16 => 
            array (
                'Id' => '5ff5869b-4136-4279-b0bd-7b534e1dafc5',
                'Code' => 'TONG_GIAMTRU_BANTHAN_PHUTHUOC',
                'Name' => 'Tổng giảm trừ bản thân và Người phụ thuộc',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-09-03 12:34:26',
                'LastModificationTime' => '2021-09-03 12:34:26',
                'Recipe' => '[{"variable":"GIAMTRU_BANTHAN","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"GIAMTRU_PHUTHUOC","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"SO_NGUOIPHUTHUOC","type":"variable","value":null,"operator":"*","formular":[]}]',
            ),
            17 => 
            array (
                'Id' => 'edcef5de-d4a4-42ac-8cf1-369f3ebd9be7',
                'Code' => 'TONG_GIAMTRU',
                'Name' => 'Tổng giảm trừ',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 04:07:57',
                'LastModificationTime' => '2021-10-27 09:24:52',
                'Recipe' => '[{"variable":"TONG_GIAMTRU_BANTHAN_PHUTHUOC","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"TONG_BH_NLD","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"DONG_GOP_TU_THIEN","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"OT_KHONG_TINH_THUE","type":"variable","value":null,"operator":"+","formular":[]},{"variable":null,"type":"formular","value":null,"operator":"+","formular":[{"variable":"PC_DIEN_THOAI","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"SO_NGAY_CHUAN","type":"variable","value":null,"operator":"\\/","formular":[]},{"variable":"SO_NGAY_LAM_VIEC_TRONG_THANG","type":"variable","value":null,"operator":"*","formular":[]}]},{"variable":"GIAMTRU_PC_AN_TRUA","type":"variable","value":null,"operator":"+","formular":[]},{"variable":null,"type":"formular","value":null,"operator":"+","formular":[{"variable":"PC_DONG_PHUC","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"SO_NGAY_CHUAN","type":"variable","value":null,"operator":"\\/","formular":[]},{"variable":"SO_NGAY_LAM_VIEC_TRONG_THANG","type":"variable","value":null,"operator":"*","formular":[]}]}]',
            ),
            18 => 
            array (
                'Id' => '113b7ef7-1bb2-4b0f-b220-c9d7d0639d83',
                'Code' => 'GIAMTRU_PC_AN_TRUA',
                'Name' => 'Tổng tiền phụ cấp ăn trưa được tính giảm trừ thuế TNCN',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-10-27 09:21:46',
                'LastModificationTime' => '2021-12-14 07:31:04',
                'Recipe' => '[{"variable":"PC_AN_TRUA","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"SO_NGAY_CHUAN","type":"variable","value":null,"operator":"\\/","formular":[]},{"variable":"SO_NGAY_LAM_VIEC_TRONG_THANG","type":"variable","value":null,"operator":"*","formular":[]}]',
            ),
            19 => 
            array (
                'Id' => 'f8ba0943-adb8-4861-92ed-0417845ed55c',
                'Code' => 'TONG_THUNHAP_TRONG_THANG_NV_CHINH_THUC',
                'Name' => 'Tổng các khoản thu nhập trong tháng nhân viên chính thức',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-09-03 12:30:49',
                'LastModificationTime' => '2022-04-04 06:47:10',
                'Recipe' => '[{"variable":null,"type":"formular","value":null,"operator":null,"formular":[{"variable":"TONG_THUNHAP","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"SO_NGAY_CHUAN","type":"variable","value":null,"operator":"/","formular":[]},{"variable":"SO_NGAY_LAM_VIEC_TRONG_THANG","type":"variable","value":null,"operator":"*","formular":[]}]},{"variable":"PC_HANGTHANG","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"THUONG_KPI","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"OT_TINH_THUE","type":"variable","value":null,"operator":"+","formular":[]}]',
            ),
            20 => 
            array (
                'Id' => '2502ac2e-de6a-407c-aa41-2ada26662f60',
                'Code' => 'TONG_THUNHAP_TRONG_THANG_NV_THU_VIEC',
                'Name' => 'Tổng các khoản thu nhập trong tháng nhân viên thử việc',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-09-03 12:32:44',
                'LastModificationTime' => '2022-04-04 07:02:50',
                'Recipe' => '[{"variable":null,"type":"formular","value":null,"operator":null,"formular":[{"variable":null,"type":"formular","value":null,"operator":null,"formular":[{"variable":"TONG_THUNHAP","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"SO_NGAY_CHUAN","type":"variable","value":null,"operator":"/","formular":[]},{"variable":"SO_NGAY_LAM_VIEC_TRONG_THANG","type":"variable","value":null,"operator":"*","formular":[]}]},{"variable":"TI_LE_THU_VIEC","type":"variable","value":null,"operator":"*","formular":[]}]},{"variable":"PC_HANGTHANG","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"THUONG_KPI","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"OT_TINH_THUE","type":"variable","value":null,"operator":"+","formular":[]}]',
            ),
            21 => 
            array (
                'Id' => '4de96879-cf90-44e8-9652-c843d3075220',
                'Code' => 'LUONG_THUC_NHAN',
                'Name' => 'Lương thực nhận',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 03:57:08',
                'LastModificationTime' => '2022-04-04 06:46:49',
                'Recipe' => '[{"variable":"TONG_THUNHAP_TRONG_THANG","type":"variable","value":null,"operator":null,"formular":[]},{"variable":null,"type":"formular","value":null,"operator":"-","formular":[{"variable":"TONG_BH_NLD","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"DIEU_CHINH_BHXH_NLD","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"THUE_TNCN","type":"variable","value":null,"operator":"+","formular":[]}]},{"variable":"THANH_TOAN_TU_BHXH","type":"variable","value":null,"operator":"-","formular":[]},{"variable":"OT_KHONG_TINH_THUE","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"SO_TIEN_TAM_UNG","type":"variable","value":null,"operator":"-","formular":[]}]',
            ),
            22 => 
            array (
                'Id' => 'e9e14831-b576-4ed3-82d6-b722620f535a',
                'Code' => 'OT_KHONG_TINH_THUE',
                'Name' => 'Lương làm thêm không tính thuế',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 02:49:41',
                'LastModificationTime' => '2021-12-17 07:58:50',
                'Recipe' => '[{"variable":"LUONG_THEO_GIO","type":"variable","value":null,"operator":null,"formular":[]},{"type":"formular","operator":"*","value":null,"variable":null,"formular":[{"type":"formular","operator":null,"value":null,"variable":null,"formular":[{"type":"formular","operator":null,"value":null,"variable":null,"formular":[{"variable":"TI_LE_OT_NGAY_THUONG","type":"variable","value":null,"operator":null,"formular":[]},{"variable":null,"type":"value","value":1,"operator":"-","formular":[]}]},{"variable":"SO_GIO_LAM_THEM_NGAY_THUONG","type":"variable","value":null,"operator":"*","formular":[]}]},{"type":"formular","operator":"+","value":null,"variable":null,"formular":[{"type":"formular","operator":null,"value":null,"variable":null,"formular":[{"variable":"TI_LE_OT_CUOI_TUAN","type":"variable","value":null,"operator":null,"formular":[]},{"variable":null,"type":"value","value":1,"operator":"-","formular":[]}]},{"variable":"SO_GIO_LAM_THEM_CUOI_TUAN","type":"variable","value":null,"operator":"*","formular":[]}]},{"type":"formular","operator":"+","value":null,"variable":null,"formular":[{"type":"formular","operator":null,"value":null,"variable":null,"formular":[{"variable":"TI_LE_OT_NGAY_LE","type":"variable","value":null,"operator":null,"formular":[]},{"variable":null,"type":"value","value":1,"operator":"-","formular":[]}]},{"variable":"SO_GIO_LAM_THEM_NGAY_LE","type":"variable","value":null,"operator":"*","formular":[]}]}]}]',
            ),
            23 => 
            array (
                'Id' => '2da828ce-4de3-4aa4-bf61-c1b97ab41e92',
                'Code' => 'TOTAL_OT',
                'Name' => 'Tổng lương làm thêm',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 02:45:57',
                'LastModificationTime' => '2022-04-04 06:43:31',
                'Recipe' => '[{"variable":"LUONG_THEO_GIO","type":"variable","value":null,"operator":null,"formular":[]},{"type":"formular","operator":"*","value":null,"variable":null,"formular":[{"type":"formular","operator":null,"value":null,"variable":null,"formular":[{"variable":"TI_LE_OT_NGAY_THUONG","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"SO_GIO_LAM_THEM_NGAY_THUONG","type":"variable","value":null,"operator":"*","formular":[]}]},{"type":"formular","operator":"+","value":null,"variable":null,"formular":[{"variable":"TI_LE_OT_CUOI_TUAN","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"SO_GIO_LAM_THEM_CUOI_TUAN","type":"variable","value":null,"operator":"*","formular":[]}]},{"type":"formular","operator":"+","value":null,"variable":null,"formular":[{"variable":"TI_LE_OT_NGAY_LE","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"SO_GIO_LAM_THEM_NGAY_LE","type":"variable","value":null,"operator":"*","formular":[]}]}]}]',
            ),
        ));
        
        
    }
}