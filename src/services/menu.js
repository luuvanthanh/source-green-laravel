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
      title: 'Nhân viên',
      key: 'users',
      url: [
        '/ho-so-doi-tuong/nhan-vien',
        '/ho-so-doi-tuong/nhan-vien/tao-moi',
        '/ho-so-doi-tuong/nhan-vien/:id/chi-tiet',
      ],
      icon: 'icon icon-man',
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
        {
          title: 'Nhân viên',
          key: 'storeEmployees',
          url: ['/ho-so-doi-tuong/nhan-vien/luu-tru'],
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
      title: 'Lịch làm việc',
      key: 'schedules',
      url: ['/diem-danh/hoc-sinh'],
      icon: 'icon icon-clock',
      permission: [],
      pro: true,
      children: [
        {
          title: 'Chia ca',
          key: 'schedules',
          url: ['/diem-danh/hoc-sinh'],
          permission: [],
          pro: true,
        },
        {
          title: 'Lịch sử vào ra',
          key: 'timekeeping',
          url: ['/diem-danh/lich-su-vao-ra'],
          permission: [],
          pro: true,
        },
        {
          title: 'Cấu hình',
          key: 'config',
          url: [
            '/diem-danh/cau-hinh',
            '/diem-danh/cau-hinh/tao-moi',
            '/diem-danh/cau-hinh/:id/chi-tiet',
          ],
          permission: [],
          pro: true,
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
          url: ['/diem-danh/tong-hop-cong'],
          permission: [],
          pro: true,
        },
        {
          title: 'Tổng hợp công giờ',
          key: 'hours',
          url: ['/diem-danh/tong-hop-cong-gio'],
          permission: [],
          pro: true,
        },
        {
          title: 'Công thêm',
          key: 'additional-times',
          url: [
            '/diem-danh/cong-them',
            '/diem-danh/cong-them/tao-moi',
            '/diem-danh/cong-them/:id/chi-tiet',
          ],
          permission: [],
          pro: true,
        },
        {
          title: 'Công trừ',
          key: 'subtraction-times',
          url: [
            '/diem-danh/cong-tru',
            '/diem-danh/cong-tru/tao-moi',
            '/diem-danh/cong-tru/:id/chi-tiet',
          ],
          permission: [],
          pro: true,
        },
        {
          title: 'Không xác định công',
          key: 'timekeeping-invalid',
          url: ['/diem-danh/khong-xac-dinh-cong'],
          permission: [],
          pro: true,
        },
        {
          title: 'Bỏ ca',
          key: 'revoke-shifts',
          url: ['/diem-danh/bo-ca'],
          permission: [],
          pro: true,
        },
        {
          title: 'Khai báo công',
          key: 'work-declarations',
          url: [
            '/diem-danh/khai-bao-cong',
            '/diem-danh/khai-bao-cong/tao-moi',
            '/diem-danh/khai-bao-cong/:id/chi-tiet',
          ],
          permission: [],
          pro: true,
        },
        {
          title: 'Công giờ hỗ trợ',
          key: 'work-hours',
          url: [
            '/diem-danh/cong-gio-ho-tro',
            '/diem-danh/cong-gio-ho-tro/tao-moi',
            '/diem-danh/cong-gio-ho-tro/:id/chi-tiet',
          ],
          permission: [],
          pro: true,
        },
      ],
    },
    {
      title: 'Máy chấm công',
      key: 'fingerprints',
      url: ['/diem-danh/may-cham-cong-van-tay'],
      icon: 'icon icon-newspaper',
      permission: [],
      pro: true,
    },

    {
      title: 'Đi trễ về sớm',
      key: 'lateEarly',
      url: ['/diem-danh/di-tre-ve-som'],
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
          url: ['/diem-danh/don-xin-phep', '/diem-danh/don-xin-phep/tao-moi'],
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
      title: 'Danh mục Lớp',
      key: 'categoriesClass',
      icon: 'icon icon-list',
      permission: [],
      children: [
        {
          title: 'Cơ sở',
          key: 'branches',
          url: ['/cau-hinh/co-so', '/cau-hinh/co-so/tao-moi', '/cau-hinh/co-so/:id/chi-tiet'],
          permission: [],
          pro: true,
        },
        {
          title: 'Lớp học',
          key: 'class',
          url: ['/cau-hinh/lop-hoc', '/cau-hinh/lop-hoc/tao-moi', '/cau-hinh/lop-hoc/:id/chi-tiet'],
          permission: [],
          pro: true,
        },
      ],
    },
    {
      title: 'Danh mục',
      key: 'categories',
      icon: 'icon icon-list',
      permission: [],
      children: [
        {
          title: 'Bộ phận',
          key: 'divisions',
          url: ['/cau-hinh/bo-phan', '/cau-hinh/bo-phan/tao-moi', '/cau-hinh/bo-phan/:id/chi-tiet'],
          permission: [],
          pro: true,
        },
        {
          title: 'Chức vụ',
          key: 'positions',
          url: ['/cau-hinh/chuc-vu', '/cau-hinh/chuc-vu/tao-moi', '/cau-hinh/chuc-vu/:id/chi-tiet'],
          permission: [],
          pro: true,
        },
        {
          title: 'Trường đào tạo',
          key: 'training-schools',
          url: [
            '/cau-hinh/truong-dao-tao',
            '/cau-hinh/truong-dao-tao/tao-moi',
            '/cau-hinh/truong-dao-tao/:id/chi-tiet',
          ],
          permission: [],
          pro: true,
        },
        {
          title: 'Bằng cấp',
          key: 'degrees',
          url: [
            '/cau-hinh/bang-cap',
            '/cau-hinh/bang-cap/tao-moi',
            '/cau-hinh/bang-cap/:id/chi-tiet',
          ],
          permission: [],
          pro: true,
        },
        {
          title: 'Ngành đào tạo',
          key: 'training-majors',
          url: [
            '/cau-hinh/nganh-dao-tao',
            '/cau-hinh/nganh-dao-tao/tao-moi',
            '/cau-hinh/nganh-dao-tao/:id/chi-tiet',
          ],
          permission: [],
          pro: true,
        },
        {
          title: 'Trình độ học vấn',
          key: 'educational-levels',
          url: [
            '/cau-hinh/trinh-do-hoc-van',
            '/cau-hinh/trinh-do-hoc-van/tao-moi',
            '/cau-hinh/trinh-do-hoc-van/:id/chi-tiet',
          ],
          permission: [],
          pro: true,
        },
        {
          title: 'Tham số giá trị',
          key: 'paramater-values',
          url: [
            '/cau-hinh/tham-so-gia-tri',
            '/cau-hinh/tham-so-gia-tri/tao-moi',
            '/cau-hinh/tham-so-gia-tri/:id/chi-tiet',
          ],
          permission: [],
          pro: true,
        },
        {
          title: 'Tham số công thức',
          key: 'paramater-formulas',
          url: [
            '/cau-hinh/tham-so-cong-thuc',
            '/cau-hinh/tham-so-cong-thuc/tao-moi',
            '/cau-hinh/tham-so-cong-thuc/:id/chi-tiet',
          ],
          permission: [],
          pro: true,
        },
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
      title: 'Nhân viên',
      key: 'users',
      url: [
        '/phan-bo/nhan-vien/danh-sach',
        '/phan-bo/nhan-vien/dieu-chuyen',
        '/phan-bo/nhan-vien/chua-xep-lop',
      ],
      icon: 'icon icon-man',
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
      title: 'Duyệt hình',
      key: 'browser',
      url: ['/ghi-nhan/duyet-hinh', '/ghi-nhan/duyet-hinh/ket-qua'],
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
      url: ['/suc-khoe/hom-nay', '/suc-khoe/hom-nay/:id/chi-tiet'],
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
export async function getTopMenuData() {
  return [];
}
