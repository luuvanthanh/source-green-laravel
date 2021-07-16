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

        \DB::table('ParameterFormulas')->truncate();

        \DB::table('ParameterFormulas')->insert(array(
            0 => array(
                'Id' => 'dbf33d5a-9ea9-4086-a60d-6fece599236a',
                'Code' => 'TONG_THU_NHAP',
                'Name' => 'Tổng thu nhập',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 02:42:24',
                'LastModificationTime' => '2021-07-01 02:42:24',
                'Recipe' => '[{"variable":"TI_LE_THU_VIEC","type":"variable","value":null,"operator":null,"formular":[]},{"type":"formular","operator":"*","value":null,"variable":null,"formular":[{"variable":"LUONG_CO_BAN","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"PC_TRACH_NHIEM","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"PC_XANG_XE","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"PC_DONG_PHUC","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"PC_CHUYEN_CAN","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"PC_AN_TRUA","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"PC_DIEN_THOAI","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"PC_KHAC","type":"variable","value":null,"operator":"+","formular":[]}]}]',
            ),
            1 => array(
                'Id' => '88c9a3e1-45c5-454f-a5cd-5b504e76f62c',
                'Code' => 'LUONG_THEO_GIO',
                'Name' => 'Lương trên mỗi giờ làm việc',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 02:44:10',
                'LastModificationTime' => '2021-07-01 02:44:10',
                'Recipe' => '[{"variable":"TONG_THU_NHAP","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"SO_NGAY_CHUAN","type":"variable","value":null,"operator":"\\/","formular":[]},{"variable":null,"type":"value","value":8,"operator":"\\/","formular":[]}]',
            ),
            2 => array(
                'Id' => '2da828ce-4de3-4aa4-bf61-c1b97ab41e92',
                'Code' => 'TOTAL_OT',
                'Name' => 'Tổng lương làm thêm',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 02:45:57',
                'LastModificationTime' => '2021-07-01 02:45:57',
                'Recipe' => '[{"variable":"LUONG_THEO_GIO","type":"variable","value":null,"operator":null,"formular":[]},{"type":"formular","operator":"*","value":null,"variable":null,"formular":[{"type":"formular","operator":null,"value":null,"variable":null,"formular":[{"variable":"TI_LE_OT_NGAY_THUONG","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"SO_GIO_LAM_THEM_NGAY_THUONG","type":"variable","value":null,"operator":"*","formular":[]}]},{"type":"formular","operator":"+","value":null,"variable":null,"formular":[{"variable":"TI_LE_OT_CUOI_TUAN","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"SO_GIO_LAM_THEM_CUOI_TUAN","type":"variable","value":null,"operator":"*","formular":[]}]},{"type":"formular","operator":"+","value":null,"variable":null,"formular":[{"variable":"TI_LE_OT_NGAY_LE","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"SO_GIO_LAM_THEM_NGAY_LE","type":"variable","value":null,"operator":"*","formular":[]}]}]}]',
            ),
            3 => array(
                'Id' => 'e9e14831-b576-4ed3-82d6-b722620f535a',
                'Code' => 'OT_KHONG_TINH_THUE',
                'Name' => 'Lương làm thêm không tính thuế',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 02:49:41',
                'LastModificationTime' => '2021-07-01 02:49:41',
                'Recipe' => '[{"variable":"LUONG_THEO_GIO","type":"variable","value":null,"operator":null,"formular":[]},{"type":"formular","operator":"*","value":null,"variable":null,"formular":[{"type":"formular","operator":null,"value":null,"variable":null,"formular":[{"type":"formular","operator":null,"value":null,"variable":null,"formular":[{"variable":"TI_LE_OT_NGAY_THUONG","type":"variable","value":null,"operator":null,"formular":[]},{"variable":null,"type":"value","value":1,"operator":"-","formular":[]}]},{"variable":"SO_GIO_LAM_THEM_NGAY_THUONG","type":"variable","value":null,"operator":"*","formular":[]}]},{"type":"formular","operator":"+","value":null,"variable":null,"formular":[{"type":"formular","operator":null,"value":null,"variable":null,"formular":[{"variable":"TI_LE_OT_CUOI_TUAN","type":"variable","value":null,"operator":null,"formular":[]},{"variable":null,"type":"value","value":1,"operator":"-","formular":[]}]},{"variable":"SO_GIO_LAM_THEM_CUOI_TUAN","type":"variable","value":null,"operator":"*","formular":[]}]},{"type":"formular","operator":"+","value":null,"variable":null,"formular":[{"type":"formular","operator":null,"value":null,"variable":null,"formular":[{"variable":"TI_LE_OT_NGAY_LE","type":"variable","value":null,"operator":null,"formular":[]},{"variable":null,"type":"value","value":1,"operator":"-","formular":[]}]},{"variable":"SO_GIO_LAM_THEM_NGAY_LE","type":"variable","value":null,"operator":"*","formular":[]}]}]}]',
            ),
            4 => array(
                'Id' => 'ea7f61c2-fd56-42fe-9717-c1fdce894ca0',
                'Code' => 'OT_TINH_THUE',
                'Name' => 'Lương làm thêm tính thuế',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 02:53:15',
                'LastModificationTime' => '2021-07-01 02:53:15',
                'Recipe' => '[{"variable":"TOTAL_OT","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"OT_KHONG_TINH_THUE","type":"variable","value":null,"operator":"-","formular":[]}]',
            ),
            5 => array(
                'Id' => 'f52be798-ba62-4a74-bd8d-d6ca26e17902',
                'Code' => 'PC_BUS',
                'Name' => 'Phụ cấp xe bus',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 02:53:53',
                'LastModificationTime' => '2021-07-01 02:53:53',
                'Recipe' => '[{"variable":"TIEN_DI_XE_BUS_GIO","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"SO_GIO_DI_XE_BUS","type":"variable","value":null,"operator":"*","formular":[]}]',
            ),
            6 => array(
                'Id' => 'c51faf3c-a87f-427b-a89c-d61adf98c08e',
                'Code' => 'BHXH_NLD',
                'Name' => 'BHXH Người lao động',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 02:57:25',
                'LastModificationTime' => '2021-07-01 02:57:25',
                'Recipe' => '[{"variable":"LUONG_CO_BAN","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"TI_LE_BHXH_NLD","type":"variable","value":null,"operator":"*","formular":[]}]',
            ),
            7 => array(
                'Id' => '811d39c0-cbeb-4cfc-b25e-7da6d3499ea1',
                'Code' => 'BHYT_NLD',
                'Name' => 'BHYT Người lao động',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 02:57:56',
                'LastModificationTime' => '2021-07-01 02:57:56',
                'Recipe' => '[{"variable":"LUONG_CO_BAN","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"TI_LE_BHYT_NLD","type":"variable","value":null,"operator":"*","formular":[]}]',
            ),
            8 => array(
                'Id' => 'e4045bdb-c115-4709-905e-33b30a9ab27d',
                'Code' => 'BHTN_NLD',
                'Name' => 'BHTN Người lao động',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 02:58:20',
                'LastModificationTime' => '2021-07-01 02:58:20',
                'Recipe' => '[{"variable":"LUONG_CO_BAN","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"TI_LE_BHTN_NLD","type":"variable","value":null,"operator":"*","formular":[]}]',
            ),
            9 => array(
                'Id' => 'bcee7c78-6078-4048-ac92-cfeaad8108d6',
                'Code' => 'BHXH_CTT',
                'Name' => 'BHXH Công ty',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 03:00:19',
                'LastModificationTime' => '2021-07-01 03:00:19',
                'Recipe' => '[{"variable":"LUONG_CO_BAN","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"TI_LE_BHXH_CTT","type":"variable","value":null,"operator":"*","formular":[]}]',
            ),
            10 => array(
                'Id' => '4440fc0f-358a-4cbe-82a5-94f02f6539b4',
                'Code' => 'BHYT_CTT',
                'Name' => 'BHYT Công ty',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 03:00:40',
                'LastModificationTime' => '2021-07-01 03:00:40',
                'Recipe' => '[{"variable":"LUONG_CO_BAN","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"TI_LE_BHYT_CTT","type":"variable","value":null,"operator":"*","formular":[]}]',
            ),
            11 => array(
                'Id' => 'bc1db45e-56e1-4185-afe9-a05f499a71bc',
                'Code' => 'BHTN_CTT',
                'Name' => 'BHTN Công ty',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 03:01:02',
                'LastModificationTime' => '2021-07-01 03:01:02',
                'Recipe' => '[{"variable":"LUONG_CO_BAN","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"TI_LE_BHTN_CTT","type":"variable","value":null,"operator":"*","formular":[]}]',
            ),
            12 => array(
                'Id' => 'd629f56e-92d0-4d08-9fe9-9a457bd6db6b',
                'Code' => 'TNCN_GIAM_TRU_BAN_THAN',
                'Name' => 'Giảm trừ bản thân và người phụ thuộc',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 03:05:50',
                'LastModificationTime' => '2021-07-01 03:05:50',
                'Recipe' => '[{"variable":"TNCN_GIAM_TRU_BAN_THAN","type":"variable","value":null,"operator":null,"formular":[]},{"type":"formular","operator":"+","value":null,"variable":null,"formular":[{"variable":"TNCN_NGUOI_PHU_THUOC","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"SO_NGUOI_PHU_THUOC","type":"variable","value":null,"operator":"*","formular":[]}]}]',
            ),
            13 => array(
                'Id' => '9c450fd7-6a8a-43d8-9b11-787071bbe6d5',
                'Code' => 'THU_NHAP_TINH_THUE',
                'Name' => 'Thu nhập tính thuế',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 03:12:12',
                'LastModificationTime' => '2021-07-01 03:12:12',
                'Recipe' => '[{"variable":"TONG_THU_NHAP_TRONG_THANG","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"TONG_GIAM_TRU","type":"variable","value":null,"operator":"-","formular":[]}]',
            ),
            14 => array(
                'Id' => '4de96879-cf90-44e8-9652-c843d3075220',
                'Code' => 'LUONG_THUC_NHAN',
                'Name' => 'Lương thực nhận',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 03:57:08',
                'LastModificationTime' => '2021-07-01 03:57:08',
                'Recipe' => '[{"variable":"TONG_THU_NHAP","type":"variable","value":null,"operator":null,"formular":[]},{"type":"formular","operator":"-","value":null,"variable":null,"formular":[{"variable":"BHXH_NLD","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"BHYT_NLD","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"BHTN_NLD","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"DIEU_CHINH_BHXH_NLD","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"THUE_TNCN","type":"variable","value":null,"operator":"+","formular":[]}]},{"variable":"THANH_TOAN_TU_BHXH","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"OT_KHONG_TINH_THUE","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"SO_TIEN_TAM_UNG","type":"variable","value":null,"operator":"-","formular":[]}]',
            ),
            15 => array(
                'Id' => 'edcef5de-d4a4-42ac-8cf1-369f3ebd9be7',
                'Code' => 'TONG_GIAM_TRU',
                'Name' => 'Tổng giảm trừ',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-01 04:07:57',
                'LastModificationTime' => '2021-07-01 04:07:57',
                'Recipe' => '[{"variable":"BHXH_NLD","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"BHYT_NLD","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"BHTN_NLD","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"GIAM_TRU_BAN_THAN_PHU_THUOC","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"OT_KHONG_TINH_THUE","type":"variable","value":null,"operator":"+","formular":[]},{"type":"formular","operator":"+","value":null,"variable":null,"formular":[{"variable":"PC_DONG_PHUC","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"SO_NGAY_CHUAN","type":"variable","value":null,"operator":"\\/","formular":[]},{"variable":"SO_NGAY_LAM_VIEC_TRONG_THANG","type":"variable","value":null,"operator":"*","formular":[]}]},{"type":"formular","operator":"+","value":null,"variable":null,"formular":[{"variable":"PC_AN_TRUA","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"SO_NGAY_CHUAN","type":"variable","value":null,"operator":"\\/","formular":[]},{"variable":"SO_NGAY_LAM_VIEC_TRONG_THANG","type":"variable","value":null,"operator":"*","formular":[]}]}]',
            ),
            16 => array(
                'Id' => '0479869f-4317-47f4-a1cb-2bb4008ed6ee',
                'Code' => 'TONG_THU_NHAP_TRONG_THANG',
                'Name' => 'Tổng thu nhập trong tháng',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-07 07:12:23',
                'LastModificationTime' => '2021-07-07 07:12:23',
                'Recipe' => '[{"variable":"TONG_THU_NHAP","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"SO_NGAY_CHUAN","type":"variable","value":null,"operator":"\\/","formular":[]},{"variable":"SO_NGAY_LAM_VIEC_TRONG_THANG","type":"variable","value":null,"operator":"*","formular":[]},{"variable":"PC_HT_TCSK","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"PC_BUS","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"PC_LEAD_LOP_HOC","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"THUONG_THANG_13","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"THUONG_KPI","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"TRUY_LINH","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"THUONG_DANH_GIA_CV","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"TOTAL_OT","type":"variable","value":null,"operator":"+","formular":[]}]',
            ),
            17 => array(
                'Id' => '6dd0b39a-6f70-4639-a2a4-6dbae943d4e1',
                'Code' => 'GIAM_TRU_BAN_THAN_PHU_THUOC',
                'Name' => 'Giảm trừ bản thân và người phụ thuộc',
                'ApplyDate' => '2021-01-01',
                'CreationTime' => '2021-07-07 07:29:07',
                'LastModificationTime' => '2021-07-07 07:29:07',
                'Recipe' => '[{"variable":"TNCN_GIAM_TRU_BAN_THAN","type":"variable","value":null,"operator":null,"formular":[]},{"variable":"TNCN_GIAM_TRU_BAN_THAN","type":"variable","value":null,"operator":"+","formular":[]},{"variable":"SO_NGUOI_PHU_THUOC","type":"variable","value":null,"operator":"*","formular":[]}]',
            ),
        ));

    }
}
