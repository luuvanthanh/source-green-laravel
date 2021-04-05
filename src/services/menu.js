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
      title: 'Thực đơn cho trẻ',
      key: 'menu',
      url: ['/thuc-don-cho-tre', '/thuc-don-cho-tre/tao-moi'],
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
      url: ['/chi-nhanh', '/chi-nhanh/tao-moi'],
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
      url: ['/ho-so-doi-tuong/hoc-sinh'],
      icon: 'icon icon-baby',
      permission: [],
      pro: true,
    },
    {
      title: 'Phụ Huynh',
      key: 'parents',
      url: ['/ho-so-doi-tuong/phu-huynh'],
      icon: 'icon icon-woman',
      permission: [],
      pro: true,
    },
    {
      title: 'Nhân viên',
      key: 'users',
      url: ['/ho-so-doi-tuong/nhan-vien'],
      icon: 'icon icon-man',
      permission: [],
      pro: true,
    },
  ];
}
export async function getLeftMenuSchedules() {
  return [
    {
      title: 'Học sinh',
      key: 'schedules',
      url: ['/diem-danh/hoc-sinh'],
      icon: 'icon icon-baby',
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
      icon: 'icon icon-setting',
      permission: [],
      pro: true,
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
      title: 'Chi nhánh',
      key: 'store',
      url: [
        '/cau-hinh/chi-nhanh',
        '/cau-hinh/chi-nhanh/tao-moi',
        '/cau-hinh/chi-nhanh/:id/chi-tiet',
      ],
      icon: 'icon icon-open-book',
      permission: [],
      pro: true,
    },
    {
      title: 'Vai trò',
      key: 'roles',
      url: ['/cau-hinh/vai-tro', '/cau-hinh/vai-tro/tao-moi', '/cau-hinh/vai-tro/:id/chi-tiet'],
      icon: 'icon icon-setting',
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
export async function getTopMenuData() {
  return [];
}
