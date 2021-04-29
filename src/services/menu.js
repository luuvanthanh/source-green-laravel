export async function getLeftMenuData() {
  return [
    {
      title: 'Tiêu chí - Đánh giá',
      key: 'category',
      url: [
        '/tieu-chi-danh-gia/danh-gia-hoc-tap',
        '/tieu-chi-danh-gia/danh-gia-hoc-tap/tao-moi',
        '/tieu-chi-danh-gia/luong-nuoc-uong',
      ],
      icon: 'icon icon-criteria',
      permission: [],
      pro: true,
    },
    {
      title: 'Thời khóa biểu',
      key: 'calendar',
      url: ['/thoi-khoa-bieu', '/thoi-khoa-bieu/tao-moi'],
      icon: 'icon icon-schedules',
      permission: [],
      pro: true,
      plus: false,
    },
    {
      title: 'Thực đơn',
      key: 'menu',
      url: ['/thuc-don', '/thuc-don/tao-moi'],
      icon: 'icon icon-menu',
      permission: [],
      pro: true,
      plus: false,
    },
    {
      title: 'Khảo sát',
      key: 'survey',
      url: ['/khao-sat', '/khao-sat/tao-moi'],
      icon: 'icon icon-survey',
      permission: [],
      pro: true,
      plus: false,
    },
    {
      title: 'Quản lý xe bus',
      key: 'vehicle',
      url: [
        '/quan-ly-phuong-tien/xe',
        '/quan-ly-phuong-tien/xe/tao-moi',
        '/quan-ly-phuong-tien/quan-ly-lo-trinh',
        '/quan-ly-phuong-tien/quan-ly-lo-trinh/tao-moi',
      ],
      icon: 'icon icon-calendar1',
      permission: [],
      pro: true,
    },
    {
      title: 'Quản lý Điểm / Trường / Chi nhánh (Business unit)',
      key: 'branch',
      url: ['/co-so', '/co-so/tao-moi'],
      icon: 'icon icon-school',
      permission: [],
      pro: true,
    },
    {
      title: 'Môn học',
      key: 'subjects',
      url: ['/mon-hoc', '/mon-hoc/tao-moi'],
      icon: 'icon icon-subjects',
      permission: [],
      pro: true,
    },
    {
      title: 'Lớp học',
      key: 'class',
      url: [
        '/quan-ly/lop-hoc',
        '/quan-ly/lop-hoc/tao-moi',
        '/quan-ly/lich-hoc',
        '/quan-ly/lich-hoc/tao-moi',
      ],
      icon: 'icon icon-calendar1',
      permission: [],
      pro: true,
    },
    {
      title: 'Hồ sơ đối tượng',
      key: 'profiles',
      url: [
        '/ho-so-doi-tuong/phu-huynh',
        '/ho-so-doi-tuong/phu-huynh/tao-moi',
        '/ho-so-doi-tuong/hoc-sinh',
        '/ho-so-doi-tuong/hoc-sinh/tao-moi',
        '/ho-so-doi-tuong/nhan-su',
        '/ho-so-doi-tuong/nhan-su/tao-moi',
      ],
      icon: 'icon icon-user-group',
      permission: [],
      pro: true,
    },
    {
      title: 'Dặn thuốc',
      key: 'remommend',
      url: ['/dan-thuoc'],
      icon: 'icon icon-advice',
      permission: [],
      pro: true,
    },
  ];
}
export async function getLeftMenuExchange() {
  return [
    {
      title: 'Cần duyệt',
      key: 'approve',
      url: ['/trao-doi/can-duyet'],
      icon: 'icon icon-checkmark',
      permission: [],
      pro: true,
    },
    {
      title: 'Danh sách',
      key: 'items',
      url: ['/trao-doi/danh-sach', '/trao-doi/tao-moi', '/trao-doi/:id/chi-tiet'],
      icon: 'icon icon-list',
      permission: [],
      pro: true,
    },
    {
      title: 'Thông báo',
      key: 'notifications',
      url: ['/trao-doi/thong-bao'],
      icon: 'icon icon-notification',
      permission: [],
      pro: true,
    },
    {
      title: 'Cấu hình',
      key: 'settings',
      url: ['/trao-doi/cai-dat'],
      icon: 'icon icon-setting',
      permission: [],
      pro: true,
    },
  ];
}
export async function getLeftMenuProfile() {
  return [
    {
      title: 'Học sinh',
      key: 'children',
      url: [
        '/ho-so-doi-tuong/hoc-sinh',
        '/ho-so-doi-tuong/hoc-sinh/tao-moi',
        '/ho-so-doi-tuong/hoc-sinh/:id/chi-tiet',
      ],
      icon: 'icon icon-baby',
      permission: [],
      pro: true,
    },
    {
      title: 'Phụ huynh',
      key: 'parents',
      url: [
        '/ho-so-doi-tuong/phu-huynh',
        '/ho-so-doi-tuong/phu-huynh/tao-moi',
        '/ho-so-doi-tuong/phu-huynh/:id/chi-tiet',
      ],
      icon: 'icon icon-woman',
      permission: [],
      pro: true,
    },
    {
      title: 'Hồ sơ đã lưu trữ',
      key: 'stores',
      icon: 'icon icon-fileText',
      permission: [],
      children: [
        {
          title: 'Học sinh',
          key: 'storeStudents',
          url: ['/ho-so-doi-tuong/hoc-sinh/luu-tru'],
          permission: [],
          pro: true,
        },
        {
          title: 'Phụ huynh',
          key: 'storeParents',
          url: ['/ho-so-doi-tuong/phu-huynh/luu-tru'],
          permission: [],
          pro: true,
        },
      ],
    },
    {
      title: 'Cấu hình',
      key: 'categories',
      icon: 'icon icon-list',
      permission: [],
      children: [
        {
          title: 'Cơ sở',
          key: 'branches',
          url: [
            '/ho-so-doi-tuong/cau-hinh/co-so',
            '/ho-so-doi-tuong/cau-hinh/co-so/tao-moi',
            '/ho-so-doi-tuong/cau-hinh/co-so/:id/chi-tiet',
          ],
          permission: [],
          pro: true,
        },
        {
          title: 'Lớp học',
          key: 'class',
          url: [
            '/ho-so-doi-tuong/cau-hinh/lop-hoc',
            '/ho-so-doi-tuong/cau-hinh/lop-hoc/tao-moi',
            '/ho-so-doi-tuong/cau-hinh/lop-hoc/:id/chi-tiet',
          ],
          permission: [],
          pro: true,
        },
      ],
    },
  ];
}
export async function getLeftMenuSchedules() {
  return [
    {
      title: 'Lịch học',
      key: 'schedules',
      url: ['/diem-danh/hoc-sinh'],
      icon: 'icon icon-clock',
      permission: [],
      pro: true,
      children: [
        {
          title: 'Lịch học trẻ',
          key: 'schedules',
          url: ['/diem-danh/lich-hoc-tre'],
          permission: [],
          pro: true,
        },
        {
          title: 'Lịch sử vào ra lớp',
          key: 'in-out-histories',
          url: ['/diem-danh/lich-su-vao-ra-lop'],
          permission: [],
          pro: true,
        },
        {
          title: 'Cấu hình lịch học',
          key: 'shift-students',
          url: [
            '/diem-danh/cau-hinh-lich-hoc',
            '/diem-danh/cau-hinh-lich-hoc/tao-moi',
            '/diem-danh/cau-hinh-lich-hoc/:id/chi-tiet',
          ],
          permission: [],
          pro: true,
        },
      ],
    },
    {
      title: 'Điểm danh',
      key: 'works',
      icon: 'icon icon-open-book',
      permission: [],
      pro: true,
      children: [
        {
          title: 'Nhập điểm danh',
          key: 'attendances',
          url: ['/diem-danh/nhap-diem-danh'],
          permission: [],
          pro: true,
        },
        {
          title: 'TH điểm danh',
          key: 'timekeeping-report',
          url: ['/diem-danh/tong-hop-diem-danh'],
          permission: [],
          pro: true,
        },
        {
          title: 'TH điểm danh theo giờ',
          key: 'hours',
          url: ['/diem-danh/tong-hop-cong-gio'],
          permission: [],
          pro: true,
        },
      ],
    },
    {
      title: 'Đơn xin phép',
      key: 'absents',
      icon: 'icon icon-clock',
      permission: [],
      pro: true,
      children: [
        {
          title: 'Đơn xin phép cho bé',
          key: 'absents',
          url: ['/diem-danh/don-xin-phep-cho-be', '/diem-danh/don-xin-phep-cho-be/tao-moi'],
          permission: [],
          pro: true,
        },
        {
          title: 'Cấu hình',
          key: 'lateEarlyConfig',
          permission: [],
          multiple: true,
          children: [
            {
              title: 'Loại nghỉ phép',
              key: 'AbsentTypes',
              permission: [],
              url: ['/diem-danh/cau-hinh/loai-nghi-phep'],
            },
            {
              title: 'Lý do nghỉ phép',
              key: 'AbsentReasons',
              permission: [],
              url: [
                '/diem-danh/cau-hinh/ly-do-nghi-phep',
                '/diem-danh/cau-hinh/ly-do-nghi-phep/tao-moi',
                '/diem-danh/cau-hinh/ly-do-nghi-phep/:id/chi-tiet',
              ],
            },
          ],
        },
      ],
    },
  ];
}
export async function getLeftMenuConfiguration() {
  return [
    {
      title: 'Tài khoản',
      key: 'account',
      url: [
        '/cau-hinh/tai-khoan',
        '/cau-hinh/tai-khoan/tao-moi',
        '/cau-hinh/tai-khoan/:id/chi-tiet',
      ],
      icon: 'icon icon-checkmark',
      permission: [],
      pro: true,
    },
    {
      title: 'Vai trò',
      key: 'roles',
      url: ['/cau-hinh/vai-tro', '/cau-hinh/vai-tro/tao-moi', '/cau-hinh/vai-tro/:id/chi-tiet'],
      icon: 'icon icon-list',
      permission: [],
      pro: true,
    },
    {
      title: 'Môn học',
      key: 'subjects',
      url: ['/cau-hinh/mon-hoc', '/cau-hinh/mon-hoc/tao-moi', '/cau-hinh/mon-hoc/:id/chi-tiet'],
      icon: 'icon icon-list',
      permission: [],
      pro: true,
    },
    {
      title: 'Danh mục',
      key: 'categories',
      icon: 'icon icon-list',
      permission: [],
      children: [
        {
          title: 'Loại công việc',
          key: 'job-types',
          url: [
            '/cau-hinh/loai-cong-viec',
            '/cau-hinh/loai-cong-viec/tao-moi',
            '/cau-hinh/loai-cong-viec/:id/chi-tiet',
          ],
          permission: [],
          pro: true,
        },
        {
          title: 'Quản lý cấp bậc',
          key: 'manager-level',
          url: ['/cau-hinh/cap-bac', '/cau-hinh/cap-bac/tao-moi', '/cau-hinh/cap-bac/:id/chi-tiet'],
          permission: [],
          pro: true,
        },
      ],
      pro: true,
    },
    {
      title: 'Tablet giáo viên',
      key: 'tablet',
      url: [
        '/cau-hinh/tablet-giao-vien',
        '/cau-hinh/tablet-giao-vien/tao-moi',
        '/cau-hinh/tablet-giao-vien/:id/chi-tiet',
      ],
      icon: 'icon icon-tablet',
      permission: [],
      pro: true,
    },
    {
      title: 'Lịch học',
      key: 'schedules',
      url: ['/cau-hinh/lich-hoc', '/cau-hinh/lich-hoc/tao-moi', '/cau-hinh/lich-hoc/:id/chi-tiet'],
      icon: 'icon icon-list',
      permission: [],
      pro: true,
    },
    {
      title: 'Phân quyền',
      key: 'permission',
      url: ['/cau-hinh/phan-quyen'],
      icon: 'icon icon-setting',
      permission: [],
      pro: true,
    },
  ];
}
export async function getLeftMenuVehicel() {
  return [
    {
      title: 'Quản lý xe',
      key: 'vehicel',
      url: ['/quan-ly-phuong-tien/xe', '/quan-ly-phuong-tien/xe/tao-moi'],
      icon: 'icon icon-checkmark',
      permission: [],
      pro: true,
    },
    {
      title: 'Quản lý lộ trình',
      key: 'tutorial',
      url: [
        '/quan-ly-phuong-tien/quan-ly-lo-trinh',
        '/quan-ly-phuong-tien/quan-ly-lo-trinh/tao-moi',
      ],
      icon: 'icon icon-notification',
      permission: [],
      pro: true,
    },
    {
      title: 'Lịch sử điểm danh',
      key: 'history',
      url: ['/quan-ly-phuong-tien/lich-su'],
      icon: 'icon icon-notification',
      permission: [],
      pro: true,
    },
    {
      title: 'Điểm danh hôm nay',
      key: 'today',
      url: ['/quan-ly-phuong-tien/hom-nay'],
      icon: 'icon icon-notification',
      permission: [],
      pro: true,
    },
  ];
}
export async function getLeftMenuCriteria() {
  return [
    {
      title: 'Đánh giá học tập',
      key: 'learn',
      url: ['/tieu-chi-danh-gia/danh-gia-hoc-tap', '/tieu-chi-danh-gia/danh-gia-hoc-tap/tao-moi'],
      icon: 'icon icon-checkmark',
      permission: [],
      pro: true,
    },
    {
      title: 'Lượng nước uống',
      key: 'water',
      url: ['/tieu-chi-danh-gia/luong-nuoc-uong'],
      icon: 'icon icon-setting',
      permission: [],
      pro: true,
    },
    {
      title: 'Chương trình học',
      key: 'study-program',
      url: ['/tieu-chi-danh-gia/chuong-trinh-hoc', '/tieu-chi-danh-gia/chuong-trinh-hoc/them-moi'],
      icon: 'icon icon-list',
      permission: [],
      pro: true,
    },
    {
      title: 'Lịch sử',
      key: 'history',
      url: ['/tieu-chi-danh-gia/lich-su'],
      icon: 'icon icon-clock',
      permission: [],
      pro: true,
    },
    {
      title: 'Cấu hình',
      key: 'categories',
      icon: 'icon icon-setting',
      permission: [],
      children: [
        {
          title: 'Hoạt động giáo cụ',
          key: 'teaching-tools',
          permission: [],
          pro: true,
          children: [
            {
              title: 'Góc giáo cụ',
              key: 'angle-tools',
              url: [
                '/tieu-chi-danh-gia/cau-hinh/goc-giao-cu',
                '/tieu-chi-danh-gia/cau-hinh/goc-giao-cu/them-moi',
              ],
              permission: [],
              pro: true,
            },
            {
              title: 'Giáo cụ',
              key: 'tools',
              url: [
                '/tieu-chi-danh-gia/cau-hinh/giao-cu',
                '/tieu-chi-danh-gia/cau-hinh/giao-cu/them-moi',
              ],
              permission: [],
              pro: true,
            },
          ],
        },
        {
          title: 'Kiểu dữ liệu',
          key: 'criteria-datatypes',
          url: [
            '/tieu-chi-danh-gia/cau-hinh/kieu-du-lieu',
            '/tieu-chi-danh-gia/cau-hinh/kieu-du-lieu/tao-moi',
            '/tieu-chi-danh-gia/cau-hinh/kieu-du-lieu/:id/chi-tiet',
          ],
          permission: [],
          pro: true,
        },
        {
          title: 'Nhóm tiêu chí',
          key: 'criteria-groups',
          url: [
            '/tieu-chi-danh-gia/cau-hinh/nhom-tieu-chi',
            '/tieu-chi-danh-gia/cau-hinh/nhom-tieu-chi/tao-moi',
            '/tieu-chi-danh-gia/cau-hinh/nhom-tieu-chi/:id/chi-tiet',
          ],
          permission: [],
          pro: true,
        },
        {
          title: 'Thuộc nhóm tiêu chí',
          key: 'criteria-group-properties',
          url: [
            '/tieu-chi-danh-gia/cau-hinh/thuoc-nhom-tieu-chi',
            '/tieu-chi-danh-gia/cau-hinh/thuoc-nhom-tieu-chi/tao-moi',
            '/tieu-chi-danh-gia/cau-hinh/thuoc-nhom-tieu-chi/:id/chi-tiet',
          ],
          permission: [],
          pro: true,
        },
      ],
    },
  ];
}
export async function getLeftMenuChildren() {
  return [
    {
      title: 'Thực đơn',
      key: 'menu',
      url: ['/thuc-don', '/thuc-don/tao-moi'],
      icon: 'icon icon-list',
      permission: [],
      pro: true,
    },
  ];
}
export async function getLeftMenuAllocation() {
  return [
    {
      title: 'Học sinh',
      key: 'children',
      url: ['/phan-bo/hoc-sinh/tre-chua-xep-lop', '/phan-bo/hoc-sinh/chuyen-lop'],
      icon: 'icon icon-baby',
      permission: [],
      pro: true,
    },
    {
      title: 'Giáo viên',
      key: 'teacher',
      url: [
        '/phan-bo/giao-vien/danh-sach',
        '/phan-bo/giao-vien/dieu-chuyen',
        '/phan-bo/giao-vien/chua-xep-lop',
      ],
      icon: 'icon icon-woman',
      permission: [],
      pro: true,
    },
    {
      title: 'Lịch sử',
      key: 'clock',
      url: ['/phan-bo/lich-su'],
      icon: 'icon icon-alarm',
      permission: [],
      pro: true,
    },
  ];
}
export async function getLeftMenuMedical() {
  return [
    {
      title: 'Thống kê',
      key: 'children',
      url: ['/y-te/thong-ke', '/y-te/thong-ke/tao-moi', '/y-te/thong-ke/:id/chi-tiet'],
      icon: 'icon icon-checkmark',
      permission: [],
      pro: true,
    },
    {
      title: 'Lịch sử',
      key: 'clock',
      url: ['/y-te/lich-su'],
      icon: 'icon icon-alarm',
      permission: [],
      pro: true,
    },
  ];
}
export async function getLeftMenuTimeTable() {
  return [
    {
      title: 'Thời khóa biểu',
      key: 'timetable',
      url: ['/thoi-khoa-bieu', '/thoi-khoa-bieu/tao-moi', '/thoi-khoa-bieu/:id/chi-tiet'],
      icon: 'icon icon-checkmark',
      permission: [],
      pro: true,
    },
  ];
}
export async function getLeftMenuNotification() {
  return [
    {
      title: 'Danh sách',
      key: 'notification',
      url: ['/thong-bao/danh-sach', '/thong-bao/tao-moi', '/thong-bao/:id/chi-tiet'],
      icon: 'icon icon-list',
      permission: [],
      pro: true,
    },
  ];
}
export async function getLeftMenuMedia() {
  return [
    {
      title: 'Đăng hình',
      key: 'upload',
      url: ['/ghi-nhan/dang-hinh'],
      icon: 'icon icon-drawer',
      permission: [],
      pro: true,
    },
    {
      title: 'Duyệt hình',
      key: 'browser',
      url: ['/ghi-nhan/duyet-hinh'],
      icon: 'icon icon-checkmark',
      permission: [],
      pro: true,
    },
    {
      title: 'Danh sách',
      key: 'list',
      url: ['/ghi-nhan/danh-sach', '/ghi-nhan/:id/chi-tiet'],
      icon: 'icon icon-list',
      permission: [],
      pro: true,
    },
  ];
}
export async function getLeftMenuHealth() {
  return [
    {
      title: 'Sức khỏe hôm nay',
      key: 'today',
      url: ['/suc-khoe/hom-nay', '/suc-khoe/hom-nay/tao-moi', '/suc-khoe/hom-nay/:id/chi-tiet'],
      icon: 'icon icon-list',
      permission: [],
    },
    {
      title: 'Lịch sử',
      key: 'history',
      url: ['/suc-khoe/lich-su', '/suc-khoe/lich-su/:id/chi-tiet'],
      icon: 'icon icon-clock',
      permission: [],
    },
  ];
}
export async function getLeftMenuHRM() {
  return [
    {
      title: 'Nhân sự',
      key: 'users',
      icon: 'icon icon-man',
      permission: [],
      children: [
        {
          title: 'Hồ sơ Cán bộ nhân viên',
          key: 'employee',
          url: [
            '/quan-ly-nhan-su/nhan-vien',
            '/quan-ly-nhan-su/nhan-vien/tao-moi',
            '/quan-ly-nhan-su/nhan-vien/:id/chi-tiet',
          ],
          permission: [],
        },
        {
          title: 'QĐ Điều chuyển',
          key: 'transfers',
          url: [
            '/quan-ly-nhan-su/dieu-chuyen',
            '/quan-ly-nhan-su/dieu-chuyen/tao-moi',
            '/quan-ly-nhan-su/dieu-chuyen/:id/chi-tiet',
          ],
          permission: [],
        },
        {
          title: 'QĐ Bổ nhiệm',
          key: 'dismisseds',
          url: [
            '/quan-ly-nhan-su/mien-nhiem',
            '/quan-ly-nhan-su/mien-nhiem/tao-moi',
            '/quan-ly-nhan-su/mien-nhiem/:id/chi-tiet',
          ],
          permission: [],
        },
        {
          title: 'QĐ Miễn nhiệm',
          key: 'appoints',
          url: [
            '/quan-ly-nhan-su/bo-nhiem',
            '/quan-ly-nhan-su/bo-nhiem/tao-moi',
            '/quan-ly-nhan-su/bo-nhiem/:id/chi-tiet',
          ],
          permission: [],
        },
        {
          title: 'QĐ Khen thưởng/ Kỷ luật',
          key: 'decision-rewards',
          url: [
            '/quan-ly-nhan-su/quyet-dinh-khen-thuong-va-ky-luat',
            '/quan-ly-nhan-su/quyet-dinh-khen-thuong-va-ky-luat/tao-moi',
            '/quan-ly-nhan-su/quyet-dinh-khen-thuong-va-ky-luat/:id/chi-tiet',
          ],
          permission: [],
        },
        {
          title: 'QĐ Thôi việc',
          key: 'resignation-decisions',
          url: [
            '/quan-ly-nhan-su/thoi-viec',
            '/quan-ly-nhan-su/thoi-viec/tao-moi',
            '/quan-ly-nhan-su/thoi-viec/:id/chi-tiet',
          ],
          permission: [],
        },
        {
          title: 'QĐ Tạm hoãn công việc',
          key: 'decision-suspends',
          url: [
            '/quan-ly-nhan-su/tam-hoan-cong-viec',
            '/quan-ly-nhan-su/tam-hoan-cong-viec/tao-moi',
            '/quan-ly-nhan-su/tam-hoan-cong-viec/:id/chi-tiet',
          ],
          permission: [],
        },
        {
          title: 'QĐ Đơn đi công tác',
          key: 'business-cards',
          url: [
            '/quan-ly-nhan-su/don-di-cong-tac',
            '/quan-ly-nhan-su/don-di-cong-tac/tao-moi',
            '/quan-ly-nhan-su/don-di-cong-tac/:id/chi-tiet',
          ],
          permission: [],
        },
        {
          title: 'QĐ Tăng lương',
          key: 'salary-increases',
          url: [
            '/quan-ly-nhan-su/tang-luong',
            '/quan-ly-nhan-su/tang-luong/tao-moi',
            '/quan-ly-nhan-su/tang-luong/:id/chi-tiet',
          ],
          permission: [],
        },
        {
          title: 'Bảo hiểm xã hội',
          key: 'insurrances',
          url: [
            '/quan-ly-nhan-su/bao-hiem-xa-hoi',
            '/quan-ly-nhan-su/bao-hiem-xa-hoi/tao-moi',
            '/quan-ly-nhan-su/bao-hiem-xa-hoi/:id/chi-tiet',
          ],
          permission: [],
        },
        {
          title: 'Ngày nghỉ phép của nv',
          key: 'sabbatical-leaves',
          url: [
            '/quan-ly-nhan-su/ngay-nghi-phep-cua-nhan-vien',
            '/quan-ly-nhan-su/ngay-nghi-phep-cua-nhan-vien/tao-moi',
            '/quan-ly-nhan-su/ngay-nghi-phep-cua-nhan-vien/:id/chi-tiet',
          ],
          permission: [],
        },
        {
          title: 'Khai báo ngày công chuẩn trong tháng',
          key: 'other-declarationss',
          url: [
            '/quan-ly-nhan-su/khai-bao-ngay-cong-chuan-trong-thang',
            '/quan-ly-nhan-su/khai-bao-ngay-cong-chuan-trong-thang/tao-moi',
            '/quan-ly-nhan-su/khai-bao-ngay-cong-chuan-trong-thang/:id/chi-tiet',
          ],
          permission: [],
        },
        {
          title: 'Thống kê con của nhân viên',
          key: 'children',
          url: [
            '/quan-ly-nhan-su/thong-ke-con-cua-nhan-vien',
            '/quan-ly-nhan-su/thong-ke-con-cua-nhan-vien/tao-moi',
            '/quan-ly-nhan-su/thong-ke-con-cua-nhan-vien/:id/chi-tiet',
          ],
          permission: [],
        },
        {
          title: 'Cấu hình',
          key: 'categories',
          icon: 'icon icon-list',
          permission: [],
          children: [
            {
              title: 'Cơ sở',
              key: 'branches',
              url: [
                '/quan-ly-nhan-su/cau-hinh/co-so',
                '/quan-ly-nhan-su/cau-hinh/co-so/tao-moi',
                '/quan-ly-nhan-su/cau-hinh/co-so/:id/chi-tiet',
              ],
              permission: [],
              pro: true,
            },
            {
              title: 'Bộ phận',
              key: 'divisions',
              url: [
                '/quan-ly-nhan-su/cau-hinh/bo-phan',
                '/quan-ly-nhan-su/cau-hinh/bo-phan/tao-moi',
                '/quan-ly-nhan-su/cau-hinh/bo-phan/:id/chi-tiet',
              ],
              permission: [],
              pro: true,
            },
            {
              title: 'Chức vụ',
              key: 'positions',
              url: [
                '/quan-ly-nhan-su/cau-hinh/chuc-vu',
                '/quan-ly-nhan-su/cau-hinh/chuc-vu/tao-moi',
                '/quan-ly-nhan-su/cau-hinh/chuc-vu/:id/chi-tiet',
              ],
              permission: [],
              pro: true,
            },
            {
              title: 'Trường đào tạo',
              key: 'training-schools',
              url: [
                '/quan-ly-nhan-su/cau-hinh/truong-dao-tao',
                '/quan-ly-nhan-su/cau-hinh/truong-dao-tao/tao-moi',
                '/quan-ly-nhan-su/cau-hinh/truong-dao-tao/:id/chi-tiet',
              ],
              permission: [],
              pro: true,
            },
            {
              title: 'Ngành đào tạo',
              key: 'training-majors',
              url: [
                '/quan-ly-nhan-su/cau-hinh/nganh-dao-tao',
                '/quan-ly-nhan-su/cau-hinh/nganh-dao-tao/tao-moi',
                '/quan-ly-nhan-su/cau-hinh/nganh-dao-tao/:id/chi-tiet',
              ],
              permission: [],
              pro: true,
            },
            {
              title: 'Bằng cấp',
              key: 'degrees',
              url: [
                '/quan-ly-nhan-su/cau-hinh/bang-cap',
                '/quan-ly-nhan-su/cau-hinh/bang-cap/tao-moi',
                '/quan-ly-nhan-su/cau-hinh/bang-cap/:id/chi-tiet',
              ],
              permission: [],
              pro: true,
            },
            {
              title: 'Trình độ văn hóa',
              key: 'educational-levels',
              url: [
                '/quan-ly-nhan-su/cau-hinh/trinh-do-hoc-van',
                '/quan-ly-nhan-su/cau-hinh/trinh-do-hoc-van/tao-moi',
                '/quan-ly-nhan-su/cau-hinh/trinh-do-hoc-van/:id/chi-tiet',
              ],
              permission: [],
              pro: true,
            },
            {
              title: 'Ngày nghỉ lễ',
              key: 'holidays',
              url: [
                '/quan-ly-nhan-su/ngay-nghi-le',
                '/quan-ly-nhan-su/ngay-nghi-le/tao-moi',
                '/quan-ly-nhan-su/ngay-nghi-le/:id/chi-tiet',
              ],
              permission: [],
            },
          ],
        },
      ],
    },

    {
      title: 'Lịch làm việc',
      key: 'schedules',
      icon: 'icon icon-clock',
      permission: [],
      pro: true,
      children: [
        {
          title: 'Chia ca',
          key: 'schedules',
          url: ['/quan-ly-nhan-su/lich-lam-viec'],
          permission: [],
          pro: true,
        },
        {
          title: 'Lịch sử vào ra',
          key: 'timekeeping',
          url: ['/quan-ly-nhan-su/lich-su-vao-ra'],
          permission: [],
          pro: true,
        },
        {
          title: 'Cấu hình',
          key: 'config',
          url: [
            '/quan-ly-nhan-su/lich-lam-viec/cau-hinh',
            '/quan-ly-nhan-su/lich-lam-viec/cau-hinh/tao-moi',
            '/quan-ly-nhan-su/lich-lam-viec/cau-hinh/:id/chi-tiet',
          ],
          permission: [],
          pro: true,
        },
      ],
    },
    {
      title: 'Máy chấm công',
      key: 'fingerprints',
      url: ['/quan-ly-nhan-su/may-cham-cong-van-tay'],
      icon: 'icon icon-newspaper',
      permission: [],
      pro: true,
    },
    {
      title: 'Đi trễ về sớm',
      key: 'lateEarly',
      url: ['/quan-ly-nhan-su/di-tre-ve-som'],
      icon: 'icon icon-clock',
      permission: [],
      pro: true,
    },
    {
      title: 'Đơn xin phép',
      key: 'absents',
      icon: 'icon icon-clock',
      permission: [],
      pro: true,
      children: [
        {
          title: 'Nghỉ phép',
          key: 'absents',
          url: ['/quan-ly-nhan-su/don-xin-phep', '/quan-ly-nhan-su/don-xin-phep/tao-moi'],
          permission: [],
          pro: true,
        },
        {
          title: 'Cấu hình',
          key: 'lateEarlyConfig',
          permission: [],
          multiple: true,
          children: [
            {
              title: 'Loại nghỉ phép',
              key: 'AbsentTypes',
              permission: [],
              url: ['/quan-ly-nhan-su/cau-hinh/loai-nghi-phep'],
            },
            {
              title: 'Lý do nghỉ phép',
              key: 'AbsentReasons',
              permission: [],
              url: [
                '/quan-ly-nhan-su/cau-hinh/ly-do-nghi-phep',
                '/quan-ly-nhan-su/cau-hinh/ly-do-nghi-phep/tao-moi',
                '/quan-ly-nhan-su/cau-hinh/ly-do-nghi-phep/:id/chi-tiet',
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Công',
      key: 'works',
      icon: 'icon icon-open-book',
      permission: [],
      pro: true,
      children: [
        {
          title: 'Tổng hợp công',
          key: 'total',
          url: ['/quan-ly-nhan-su/tong-hop-cong'],
          permission: [],
          pro: true,
        },
        {
          title: 'Không xác định công',
          key: 'timekeeping-invalid',
          url: ['/quan-ly-nhan-su/khong-xac-dinh-cong'],
          permission: [],
          pro: true,
        },
        {
          title: 'Công bổ sung',
          key: 'work-declarations',
          url: [
            '/quan-ly-nhan-su/cong-bo-sung',
            '/quan-ly-nhan-su/cong-bo-sung/tao-moi',
            '/quan-ly-nhan-su/cong-bo-sung/:id/chi-tiet',
          ],
          permission: [],
          pro: true,
        },
        {
          title: 'Phiếu ĐK giờ làm thêm',
          key: 'work-hours',
          url: [
            '/quan-ly-nhan-su/phieu-dang-ky-gio-lam-them',
            '/quan-ly-nhan-su/phieu-dang-ky-gio-lam-them/tao-moi',
            '/quan-ly-nhan-su/phieu-dang-ky-gio-lam-them/:id/chi-tiet',
          ],
          permission: [],
          pro: true,
        },
      ],
    },
    {
      title: 'Cấu hình',
      key: 'categories',
      icon: 'icon icon-list',
      permission: [],
      children: [
        {
          title: 'Tham số giá trị',
          key: 'paramater-values',
          url: [
            '/quan-ly-nhan-su/cau-hinh/tham-so-gia-tri',
            '/quan-ly-nhan-su/cau-hinh/tham-so-gia-tri/tao-moi',
            '/quan-ly-nhan-su/cau-hinh/tham-so-gia-tri/:id/chi-tiet',
          ],
          permission: [],
          pro: true,
        },
        {
          title: 'Tham số công thức',
          key: 'paramater-formulas',
          url: [
            '/quan-ly-nhan-su/cau-hinh/tham-so-cong-thuc',
            '/quan-ly-nhan-su/cau-hinh/tham-so-cong-thuc/tao-moi',
            '/quan-ly-nhan-su/cau-hinh/tham-so-cong-thuc/:id/chi-tiet',
          ],
          permission: [],
          pro: true,
        },
        {
          title: 'Loại hợp đồng',
          key: 'type-of-contracts',
          url: [
            '/quan-ly-nhan-su/cau-hinh/loai-hop-dong',
            '/quan-ly-nhan-su/cau-hinh/loai-hop-dong/tao-moi',
            '/quan-ly-nhan-su/cau-hinh/loai-hop-dong/:id/chi-tiet',
          ],
          permission: [],
          pro: true,
        },
      ],
    },
  ];
}
export async function getLeftMenuFeePolicy() {
  return [
    {
      title: 'Danh mục nhóm đối tượng',
      key: 'target',
      url: [
        '/chinh-sach-phi/nhom-doi-tuong',
        '/chinh-sach-phi/nhom-doi-tuong/tao-moi',
        '/chinh-sach-phi/nhom-doi-tuong/:id/chi-tiet',
      ],
      icon: 'icon icon-list',
      permission: [],
    },
    {
      title: 'Danh mục loại lớp',
      key: 'class',
      url: [
        '/chinh-sach-phi/lop',
        '/chinh-sach-phi/lop/tao-moi',
        '/chinh-sach-phi/lop/:id/chi-tiet',
      ],
      icon: 'icon icon-open-book',
      permission: [],
    },
    {
      title: 'Danh mục hình thức đóng phí',
      key: 'format',
      url: [
        '/chinh-sach-phi/hinh-thuc',
        '/chinh-sach-phi/hinh-thuc/tao-moi',
        '/chinh-sach-phi/hinh-thuc/:id/chi-tiet',
      ],
      icon: 'icon icon-send-money',
      permission: [],
    },
    {
      title: 'Danh mục phí',
      key: 'fee',
      url: [
        '/chinh-sach-phi/phi',
        '/chinh-sach-phi/phi/tao-moi',
        '/chinh-sach-phi/phi/:id/chi-tiet',
      ],
      icon: 'icon icon-budget',
      permission: [],
    },
    {
      title: 'Chính sách đóng phí',
      key: 'policy',
      url: [
        '/chinh-sach-phi/chinh-sach',
        '/chinh-sach-phi/chinh-sach/them-moi',
        '/chinh-sach-phi/chinh-sach/:id/chi-tiet',
      ],
      icon: 'icon icon-fee-policy',
      permission: [],
    },
  ];
}
export async function getTopMenuData() {
  return [];
}
