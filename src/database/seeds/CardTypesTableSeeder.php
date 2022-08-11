<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class CardTypesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('card_types')->delete();
        
        \DB::table('card_types')->insert(array (
            0 => 
            array (
                'id' => 'babee3af-d5a4-4906-80f3-a70f115e96f9',
            'color' => 'Hồng cánh sen (Mã: C = 0, M = 100, Y = 0, K = 0), trắng',
                'name' => 'Thẻ HDV du lịch quốc tế',
                'scope_of_practice' => 'Hướng dẫn cho khách du lịch nội địa là công dân Việt Nam trong phạm vi toàn quốc',
                'duration' => '05 năm',
            'condition' => 'a) Có Quốc tịch Việt Nam, thường trú tại Việt Nam;b) Có năng lực hành vi dân sự đầy đủ;c) Không mắc bệnh truyền nhiễm, không sử dụng chất ma túy;d) Tốt nghiệp trung cấp trở lên chuyên ngành hướng dẫn du lịch; trường hợp tốt nghiệp trung cấp trở lên chuyên ngành khác phải có chứng chỉ nghiệp vụ hướng dẫn du lịch nội địa.',
        'application_form_for_card' => 'a) Đơn đề nghị cấp thẻ hướng dẫn viên du lịch theo mẫu do Bộ trưởng Bộ Văn hóa, Thể thao và Du lịch quy định;b) Sơ yếu lý lịch có xác nhận của Ủy ban nhân dân cấp xã nơi cư trú;c) Bản sao có chứng thực các văn bằng, chứng chỉ tương ứng với điều kiện quy định tại điểm d) phần 4. Điều kiện cấp thẻd) Giấy chứng nhận sức khỏe do cơ sở khám bệnh, chữa bệnh có thẩm quyền cấp trong thời hạn không quá 06 tháng tính đến thời điểm nộp hồ sơ;e) 02 ảnh chân dung màu cỡ 3cm x 4cm.',
    'sequence' => 'a) Người đề nghị cấp thẻ hướng dẫn viên du lịch nộp 01 bộ hồ sơ đến cơ quan chuyên môn về du lịch cấp tỉnh;b) Trong thời hạn 15 ngày kể từ ngày nhận được hồ sơ hợp lệ, cơ quan chuyên môn về du lịch cấp tỉnh cấp thẻ hướng dẫn viên du lịch cho người đề nghị; trường hợp từ chối, phải trả lời bằng văn bản và nêu rõ lý do.',
    'created_at' => '2021-11-26 15:10:12',
    'updated_at' => '2021-11-26 15:10:12',
    'deleted_at' => NULL,
),
1 => 
array (
    'id' => 'cb5aa272-6274-4f8e-8253-abe36e5cb5e4',
'color' => 'Xanh nước biển (Mã: C = 85, M = 50, Y = 0, K = 0), trắng',
    'name' => 'Thẻ HDV du lịch nội địa',
    'scope_of_practice' => 'Hướng dẫn cho khách du lịch nội địa, khách du lịch quốc tế đến Việt Nam trong phạm vi toàn quốc và đưa khách du lịch ra nước ngoài',
    'duration' => '05 năm',
'condition' => 'a) Có Quốc tịch Việt Nam, thường trú tại Việt Nam;b) Có năng lực hành vi dân sự đầy đủ;c) Không mắc bệnh truyền nhiễm, không sử dụng chất ma túy;d) Tốt nghiệp trung cấp trở lên chuyên ngành hướng dẫn du lịch; trường hợp tốt nghiệp trung cấp trở lên chuyên ngành khác phải có chứng chỉ nghiệp vụ hướng dẫn du lịch nội địa.',
'application_form_for_card' => 'a) Đơn đề nghị cấp thẻ hướng dẫn viên du lịch theo mẫu do Bộ trưởng Bộ Văn hóa, Thể thao và Du lịch quy định;b) Sơ yếu lý lịch có xác nhận của Ủy ban nhân dân cấp xã nơi cư trú;c) Bản sao có chứng thực các văn bằng, chứng chỉ tương ứng với điều kiện quy định tại điểm d) phần 4. Điều kiện cấp thẻd) Giấy chứng nhận sức khỏe do cơ sở khám bệnh, chữa bệnh có thẩm quyền cấp trong thời hạn không quá 06 tháng tính đến thời điểm nộp hồ sơ;e) 02 ảnh chân dung màu cỡ 3cm x 4cm.',
'sequence' => 'a) Người đề nghị cấp thẻ hướng dẫn viên du lịch nộp 01 bộ hồ sơ đến cơ quan chuyên môn về du lịch cấp tỉnh;b) Trong thời hạn 15 ngày kể từ ngày nhận được hồ sơ hợp lệ, cơ quan chuyên môn về du lịch cấp tỉnh cấp thẻ hướng dẫn viên du lịch cho người đề nghị; trường hợp từ chối, phải trả lời bằng văn bản và nêu rõ lý do.',
'created_at' => '2021-11-26 15:10:44',
'updated_at' => '2021-11-26 15:10:44',
'deleted_at' => NULL,
),
2 => 
array (
'id' => '5b14f909-c66d-4d22-a124-42b32b54893c',
'color' => 'Hướng dẫn cho khách du lịch trong phạm vi khu du lịch, điểm du lịch',
'name' => 'Vàng cam (Mã: C = 0, M = 80, Y = 95, K = 0), trắng',
'scope_of_practice' => 'Hướng dẫn cho khách du lịch nội địa, khách du lịch quốc tế đến Việt Nam trong phạm vi toàn quốc và đưa khách du lịch ra nước ngoài',
'duration' => 'Không có',
'condition' => 'a) Có Quốc tịch Việt Nam, thường trú tại Việt Nam;b) Có năng lực hành vi dân sự đầy đủ;c) Không mắc bệnh truyền nhiễm, không sử dụng chất ma túy;d) Tốt nghiệp trung cấp trở lên chuyên ngành hướng dẫn du lịch; trường hợp tốt nghiệp trung cấp trở lên chuyên ngành khác phải có chứng chỉ nghiệp vụ hướng dẫn du lịch nội địa.',
'application_form_for_card' => 'a) Đơn đề nghị cấp thẻ hướng dẫn viên du lịch theo mẫu do Bộ trưởng Bộ Văn hóa, Thể thao và Du lịch quy định;b) Sơ yếu lý lịch có xác nhận của Ủy ban nhân dân cấp xã nơi cư trú;c) Bản sao có chứng thực các văn bằng, chứng chỉ tương ứng với điều kiện quy định tại điểm d) phần 4. Điều kiện cấp thẻd) Giấy chứng nhận sức khỏe do cơ sở khám bệnh, chữa bệnh có thẩm quyền cấp trong thời hạn không quá 06 tháng tính đến thời điểm nộp hồ sơ;e) 02 ảnh chân dung màu cỡ 3cm x 4cm.',
'sequence' => 'a) Người đề nghị cấp thẻ hướng dẫn viên du lịch nộp 01 bộ hồ sơ đến cơ quan chuyên môn về du lịch cấp tỉnh;b) Trong thời hạn 15 ngày kể từ ngày nhận được hồ sơ hợp lệ, cơ quan chuyên môn về du lịch cấp tỉnh cấp thẻ hướng dẫn viên du lịch cho người đề nghị; trường hợp từ chối, phải trả lời bằng văn bản và nêu rõ lý do.',
'created_at' => '2021-11-26 15:11:09',
'updated_at' => '2021-11-26 15:11:09',
'deleted_at' => NULL,
),
));
        
        
    }
}