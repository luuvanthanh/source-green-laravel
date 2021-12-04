<?php

/*
 * You can place your custom package configuration in here.
 */
return [
    'MODEL_COLLECTIONS' => [
        "GGPHP\Camera\Models\Camera" => "Camera",
        "GGPHP\Camera\Models\CameraGeneralProperties" => "Thông tin chung camera",
        "GGPHP\Camera\Models\CameraCollection" => "Nhóm camera",
        "GGPHP\Camera\Models\CameraPtzProperties" => "Thông tin ptz camera",
        "GGPHP\Camera\Models\CameraVideoProperties" => "Thông số camera",
        "GGPHP\CameraServer\Models\CameraServer" => "Camera Server",
        "GGPHP\Category\Models\CardType" => "Loại thẻ hướng dẫn viên",
        "GGPHP\Category\Models\EventType" => "Loại sự kiện",
        "GGPHP\Category\Models\Language" => "Ngôn ngữ",
        "GGPHP\Category\Models\ObjectType" => "Loại đối tượng",
        "GGPHP\Category\Models\Province" => "Tỉnh cấp thẻ",
        "GGPHP\Category\Models\TouristDestination" => "Khu điểm du lịch",
        "GGPHP\Collection\Models\Collection" => "Nhóm camera",
        "GGPHP\Event\Models\Event" => "Sự kiện",
        "GGPHP\Event\Models\EventHandle" => "Xử lý sự kiện",
        "GGPHP\Event\Models\EventHandleResult" => "Kết quả xử lý sự kiện",
        "GGPHP\NumberOfTourist\Models\NumberOfTourist" => "Số lượng khách vào ra",
        "GGPHP\RolePermission\Models\Role" => "Vai trò",
        "GGPHP\RolePermission\Models\Permission" => "Quyền",
        "GGPHP\TourGuide\Models\TourGuide" => "Đối tượng",
        "GGPHP\TourGuide\Models\TourGuideAdditionalInformation" => "Thông tin bổ sung đối tượng",
        "GGPHP\TravelAgency\Models\TravelAgency" => "Doanh nghiệp lữ hành",
        "GGPHP\TravelAgency\Models\TravelAgencieTourGuide" => "Hướng dẫn viên thuộc doanh nghiệp lữ hành",
        "GGPHP\Users\Models\User" => "Người dùng",
        "GGPHP\VideoWall\Models\VideoWall" => "Video wall",
    ],
    'ACTION_COLLECTIONS' => [
        'created' => 'Thêm mới',
        'updated' => 'Cập nhật',
        'deleted' => 'Xóa',
        'restored' => 'Khôi phục',
    ],
];
