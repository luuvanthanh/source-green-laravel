<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ListConfigTeamplateEmailTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {


        \DB::table('list_config_teamplate_email')->delete();

        \DB::table('list_config_teamplate_email')->insert(array(
            0 =>
            array(
                'id' => '9f67c47a-af51-4453-8bc8-e595159cedfa',
                'system_config_id' => 'fa19e2b6-fa02-47d8-90ec-017e79bf893f',
                'name' => 'Cảnh báo HDV du lịch đến khu điểm',
                'code' => 'HDVHP',
                'is_on' => "1",
                'title' => 'Cảnh báo HDV du lịch đến khu điểm',
                'content' => '<div>Kính gửi anh/chị {{tennguoidung}},</div><div><br></div><div>Đối tượng Blacklist {{tendoituong}} đã xuất hiện tại {{tenkhudiem}}. Anh/chị vui lòng truy cập vào đây để xem chi tiết.</div><div><br></div><div>Trân trọng,</div><div>Hệ thống Giám sát du lịch thông minh</div><div>Số điện thoại hỗ trợ: 09xxxxxxxx</div>',
                'created_at' => '2022-02-24 14:18:14',
                'updated_at' => '2022-02-24 14:41:38',
            ),
            1 =>
            array(
                'id' => '62e9966b-9dd7-45a1-9e6a-2765d97c66f5',
                'system_config_id' => 'fa19e2b6-fa02-47d8-90ec-017e79bf893f',
                'name' => 'Cảnh báo HDV bất hợp pháp đến khu điểm',
                'code' => 'HDVBHP',
                'is_on' => "0",
                'title' => 'Cảnh báo HDV bất hợp pháp đến khu điểm',
                'content' => '<div>Kính gửi anh/chị {{tennguoidung}},</div><div><br></div><div>Đối tượng Blacklist {{tendoituong}} đã xuất hiện tại {{tenkhudiem}}. Anh/chị vui lòng truy cập vào đây để xem chi tiết.</div><div><br></div><div>Trân trọng,</div><div>Hệ thống Giám sát du lịch thông minh</div><div>Số điện thoại hỗ trợ: 09xxxxxxxx</div>',
                'created_at' => '2022-02-24 15:21:04',
                'updated_at' => '2022-02-24 15:21:04',
            ),
            2 =>
            array(
                'id' => '99bbb44d-1c7e-49b5-a3e9-44be8b0e43ea',
                'system_config_id' => 'fa19e2b6-fa02-47d8-90ec-017e79bf893f',
                'name' => 'Cảnh báo đối tượng Blacklist xuất hiện tại khu điểm',
                'code' => 'BL',
                'is_on' => "0",
                'title' => 'Cảnh báo đối tượng Blacklist xuất hiện tại khu điểm',
                'content' => '<div>Kính gửi anh/chị {{tennguoidung}},</div><div><br></div><div>Đối tượng Blacklist {{tendoituong}} đã xuất hiện tại {{tenkhudiem}}. Anh/chị vui lòng truy cập vào đây để xem chi tiết.</div><div><br></div><div>Trân trọng,</div><div>Hệ thống Giám sát du lịch thông minh</div><div>Số điện thoại hỗ trợ: 09xxxxxxxx</div>',
                'created_at' => '2022-02-24 15:21:43',
                'updated_at' => '2022-02-24 15:21:43',
            ),
            3 =>
            array(
                'id' => '34f0b012-8296-410c-80c1-df34a71e085a',
                'system_config_id' => 'fa19e2b6-fa02-47d8-90ec-017e79bf893f',
                'name' => 'Cảnh báo phát hiện bán hàng rong tại khu điểm',
                'code' => 'BHR',
                'is_on' => "0",
                'title' => 'Cảnh báo phát hiện bán hàng rong tại khu điểm',
                'content' => '<div>Kính gửi anh/chị {{tennguoidung}},</div><div><br></div><div>Đối tượng Blacklist {{tendoituong}} đã xuất hiện tại {{tenkhudiem}}. Anh/chị vui lòng truy cập vào đây để xem chi tiết.</div><div><br></div><div>Trân trọng,</div><div>Hệ thống Giám sát du lịch thông minh</div><div>Số điện thoại hỗ trợ: 09xxxxxxxx</div>',
                'created_at' => '2022-02-24 15:22:00',
                'updated_at' => '2022-02-24 15:22:00',
            ),
            4 =>
            array(
                'id' => 'df8baad6-1177-4cbb-aa5d-9bd6c106443e',
                'system_config_id' => 'fa19e2b6-fa02-47d8-90ec-017e79bf893f',
                'name' => 'Cảnh báo phát hiện Nghi ngờ là HDV tại khu điểm',
                'code' => 'NNHDV',
                'is_on' => "0",
                'title' => 'Cảnh báo phát hiện Nghi ngờ là HDV tại khu điểm',
                'content' => '<div>Kính gửi anh/chị {{tennguoidung}},</div><div><br></div><div>Đối tượng Blacklist {{tendoituong}} đã xuất hiện tại {{tenkhudiem}}. Anh/chị vui lòng truy cập vào đây để xem chi tiết.</div><div><br></div><div>Trân trọng,</div><div>Hệ thống Giám sát du lịch thông minh</div><div>Số điện thoại hỗ trợ: 09xxxxxxxx</div>',
                'created_at' => '2022-02-24 15:22:30',
                'updated_at' => '2022-02-24 15:22:30',
            ),
            5 =>
            array(
                'id' => 'ef90fbc0-279f-48f7-b67d-aba00cd2b696',
                'system_config_id' => 'fa19e2b6-fa02-47d8-90ec-017e79bf893f',
                'name' => 'Cảnh báo phát hiện Hành vi hướng dẫn tại khu điểm',
                'code' => 'HVHD',
                'is_on' => "0",
                'title' => 'Cảnh báo phát hiện Hành vi hướng dẫn tại khu điểm',
                'content' => '<div>Kính gửi anh/chị {{tennguoidung}},</div><div><br></div><div>Đối tượng Blacklist {{tendoituong}} đã xuất hiện tại {{tenkhudiem}}. Anh/chị vui lòng truy cập vào đây để xem chi tiết.</div><div><br></div><div>Trân trọng,</div><div>Hệ thống Giám sát du lịch thông minh</div><div>Số điện thoại hỗ trợ: 09xxxxxxxx</div>',
                'created_at' => '2022-02-24 15:22:55',
                'updated_at' => '2022-02-24 15:22:55',
            ),
            6 =>
            array(
                'id' => 'b0936207-960d-4e77-b49a-9c5626e318d5',
                'system_config_id' => 'fa19e2b6-fa02-47d8-90ec-017e79bf893f',
                'name' => 'Cảnh báo phát hiện rác tại khu điểm',
                'code' => 'RAC',
                'is_on' => "0",
                'title' => 'Cảnh báo phát hiện rác tại khu điểm',
                'content' => '<div>Kính gửi anh/chị {{tennguoidung}},</div><div><br></div><div>Đối tượng Blacklist {{tendoituong}} đã xuất hiện tại {{tenkhudiem}}. Anh/chị vui lòng truy cập vào đây để xem chi tiết.</div><div><br></div><div>Trân trọng,</div><div>Hệ thống Giám sát du lịch thông minh</div><div>Số điện thoại hỗ trợ: 09xxxxxxxx</div>',
                'created_at' => '2022-02-24 15:23:38',
                'updated_at' => '2022-02-24 15:23:38',
            ),
            7 =>
            array(
                'id' => '99239481-b2fc-40c9-98d3-c80f165e1275',
                'system_config_id' => 'fa19e2b6-fa02-47d8-90ec-017e79bf893f',
                'name' => 'Cảnh báo số lượng khách tại Khu điểm',
                'code' => 'SLK',
                'is_on' => "0",
                'title' => 'Cảnh báo số lượng khách tại Khu điểm',
                'content' => '<div>Kính gửi anh/chị {{tennguoidung}},</div><div><br></div><div>Đối tượng Blacklist {{tendoituong}} đã xuất hiện tại {{tenkhudiem}}. Anh/chị vui lòng truy cập vào đây để xem chi tiết.</div><div><br></div><div>Trân trọng,</div><div>Hệ thống Giám sát du lịch thông minh</div><div>Số điện thoại hỗ trợ: 09xxxxxxxx</div>',
                'created_at' => '2022-02-24 15:23:58',
                'updated_at' => '2022-02-24 15:23:58',
            ),
            8 =>
            array(
                'id' => 'f2fbae45-17d1-409e-a788-a937f9ce10c1',
                'system_config_id' => 'fa19e2b6-fa02-47d8-90ec-017e79bf893f',
                'name' => 'Thông báo khi du khách gửi đánh giá khảo sát',
                'code' => 'KSDG',
                'is_on' => "0",
                'title' => 'Thông báo khi du khách gửi đánh giá khảo sát',
                'content' => '<div>Kính gửi anh/chị {{tennguoidung}},</div><div><br></div><div>Đối tượng Blacklist {{tendoituong}} đã xuất hiện tại {{tenkhudiem}}. Anh/chị vui lòng truy cập vào đây để xem chi tiết.</div><div><br></div><div>Trân trọng,</div><div>Hệ thống Giám sát du lịch thông minh</div><div>Số điện thoại hỗ trợ: 09xxxxxxxx</div>',
                'created_at' => '2022-02-24 15:24:28',
                'updated_at' => '2022-02-24 15:24:28',
            ),
            9 =>
            array(
                'id' => 'e988e33f-e35b-4ea8-8bbc-fc1036ba262d',
                'system_config_id' => 'fa19e2b6-fa02-47d8-90ec-017e79bf893f',
                'name' => 'Đặt lại mật khẩu',
                'code' => 'DLMK',
                'is_on' => "0",
                'title' => 'Đặt lại mật khẩu',
                'content' => '<div>Kính gửi anh/chị {{tennguoidung}},</div><div><br></div><div>Đối tượng Blacklist {{tendoituong}} đã xuất hiện tại {{tenkhudiem}}. Anh/chị vui lòng truy cập vào đây để xem chi tiết.</div><div><br></div><div>Trân trọng,</div><div>Hệ thống Giám sát du lịch thông minh</div><div>Số điện thoại hỗ trợ: 09xxxxxxxx</div>',
                'created_at' => '2022-02-24 15:24:51',
                'updated_at' => '2022-02-24 15:24:51',
            ),
            10 =>
            array(
                'id' => '450ad3a2-eed2-4a47-b177-03bb69037afa',
                'system_config_id' => 'fa19e2b6-fa02-47d8-90ec-017e79bf893f',
                'name' => 'Khoá tài khoản',
                'code' => 'KTK',
                'is_on' => "0",
                'title' => 'Khoá tài khoản',
                'content' => '<div>Kính gửi anh/chị {{tennguoidung}},</div><div><br></div><div>Đối tượng Blacklist {{tendoituong}} đã xuất hiện tại {{tenkhudiem}}. Anh/chị vui lòng truy cập vào đây để xem chi tiết.</div><div><br></div><div>Trân trọng,</div><div>Hệ thống Giám sát du lịch thông minh</div><div>Số điện thoại hỗ trợ: 09xxxxxxxx</div>',
                'created_at' => '2022-02-24 15:25:10',
                'updated_at' => '2022-02-24 15:25:10',
            ),
            11 =>
            array(
                'id' => '8b41508b-cd21-4ab4-9fcf-df513ce483c7',
                'system_config_id' => 'fa19e2b6-fa02-47d8-90ec-017e79bf893f',
                'name' => 'Mở khoá tài khoản',
                'code' => 'MKTK',
                'is_on' => "0",
                'title' => 'Mở khoá tài khoản',
                'content' => '<div>Kính gửi anh/chị {{tennguoidung}},</div><div><br></div><div>Đối tượng Blacklist {{tendoituong}} đã xuất hiện tại {{tenkhudiem}}. Anh/chị vui lòng truy cập vào đây để xem chi tiết.</div><div><br></div><div>Trân trọng,</div><div>Hệ thống Giám sát du lịch thông minh</div><div>Số điện thoại hỗ trợ: 09xxxxxxxx</div>',
                'created_at' => '2022-02-24 15:25:35',
                'updated_at' => '2022-02-24 15:25:35',
            ),
        ));
    }
}
