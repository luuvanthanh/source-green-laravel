// eslint-disable-next-line import/extensions
import { permissions } from '../../config/permissions';

export async function getLeftMenuData() {
  return [
    {
      title: 'Tiêu chí - Đánh giá',
      key: 'category',
      url: [
        '/chuong-trinh-hoc/danh-gia-hoc-tap',
        '/chuong-trinh-hoc/danh-gia-hoc-tap/tao-moi',
        '/chuong-trinh-hoc/luong-nuoc-uong',
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
      key: 'bus',
      url: [
        '/quan-ly-phuong-tien/xe',
        '/quan-ly-phuong-tien/xe/tao-moi',
        '/quan-ly-phuong-tien/xe/:id/chi-tiet',
        '/quan-ly-phuong-tien/quan-ly-lo-trinh',
        '/quan-ly-phuong-tien/quan-ly-lo-trinh/tao-moi',
        '/quan-ly-phuong-tien/quan-ly-lo-trinh/:id/chi-tiet',
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
export async function getLeftMenuCommunications() {
  return [
    {
      title: 'Cần duyệt',
      key: 'approve',
      url: ['/trao-doi/can-duyet'],
      icon: 'icon icon-checkmark',
      permission: [permissions.TD],
      pro: true,
    },
    {
      title: 'Danh sách',
      key: 'items',
      url: ['/trao-doi/danh-sach', '/trao-doi/tao-moi', '/trao-doi/:id/chi-tiet'],
      icon: 'icon icon-list',
      permission: [permissions.TD],
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
      permission: [permissions.HSDT],
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
      permission: [permissions.HSDT],
      pro: true,
    },
    {
      title: 'Hồ sơ đã lưu trữ',
      key: 'stores',
      icon: 'icon icon-fileText',
      permission: [permissions.HSDT],
      children: [
        {
          title: 'Học sinh',
          key: 'storeStudents',
          url: ['/ho-so-doi-tuong/hoc-sinh/luu-tru'],
          permission: [permissions.HSDT],
          pro: true,
        },
        {
          title: 'Phụ huynh',
          key: 'storeParents',
          url: ['/ho-so-doi-tuong/phu-huynh/luu-tru'],
          permission: [permissions.HSDT],
          pro: true,
        },
      ],
    },
    {
      title: 'Cấu hình',
      key: 'categories',
      icon: 'icon icon-list',
      permission: [permissions.HSDT],
      children: [
        {
          title: 'Cơ sở',
          key: 'branches',
          url: [
            '/ho-so-doi-tuong/cau-hinh/co-so',
            '/ho-so-doi-tuong/cau-hinh/co-so/tao-moi',
            '/ho-so-doi-tuong/cau-hinh/co-so/:id/chi-tiet',
          ],
          permission: [permissions.HSDT],
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
          permission: [permissions.HSDT],
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
      permission: [permissions.DD],
      pro: true,
      children: [
        {
          title: 'Lịch học trẻ',
          key: 'schedules',
          url: ['/diem-danh/lich-hoc-tre'],
          permission: [permissions.DD],
          pro: true,
        },
        {
          title: 'Lịch sử vào ra lớp',
          key: 'in-out-histories',
          url: ['/diem-danh/lich-su-vao-ra-lop'],
          permission: [permissions.DD],
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
          permission: [permissions.DD],
          pro: true,
        },
      ],
    },
    {
      title: 'Điểm danh',
      key: 'works',
      icon: 'icon icon-open-book',
      permission: [permissions.DD],
      pro: true,
      children: [
        {
          title: 'Nhập điểm danh',
          key: 'attendances',
          url: ['/diem-danh/nhap-diem-danh'],
          permission: [permissions.DD],
          pro: true,
        },
        {
          title: 'TH điểm danh',
          key: 'timekeeping-report',
          url: ['/diem-danh/tong-hop-diem-danh'],
          permission: [permissions.DD],
          pro: true,
        },
        {
          title: 'Lý do điểm danh',
          key: 'attendances-reasons',
          url: [
            '/diem-danh/ly-do-diem-danh',
            '/diem-danh/ly-do-diem-danh/tao-moi',
            '/diem-danh/ly-do-diem-danh/:id/chi-tiet',
          ],
          permission: [permissions.DD],
          pro: true,
        },
      ],
    },
    {
      title: 'Đơn xin phép',
      key: 'absents',
      icon: 'icon icon-clock',
      permission: [permissions.DD],
      pro: true,
      children: [
        {
          title: 'Đơn xin phép cho bé',
          key: 'absentsConfig',
          url: [
            '/diem-danh/don-xin-phep-cho-be',
            '/diem-danh/don-xin-phep-cho-be/tao-moi',
            '/diem-danh/don-xin-phep-cho-be/:id/chi-tiet',
          ],
          permission: [permissions.DD],
          pro: true,
        },
        {
          title: 'Cấu hình',
          key: 'lateEarlyConfig',
          permission: [permissions.DD],
          multiple: true,
          children: [
            {
              title: 'Loại nghỉ phép',
              key: 'AbsentTypesConfig',
              permission: [permissions.DD],
              url: ['/diem-danh/cau-hinh/loai-cong', '/diem-danh/cau-hinh/loai-cong/:id/chi-tiet'],
            },
            {
              title: 'Lý do nghỉ phép',
              key: 'AbsentReasonsConfig',
              permission: [permissions.DD],
              url: [
                '/diem-danh/cau-hinh/ly-do-nghi-phep',
                '/diem-danh/cau-hinh/ly-do-nghi-phep/tao-moi',
                '/diem-danh/cau-hinh/ly-do-nghi-phep/:id/chi-tiet',
              ],
            },
            {
              title: 'Thời gian xin phép',
              key: 'AbsentTimelineConfig',
              permission: [permissions.DD],
              url: ['/diem-danh/cau-hinh/thoi-gian-xin-phep'],
            },
          ],
        },
      ],
    },
    {
      title: 'Lịch sử điểm danh',
      key: 'attendanceLogs',
      icon: 'icon icon-clock',
      url: ['/diem-danh/lich-su-diem-danh'],
      permission: [permissions.DD],
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
      permission: [permissions.CAUHINH],
      pro: true,
    },
    {
      title: 'Vai trò',
      key: 'roles',
      url: ['/cau-hinh/vai-tro', '/cau-hinh/vai-tro/tao-moi', '/cau-hinh/vai-tro/:id/chi-tiet'],
      icon: 'icon icon-list',
      permission: [permissions.CAUHINH],
      pro: true,
    },
    {
      title: 'Danh mục',
      key: 'categories',
      icon: 'icon icon-list',
      permission: [permissions.CAUHINH],
      children: [
        {
          title: 'Nhóm đối tượng',
          key: 'manager-object',
          url: [
            '/cau-hinh/nhom-doi-tuong',
            '/cau-hinh/nhom-doi-tuong/tao-moi',
            '/cau-hinh/nhom-doi-tuong/:id/chi-tiet',
          ],
          permission: [permissions.CAUHINH],
          pro: true,
        },
        {
          title: 'Loại lớp',
          key: 'class-type',
          url: [
            '/cau-hinh/loai-lop',
            '/cau-hinh/loai-lop/tao-moi',
            '/cau-hinh/loai-lop/:id/chi-tiet',
          ],
          permission: [permissions.CAUHINH],
          pro: true,
        },
        {
          title: 'Hình thức đóng phí',
          key: 'payment-method',
          url: [
            '/cau-hinh/hinh-thuc-dong-phi',
            '/cau-hinh/hinh-thuc-dong-phi/tao-moi',
            '/cau-hinh/hinh-thuc-dong-phi/:id/chi-tiet',
          ],
          permission: [permissions.CAUHINH],
          pro: true,
        },
      ],
      pro: true,
    },
    {
      title: 'Cảnh báo',
      key: 'warning',
      icon: 'icon icon-notification',
      permission: [permissions.CAUHINH],
      children: [
        {
          title: 'Sức khỏe',
          key: 'warning-healthy',
          url: ['/cau-hinh/canh-bao/suc-khoe'],
          permission: [permissions.CAUHINH],
          pro: true,
        },
        {
          title: 'Ghi chú',
          key: 'warning-note',
          url: ['/cau-hinh/canh-bao/ghi-chu'],
          permission: [permissions.CAUHINH],
          pro: true,
        },
        {
          title: 'Y tế',
          key: 'warning-medical',
          url: ['/cau-hinh/canh-bao/y-te'],
          permission: [permissions.CAUHINH],
          pro: true,
        },
      ],
    },
    {
      title: 'Thông báo',
      key: 'notification',
      icon: 'icon icon-notification',
      permission: [permissions.CAUHINH],
      children: [
        {
          title: 'Hình thức nhận thông báo',
          key: 'type-notification',
          url: ['/cau-hinh/hinh-thuc-nhan-thong-bao'],
          permission: [permissions.CAUHINH],
          pro: true,
        },
        {
          title: 'Module gửi thông báo đến phụ huynh',
          key: 'module-notification',
          url: ['/cau-hinh/module-gui-thong-bao'],
          permission: [permissions.CAUHINH],
          pro: true,
        },
      ],
    },
    {
      title: 'Phân quyền',
      key: 'permission',
      url: ['/cau-hinh/phan-quyen'],
      icon: 'icon icon-setting',
      permission: [permissions.CAUHINH],
      pro: true,
    },
  ];
}
export async function getLeftMenuVehicel() {
  return [
    {
      title: 'Quản lý xe',
      key: 'vehicel',
      url: [
        '/quan-ly-phuong-tien/xe',
        '/quan-ly-phuong-tien/xe/tao-moi',
        '/quan-ly-phuong-tien/xe/:id/chi-tiet',
      ],
      icon: 'icon icon-school-bus',
      permission: [permissions.BUS],
      pro: true,
    },
    {
      title: 'Quản lý lộ trình',
      key: 'tutorial',
      url: [
        '/quan-ly-phuong-tien/quan-ly-lo-trinh',
        '/quan-ly-phuong-tien/quan-ly-lo-trinh/tao-moi',
        '/quan-ly-phuong-tien/quan-ly-lo-trinh/:id/chi-tiet',
        '/quan-ly-phuong-tien/quan-ly-lo-trinh/tao-moi',
        '/quan-ly-phuong-tien/quan-ly-lo-trinh/:id/chi-tiet',
      ],
      icon: 'icon icon-location-placeholder',
      permission: [permissions.BUS],
      pro: true,
    },
    {
      title: 'Lịch sử điểm danh',
      key: 'history',
      url: ['/quan-ly-phuong-tien/lich-su'],
      icon: 'icon icon-list',
      permission: [permissions.BUS],
      pro: true,
    },
    {
      title: 'Điểm danh hôm nay',
      key: 'today',
      url: ['/quan-ly-phuong-tien/hom-nay'],
      icon: 'icon icon-clock',
      permission: [permissions.BUS],
      pro: true,
    },
    // {
    //   title: 'Điểm danh hôm nay(Phụ Huynh)',
    //   key: 'todayParent',
    //   url: ['/quan-ly-phuong-tien/phu-huynh-hom-nay'],
    //   icon: 'icon icon-notification',
    //   permission: [permissions.BUS],
    //   pro: true,
    // },
  ];
}
export async function getLeftMenuCriteria() {
  return [
    {
      title: 'Thống kê',
      key: 'report',
      url: ['/chuong-trinh-hoc/bao-cao-tong-quat-tre'],
      icon: 'icon icon-report',
      permission: [permissions.CTH],
      pro: true,
    },
    {
      title: 'Học tập giáo cụ',
      key: 'teaching-tools',
      icon: 'icon icon-list',
      permission: [permissions.CTH],
      pro: true,
      children: [
        // {
        //   title: 'DS chương trình',
        //   key: 'study-program',
        //   url: [
        //     '/chuong-trinh-hoc',
        //     '/chuong-trinh-hoc/them-moi',
        //     '/chuong-trinh-hoc/:id/chi-tiet',
        //   ],
        //   permission: [permissions.CTH],
        //   pro: true,
        // },
        // {
        //   title: 'DS template',
        //   key: 'curriculum-templates',
        //   url: [
        //     '/chuong-trinh-hoc/templates',
        //     '/chuong-trinh-hoc/templates/them-moi',
        //     '/chuong-trinh-hoc/templates/:id/chi-tiet',
        //   ],
        //   permission: [permissions.CTH],
        //   pro: true,
        // },
        {
          title: 'Góc giáo cụ',
          key: 'angle-tools',
          url: [
            '/chuong-trinh-hoc/cau-hinh/goc-giao-cu',
            '/chuong-trinh-hoc/cau-hinh/goc-giao-cu/them-moi',
            '/chuong-trinh-hoc/cau-hinh/goc-giao-cu/:id/chi-tiet',
          ],
          permission: [permissions.CTH],
          pro: true,
        },
        {
          title: 'Giáo cụ',
          key: 'tools',
          url: [
            '/chuong-trinh-hoc/cau-hinh/giao-cu',
            '/chuong-trinh-hoc/cau-hinh/giao-cu/them-moi',
            '/chuong-trinh-hoc/cau-hinh/giao-cu/:id/chi-tiet',
          ],
          permission: [permissions.CTH],
          pro: true,
        },
        {
          title: 'Thời kỳ nhạy cảm',
          key: 'sensitivePeriod',
          url: [
            '/chuong-trinh-hoc/cau-hinh/thoi-ky-nhay-cam',
            '/chuong-trinh-hoc/cau-hinh/thoi-ky-nhay-cam/them-moi',
            '/chuong-trinh-hoc/cau-hinh/thoi-ky-nhay-cam/:id/chi-tiet',
          ],
          permission: [permissions.CTH],
          pro: true,
        },
      ],
    },
    {
      title: 'Tiếng Anh',
      key: 'dictionary',
      url: ['/chuong-trinh-hoc/tieng-anh'],
      icon: 'icon icon-dictionary',
      permission: [permissions.CTH],
      pro: true,
    },
    {
      title: 'Thể chất',
      key: 'biceps',
      url: ['/chuong-trinh-hoc/the-chat'],
      icon: 'icon icon-biceps',
      permission: [permissions.CTH],
      pro: true,
    },
    {
      title: 'Lịch sử',
      key: 'history',
      url: ['/chuong-trinh-hoc/lich-su'],
      icon: 'icon icon-clock',
      permission: [permissions.CTH],
      pro: true,
    },
    {
      title: 'Cấu hình',
      key: 'categories',
      icon: 'icon icon-setting',
      permission: [permissions.CTH],
      children: [
        {
          title: 'Nhóm tiêu chí',
          key: 'criteria-groups',
          url: [
            '/chuong-trinh-hoc/cau-hinh/nhom-tieu-chi',
            '/chuong-trinh-hoc/cau-hinh/nhom-tieu-chi/tao-moi',
            '/chuong-trinh-hoc/cau-hinh/nhom-tieu-chi/:id/chi-tiet',
          ],
          permission: [permissions.CTH],
          pro: true,
        },
        {
          title: 'Thuộc nhóm tiêu chí',
          key: 'criteria-group-properties',
          url: [
            '/chuong-trinh-hoc/cau-hinh/thuoc-nhom-tieu-chi',
            '/chuong-trinh-hoc/cau-hinh/thuoc-nhom-tieu-chi/tao-moi',
            '/chuong-trinh-hoc/cau-hinh/thuoc-nhom-tieu-chi/:id/chi-tiet',
          ],
          permission: [permissions.CTH],
          pro: true,
        },
      ],
    },
  ];
}
export async function getLeftMenuChildren() {
  return [
    {
      title: 'Danh sách thực đơn',
      key: 'menu',
      url: ['/thuc-don', '/thuc-don/tao-moi', '/thuc-don/:id/chi-tiet', '/thuc-don/:id/chinh-sua'],
      icon: 'icon icon-list',
      permission: [permissions.BEP],
      pro: true,
    },
    {
      title: 'Danh mục bữa ăn',
      key: 'meals',
      url: ['/thuc-don/bua-an', '/thuc-don/bua-an/tao-moi', '/thuc-don/bua-an/:id/chi-tiet'],
      icon: 'icon icon-list',
      permission: [permissions.BEP],
      pro: true,
    },
    {
      title: 'Danh mục món ăn',
      key: 'food-commons',
      url: ['/thuc-don/mon-an', '/thuc-don/mon-an/tao-moi', '/thuc-don/mon-an/:id/chi-tiet'],
      icon: 'icon icon-list',
      permission: [permissions.BEP],
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
      permission: [permissions.PB],
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
      permission: [permissions.PB],
      pro: true,
    },
    {
      title: 'Lịch sử',
      key: 'clock',
      url: ['/phan-bo/lich-su'],
      icon: 'icon icon-alarm',
      permission: [permissions.PB],
      pro: true,
    },
  ];
}
export async function getLeftMenuMedical() {
  return [
    {
      title: 'Danh sách nhận thuốc',
      key: 'children',
      url: ['/y-te/danh-sach-nhan-thuoc'],
      icon: 'icon icon-checkmark',
      permission: [permissions.YTE],
      pro: true,
    },
    {
      title: 'Theo dõi uống thuốc',
      key: 'clock',
      url: ['/y-te/theo-doi-uong-thuoc'],
      icon: 'icon icon-heart',
      permission: [permissions.YTE],
      pro: true,
    },
    {
      title: 'Lịch sử',
      key: 'logbook',
      url: ['/y-te/lich-su'],
      icon: 'icon icon-notification',
      permission: [permissions.YTE],
      pro: true,
    },
    {
      title: 'Cấu hình',
      key: 'setting',
      icon: 'icon icon-setting',
      permission: [permissions.YTE],
      children: [
        {
          title: 'Nhóm buổi',
          key: 'config',
          url: ['/y-te/nhom-buoi', '/y-te/nhom-buoi/them-moi', '/y-te/nhom-buoi/:id/chi-tiet'],
          permission: [permissions.YTE],
        },
        {
          title: 'Buổi',
          key: 'byGroup',
          url: ['/y-te/buoi', '/y-te/buoi/them-moi', '/y-te/buoi/:id/chi-tiet'],
          permission: [permissions.YTE],
        },
        {
          title: 'Thời gian uống thuốc',
          key: 'multi-group',
          url: ['/y-te/thoi-gian-uong-thuoc'],
          permission: [permissions.YTE],
        },
      ],
    },
  ];
}
export async function getLeftMenuTimeTable() {
  return [
    {
      title: 'Thời khóa biểu',
      key: 'timetable',
      url: ['/thoi-khoa-bieu', '/thoi-khoa-bieu/tao-moi', '/thoi-khoa-bieu/:id/chi-tiet'],
      icon: 'icon icon-calendar1',
      permission: [permissions.TKB],
      pro: true,
    },
    {
      title: 'Thời khóa biểu làm việc / sự kiện',
      key: 'schedule',
      url: [
        '/thoi-khoa-bieu/lam-viec',
        '/thoi-khoa-bieu/lam-viec/tao-moi',
        '/thoi-khoa-bieu/lam-viec/:id/chinh-sua',
        '/thoi-khoa-bieu/lam-viec/:id/chi-tiet',
      ],
      icon: 'icon icon-calendar1',
      permission: [permissions.TKB],
      pro: true,
    },
    {
      title: 'Lịch sử',
      key: 'timetableHistory',
      url: ['/thoi-khoa-bieu/lich-su'],
      icon: 'icon icon-clock',
      permission: [permissions.TKB],
      pro: true,
    },
  ];
}
export async function getLeftMenuNotification() {
  return [
    {
      title: 'Danh sách',
      key: 'notification',
      url: [
        '/thong-bao/danh-sach',
        '/thong-bao/tao-moi',
        '/thong-bao/:id/chi-tiet',
        '/thong-bao/:id/chinh-sua',
      ],
      icon: 'icon icon-list',
      permission: [permissions.THONGBAO],
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
      icon: 'icon icon-file',
      permission: [permissions.HA],
    },
    {
      title: 'Duyệt hình',
      key: 'browser',
      url: ['/ghi-nhan/duyet-hinh'],
      icon: 'icon icon-checkmark',
      permission: [permissions.HA],
    },
    {
      title: 'Danh sách',
      key: 'list',
      url: ['/ghi-nhan/danh-sach', '/ghi-nhan/:id/chi-tiet'],
      icon: 'icon icon-list',
      permission: [permissions.HA],
    },
    {
      title: 'Cấu hình',
      key: 'settings-media',
      url: ['/ghi-nhan/cau-hinh'],
      icon: 'icon icon-setting',
      permission: [permissions.HA],
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
      permission: [permissions.SUCKHOE],
    },
    {
      title: 'Cấu hình bình nước',
      key: 'water-bottles',
      url: [
        '/suc-khoe/cau-hinh-binh-nuoc',
        '/suc-khoe/cau-hinh-binh-nuoc/tao-moi',
        '/suc-khoe/cau-hinh-binh-nuoc/:id/chi-tiet',
      ],
      icon: 'icon icon-setting',
      permission: [permissions.SUCKHOE],
    },
    {
      title: 'Lịch sử',
      key: 'history',
      url: ['/suc-khoe/lich-su', '/suc-khoe/lich-su/:id/chi-tiet'],
      icon: 'icon icon-clock',
      permission: [permissions.SUCKHOE],
    },
    {
      title: 'Thống kê',
      key: 'staticstic',
      url: ['/suc-khoe/thong-ke'],
      icon: 'icon icon-checkmark',
      permission: [permissions.SUCKHOE],
    },
  ];
}
export async function getLeftMenuHRM() {
  return [
    {
      title: 'Nhân sự',
      key: 'users',
      icon: 'icon icon-man',
      permission: [permissions.HRM],
      children: [
        {
          title: 'Danh mục',
          key: 'categories',
          permission: [permissions.HRM],
          children: [
            {
              title: 'Cơ sở',
              key: 'branches',
              url: [
                '/quan-ly-nhan-su/cau-hinh/co-so',
                '/quan-ly-nhan-su/cau-hinh/co-so/tao-moi',
                '/quan-ly-nhan-su/cau-hinh/co-so/:id/chi-tiet',
              ],
              permission: [permissions.HRM],
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
              permission: [permissions.HRM],
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
              permission: [permissions.HRM],
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
              permission: [permissions.HRM],
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
              permission: [permissions.HRM],
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
              permission: [permissions.HRM],
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
              permission: [permissions.HRM],
              pro: true,
            },
          ],
        },
        {
          title: 'Hồ sơ Cán bộ nhân viên',
          key: 'employee',
          url: [
            '/quan-ly-nhan-su/nhan-vien',
            '/quan-ly-nhan-su/nhan-vien/tao-moi',
            '/quan-ly-nhan-su/nhan-vien/:id/chi-tiet',
          ],
          permission: [permissions.HRM],
        },
        {
          title: 'Hợp đồng',
          key: 'contracts',
          permission: [permissions.HRM],
          pro: true,
          children: [
            {
              title: 'HĐ thử việc',
              key: 'probationary-contracts',
              url: [
                '/quan-ly-nhan-su/hop-dong-thu-viec',
                '/quan-ly-nhan-su/hop-dong-thu-viec/tao-moi',
                '/quan-ly-nhan-su/hop-dong-thu-viec/:id/chi-tiet',
              ],
              permission: [permissions.HRM],
            },
            {
              title: 'HĐ lao động',
              key: 'labours-contracts',
              url: [
                '/quan-ly-nhan-su/hop-dong-lao-dong',
                '/quan-ly-nhan-su/hop-dong-lao-dong/tao-moi',
                '/quan-ly-nhan-su/hop-dong-lao-dong/:id/chi-tiet',
              ],
              permission: [permissions.HRM],
              pro: true,
            },
            {
              title: 'HĐ thời vụ',
              key: 'seasonal-contracts',
              url: [
                '/quan-ly-nhan-su/hop-dong-thoi-vu',
                '/quan-ly-nhan-su/hop-dong-thoi-vu/tao-moi',
                '/quan-ly-nhan-su/hop-dong-thoi-vu/:id/chi-tiet',
              ],
              permission: [permissions.HRM],
            },
          ],
        },
        {
          title: 'Bảo hiểm xã hội',
          key: 'insurrances',
          url: [
            '/quan-ly-nhan-su/bao-hiem-xa-hoi',
            '/quan-ly-nhan-su/bao-hiem-xa-hoi/tao-moi',
            '/quan-ly-nhan-su/bao-hiem-xa-hoi/:id/chi-tiet',
          ],
          permission: [permissions.HRM],
        },
        {
          title: 'Khai báo các khoản khác',
          key: 'other-declarationss',
          url: [
            '/quan-ly-nhan-su/khai-bao-cac-khoan-khac',
            '/quan-ly-nhan-su/khai-bao-cac-khoan-khac/tao-moi',
            '/quan-ly-nhan-su/khai-bao-cac-khoan-khac/:id/chi-tiet',
          ],
          permission: [permissions.HRM],
        },
        {
          title: 'Thông tin quan hệ gia đình nhân viên',
          key: 'children',
          url: [
            '/quan-ly-nhan-su/thong-ke-con-cua-nhan-vien',
            '/quan-ly-nhan-su/thong-ke-con-cua-nhan-vien/tao-moi',
            '/quan-ly-nhan-su/thong-ke-con-cua-nhan-vien/:id/chi-tiet',
          ],
          permission: [permissions.HRM],
        },
        {
          title: 'Quyết định',
          key: 'QD',
          permission: [permissions.HRM],
          children: [
            {
              title: 'QĐ Điều chuyển',
              key: 'transfers',
              url: [
                '/quan-ly-nhan-su/dieu-chuyen',
                '/quan-ly-nhan-su/dieu-chuyen/tao-moi',
                '/quan-ly-nhan-su/dieu-chuyen/:id/chi-tiet',
              ],
              permission: [permissions.HRM],
            },
            {
              title: 'QĐ Bổ nhiệm',
              key: 'appoints',
              url: [
                '/quan-ly-nhan-su/bo-nhiem',
                '/quan-ly-nhan-su/bo-nhiem/tao-moi',
                '/quan-ly-nhan-su/bo-nhiem/:id/chi-tiet',
              ],
              permission: [permissions.HRM],
            },
            {
              title: 'QĐ Miễn nhiệm',
              key: 'dismisseds',
              url: [
                '/quan-ly-nhan-su/mien-nhiem',
                '/quan-ly-nhan-su/mien-nhiem/tao-moi',
                '/quan-ly-nhan-su/mien-nhiem/:id/chi-tiet',
              ],
              permission: [permissions.HRM],
            },
            {
              title: 'QĐ Kỷ luật - Khen thưởng',
              key: 'decision-rewards',
              url: [
                '/quan-ly-nhan-su/quyet-dinh-khen-thuong-va-ky-luat',
                '/quan-ly-nhan-su/quyet-dinh-khen-thuong-va-ky-luat/tao-moi',
                '/quan-ly-nhan-su/quyet-dinh-khen-thuong-va-ky-luat/:id/chi-tiet',
              ],
              permission: [permissions.HRM],
            },
            {
              title: 'QĐ Tăng lương',
              key: 'salary-increases',
              url: [
                '/quan-ly-nhan-su/tang-luong',
                '/quan-ly-nhan-su/tang-luong/tao-moi',
                '/quan-ly-nhan-su/tang-luong/:id/chi-tiet',
              ],
              permission: [permissions.HRM],
            },
            {
              title: 'QĐ Thôi việc',
              key: 'resignation-decisions',
              url: [
                '/quan-ly-nhan-su/thoi-viec',
                '/quan-ly-nhan-su/thoi-viec/tao-moi',
                '/quan-ly-nhan-su/thoi-viec/:id/chi-tiet',
              ],
              permission: [permissions.HRM],
            },
            {
              title: 'QĐ Tạm hoãn hợp đồng',
              key: 'decision-suspends',
              url: [
                '/quan-ly-nhan-su/tam-hoan-cong-viec',
                '/quan-ly-nhan-su/tam-hoan-cong-viec/tao-moi',
                '/quan-ly-nhan-su/tam-hoan-cong-viec/:id/chi-tiet',
              ],
              permission: [permissions.HRM],
            },
          ],
        },
        {
          title: 'Hồ sơ đã lưu trữ',
          key: 'storages',
          url: ['/quan-ly-nhan-su/luu-tru'],
          permission: [permissions.HRM],
        },
      ],
    },
    {
      title: 'Chấm công',
      key: 'schedules',
      icon: 'icon icon-schedules',
      permission: [permissions.HRM],
      pro: true,
      children: [
        {
          title: 'Danh mục Ca làm việc',
          key: 'config',
          url: [
            '/quan-ly-nhan-su/lich-lam-viec/cau-hinh',
            '/quan-ly-nhan-su/lich-lam-viec/cau-hinh/tao-moi',
            '/quan-ly-nhan-su/lich-lam-viec/cau-hinh/:id/chi-tiet',
          ],
          permission: [permissions.HRM],
          pro: true,
        },
        {
          title: 'Chia ca',
          key: 'schedules',
          url: ['/quan-ly-nhan-su/lich-lam-viec'],
          permission: [permissions.HRM],
          pro: true,
        },
        {
          title: 'Phân ca làm việc',
          key: 'work-shift',
          url: [
            '/quan-ly-nhan-su/phan-ca-lam-viec',
            '/quan-ly-nhan-su/phan-ca-lam-viec/tao-moi',
            '/quan-ly-nhan-su/phan-ca-lam-viec/:id/chi-tiet',
          ],
          permission: [permissions.HRM],
          pro: true,
        },
        {
          title: 'Cấu hình vân tay',
          key: 'fingerprints',
          url: ['/quan-ly-nhan-su/may-cham-cong-van-tay'],
          permission: [permissions.HRM],
          pro: true,
        },
        {
          title: 'Danh mục Ngày nghỉ trong năm',
          key: 'holidays',
          url: [
            '/quan-ly-nhan-su/ngay-nghi-le',
            '/quan-ly-nhan-su/ngay-nghi-le/tao-moi',
            '/quan-ly-nhan-su/ngay-nghi-le/:id/chi-tiet',
          ],
          permission: [permissions.HRM],
        },
        {
          title: 'Danh mục Loại công',
          key: 'AbsentTypes',
          permission: [permissions.HRM],
          url: [
            '/quan-ly-nhan-su/cau-hinh/loai-cong',
            '/quan-ly-nhan-su/cau-hinh/loai-cong/tao-moi',
            '/quan-ly-nhan-su/cau-hinh/loai-cong/:id/chi-tiet',
          ],
        },
        {
          title: 'Phiếu đăng ký',
          key: 'types',
          permission: [permissions.HRM],
          children: [
            {
              title: 'Phiếu đi công tác/ đi ra ngoài',
              key: 'business-cards',
              url: [
                '/quan-ly-nhan-su/don-di-cong-tac',
                '/quan-ly-nhan-su/don-di-cong-tac/tao-moi',
                '/quan-ly-nhan-su/don-di-cong-tac/:id/chi-tiet',
              ],
              permission: [permissions.HRM],
            },
            {
              title: 'Phiếu ĐK giờ làm thêm',
              key: 'work-hours',
              url: [
                '/quan-ly-nhan-su/phieu-dang-ky-gio-lam-them',
                '/quan-ly-nhan-su/phieu-dang-ky-gio-lam-them/tao-moi',
                '/quan-ly-nhan-su/phieu-dang-ky-gio-lam-them/:id/chi-tiet',
              ],
              permission: [permissions.HRM],
              pro: true,
            },
            {
              title: 'Phiếu ĐK đi xe bus',
              key: 'bus-registrations',
              url: [
                '/quan-ly-nhan-su/phieu-dang-ky-di-xe-bus',
                '/quan-ly-nhan-su/phieu-dang-ky-di-xe-bus/tao-moi',
                '/quan-ly-nhan-su/phieu-dang-ky-di-xe-bus/:id/chi-tiet',
              ],
              permission: [permissions.HRM],
              pro: true,
            },
          ],
        },
        {
          title: 'Đơn xin phép',
          key: 'absents',
          url: [
            '/quan-ly-nhan-su/don-xin-phep',
            '/quan-ly-nhan-su/don-xin-phep/tao-moi',
            '/quan-ly-nhan-su/don-xin-phep/:id/chi-tiet',
          ],
          permission: [permissions.HRM],
          pro: true,
        },
        {
          title: 'Lịch sử vào ra',
          key: 'timekeeping',
          url: ['/quan-ly-nhan-su/lich-su-vao-ra'],
          permission: [permissions.HRM],
          pro: true,
        },
        {
          title: 'Không xác định công',
          key: 'timekeeping-invalid',
          url: ['/quan-ly-nhan-su/khong-xac-dinh-cong'],
          permission: [permissions.HRM],
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
          permission: [permissions.HRM],
          pro: true,
        },
        {
          title: 'Bảng tổng hợp công tháng',
          key: 'total',
          url: ['/quan-ly-nhan-su/tong-hop-cong'],
          permission: [permissions.HRM],
          pro: true,
        },
        {
          title: 'Bảng chấm công thêm ngoài giờ',
          key: 'totalOvertime',
          url: ['/quan-ly-nhan-su/bang-cham-cong-them-ngoai-gio'],
          permission: [permissions.HRM],
          pro: true,
        },
        {
          title: 'Bảng chấm công xe bus',
          key: 'totalBus',
          url: ['/quan-ly-nhan-su/bang-cham-cong-xe-bus'],
          permission: [permissions.HRM],
          pro: true,
        },
        {
          title: 'Cấu hình',
          key: 'categoriesParamater',
          permission: [permissions.HRM],
          children: [
            {
              title: 'Máy chấm công',
              key: 'fingerprint-timekeepers',
              url: [
                '/quan-ly-nhan-su/cau-hinh/may-cham-cong',
                '/quan-ly-nhan-su/cau-hinh/may-cham-cong/tao-moi',
                '/quan-ly-nhan-su/cau-hinh/may-cham-cong/:id/chi-tiet',
              ],
              permission: [permissions.HRM],
            },
          ],
        },
      ],
    },
    {
      title: 'Lương',
      key: 'salary',
      icon: 'icon icon-cash',
      permission: [permissions.HRM],
      children: [
        {
          title: 'Tính lương',
          key: 'salary-payroll',
          url: ['/quan-ly-nhan-su/tinh-luong'],
          permission: [permissions.HRM],
          pro: true,
        },
        {
          title: 'Bảng lương',
          key: 'salary-items',
          url: ['/quan-ly-nhan-su/bang-luong'],
          permission: [permissions.HRM],
          pro: true,
        },
      ],
    },
    {
      title: 'Cấu hình',
      key: 'categoriesParamater',
      icon: 'icon icon-setting',
      permission: [permissions.HRM],
      children: [
        {
          title: 'Tham số giá trị',
          key: 'paramater-values',
          url: [
            '/quan-ly-nhan-su/cau-hinh/tham-so-gia-tri',
            '/quan-ly-nhan-su/cau-hinh/tham-so-gia-tri/tao-moi',
            '/quan-ly-nhan-su/cau-hinh/tham-so-gia-tri/:id/chi-tiet',
          ],
          permission: [permissions.HRM],
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
          permission: [permissions.BANGLUONG],
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
          permission: [permissions.HRM],
          pro: true,
        },
      ],
    },
  ];
}
export async function getLeftMenuFeePolicy() {
  return [
    {
      title: 'Báo cáo',
      key: 'report',
      icon: 'icon icon-report',
      permission: [permissions.CHINHSACHPHI],
      children: [
        {
          title: 'Dự kiến các khoản phải thu',
          key: 'expected-fees',
          url: ['/chinh-sach-phi/bao-cao/du-kien-cac-khoan-thu'],
          permission: [permissions.HRM],
          pro: true,
        },
        {
          title: 'Chi tiết các khoản tiền nộp',
          key: 'details-of-payments',
          url: ['/chinh-sach-phi/bao-cao/chi-tiet-cac-khoan-tien-nop'],
          permission: [permissions.HRM],
          pro: true,
        },
        {
          title: 'Lịch nộp tiền học',
          key: 'tuition-payment-schedule',
          url: ['/chinh-sach-phi/bao-cao/lich-nop-tien-hoc'],
          permission: [permissions.HRM],
          pro: true,
        },
      ],
    },
    {
      title: 'Năm học',
      key: 'school-year',
      url: [
        '/chinh-sach-phi/nam-hoc',
        '/chinh-sach-phi/nam-hoc/tao-moi',
        '/chinh-sach-phi/nam-hoc/:id/chi-tiet',
      ],
      icon: 'icon icon-calendar',
      permission: [permissions.CHINHSACHPHI],
    },
    {
      title: 'Phí',
      key: 'fee',
      url: [
        '/chinh-sach-phi/phi',
        '/chinh-sach-phi/phi/tao-moi',
        '/chinh-sach-phi/phi/:id/chi-tiet',
      ],
      icon: 'icon icon-budget',
      permission: [permissions.CHINHSACHPHI],
    },
    {
      title: 'Tiền đóng',
      key: 'pay-fees',
      url: [
        '/chinh-sach-phi/tien-dong',
        '/chinh-sach-phi/tien-dong/tao-moi',
        '/chinh-sach-phi/tien-dong/:id/chi-tiet',
      ],
      icon: 'icon icon-fee-policy',
      permission: [permissions.CHINHSACHPHI],
    },
    {
      title: 'Tính phí học sinh mới',
      key: 'new-student',
      url: [
        '/chinh-sach-phi/tinh-phi-hoc-sinh-moi',
        '/chinh-sach-phi/tinh-phi-hoc-sinh-moi/tao-moi',
        '/chinh-sach-phi/tinh-phi-hoc-sinh-moi/:id/chi-tiet',
      ],
      icon: 'icon icon-calculate',
      permission: [permissions.CHINHSACHPHI],
    },
    {
      title: 'Tính phí học sinh cũ',
      key: 'old-student',
      url: [
        '/chinh-sach-phi/tinh-phi-hoc-sinh-cu',
        '/chinh-sach-phi/tinh-phi-hoc-sinh-cu/tao-moi',
        '/chinh-sach-phi/tinh-phi-hoc-sinh-cu/:id/chi-tiet',
      ],
      icon: 'icon icon-calculate',
      permission: [permissions.CHINHSACHPHI],
    },
  ];
}
export async function getTopMenuData() {
  return [];
}

export async function getLeftMenuNotes() {
  return [
    {
      title: 'Danh sách',
      key: 'items',
      url: ['/ghi-chu/danh-sach', '/ghi-chu/tao-moi', '/ghi-chu/:id/chi-tiet'],
      icon: 'icon icon-list',
      permission: [permissions.GHICHU],
      pro: true,
    },
  ];
}

export async function getLeftMenuSalary() {
  return [
    {
      title: 'Tính lương',
      key: 'payroll',
      icon: 'icon icon-calculate',
      url: ['/bang-luong/tinh-luong'],
      permission: [permissions.BANGLUONG],
    },
    {
      title: 'Bảng lương',
      key: 'salary',
      icon: 'icon icon-salary',
      url: ['/bang-luong/danh-sach'],
      permission: [permissions.BANGLUONG],
    },
    {
      title: 'Cấu hình',
      key: 'categoriesParamater',
      icon: 'icon icon-setting',
      permission: [permissions.BANGLUONG],
      children: [
        {
          title: 'Tham số công thức',
          key: 'paramater-formulas',
          url: [
            '/bang-luong/tham-so-cong-thuc',
            '/bang-luong/tham-so-cong-thuc/tao-moi',
            '/bang-luong/tham-so-cong-thuc/:id/chi-tiet',
          ],
          permission: [permissions.BANGLUONG],
          pro: true,
        },
      ],
    },
  ];
}

export async function getLeftMenuPhysical() {
  return [
    {
      title: 'Tất cả học sinh',
      key: 'students',
      icon: 'icon icon-list',
      url: [
        '/phat-trien-the-chat/tat-ca-hoc-sinh',
        '/phat-trien-the-chat/tao-the-chat',
        '/phat-trien-the-chat/:id/chi-tiet',
        '/phat-trien-the-chat/:id/chi-tiet/nhap-the-chat',
      ],
      permission: [],
    },
    {
      title: 'Học sinh thừa cân',
      key: 'overweight-students',
      icon: 'icon icon-list',
      url: ['/phat-trien-the-chat/hoc-sinh-thua-can'],
      permission: [],
    },
    {
      title: 'Học sinh thiếu cân',
      key: 'underweight-students',
      icon: 'icon icon-list',
      url: ['/phat-trien-the-chat/hoc-sinh-thieu-can'],
      permission: [],
    },
    {
      title: 'Lịch sử',
      key: 'history',
      url: ['/phat-trien-the-chat/lich-su'],
      icon: 'icon icon-clock',
      permission: [],
      pro: true,
    },
  ];
}

export async function getLeftMenuCRM() {
  return [
    {
      title: 'Quản lý hệ thống',
      key: 'manage',
      icon: 'icon icon-setting',
      permission: [permissions.CRM],
      children: [
        {
          title: 'Người dùng',
          key: 'manage-user',
          url: [
            '/crm/quan-ly-he-thong/nguoi-dung',
            '/crm/quan-ly-he-thong/nguoi-dung/tao-moi',
            '/crm/quan-ly-he-thong/nguoi-dung/:id/chi-tiet',
          ],
          permission: [permissions.CRM],
          pro: true,
        },
        {
          title: 'Vai trò',
          key: 'manage-roles',
          url: [
            '/crm/quan-ly-he-thong/vai-tro',
            '/crm/quan-ly-he-thong/vai-tro/tao-moi',
            '/crm/quan-ly-he-thong/vai-tro/:id/chi-tiet',
          ],
          permission: [permissions.CRM],
          pro: true,
        },
        {
          title: 'Nhóm',
          key: 'manage-group',
          url: [
            '/crm/quan-ly-he-thong/nhom',
            '/crm/quan-ly-he-thong/nhom/tao-moi',
            '/crm/quan-ly-he-thong/nhom/:id/chi-tiet',
          ],
          permission: [permissions.CRM],
          pro: true,
        },
      ],
    },
    {
      title: 'Danh mục',
      key: 'category',
      icon: 'icon icon-list',
      permission: [permissions.CRM],
      children: [
        {
          title: 'Tình trạng PH Lead',
          key: 'lead',
          url: [
            '/crm/danh-muc/ph-lead',
            '/crm/danh-muc/ph-lead/tao-moi',
            '/crm/danh-muc/ph-lead/:id/chi-tiet',
          ],
          permission: [permissions.CRM],
          pro: true,
        },
        {
          title: 'Tình trạng PH Tiềm năng',
          key: 'potential',
          url: [
            '/crm/danh-muc/ph-tiem-nang',
            '/crm/danh-muc/ph-tiem-nang/tao-moi',
            '/crm/danh-muc/ph-tiem-nang/:id/chi-tiet',
          ],
          permission: [permissions.CRM],
          pro: true,
        },
        {
          title: 'Nguồn tìm kiếm',
          key: 'search',
          url: [
            '/crm/danh-muc/tim-kiem',
            '/crm/danh-muc/tim-kiem/tao-moi',
            '/crm/danh-muc/tim-kiem/:id/chi-tiet',
          ],
          permission: [permissions.CRM],
          pro: true,
        },
        {
          title: 'Tags',
          key: 'tags',
          url: ['/crm/danh-muc/tags'],
          permission: [permissions.CRM],
          pro: true,
        },
        {
          title: 'Tỉnh thành',
          key: 'city',
          url: [
            '/crm/danh-muc/tinh-thanh',
            '/crm/danh-muc/tinh-thanh/tao-moi',
            '/crm/danh-muc/tinh-thanh/:id/chi-tiet',
          ],
          permission: [permissions.CRM],
          pro: true,
        },
        {
          title: 'Quận Huyện',
          key: 'district',
          url: [
            '/crm/danh-muc/quan-huyen',
            '/crm/danh-muc/quan-huyen/tao-moi',
            '/crm/danh-muc/quan-huyen/:id/chi-tiet',
          ],
          permission: [permissions.CRM],
          pro: true,
        },
        {
          title: 'Xã Phường',
          key: 'townWards',
          url: [
            '/crm/danh-muc/xa-phuong',
            '/crm/danh-muc/xa-phuong/tao-moi',
            '/crm/danh-muc/xa-phuong/:id/chi-tiet',
          ],
          permission: [permissions.CRM],
          pro: true,
        },
        {
          title: 'Cơ sở',
          key: 'basis',
          url: [
            '/crm/danh-muc/co-so',
            '/crm/danh-muc/co-so/tao-moi',
            '/crm/danh-muc/co-so/:id/chi-tiet',
          ],
          permission: [permissions.CRM],
          pro: true,
        },
        {
          title: 'Đăng ký nhập học',
          key: 'admission',
          url: [
            '/crm/danh-muc/dang-ky-nhap-hoc',
            '/crm/danh-muc/dang-ky-nhap-hoc/tao-moi',
            '/crm/danh-muc/dang-ky-nhap-hoc/:id/chi-tiet',
          ],
          permission: [permissions.CRM],
          pro: true,
        },
        {
          title: 'Mối quan hệ',
          key: 'relationship',
          url: [
            '/crm/danh-muc/moi-quan-he',
            '/crm/danh-muc/moi-quan-he/tao-moi',
            '/crm/danh-muc/moi-quan-he/:id/chi-tiet',
          ],
          permission: [permissions.CRM],
          pro: true,
        },
        {
          title: 'Loại sự kiện',
          key: 'event',
          url: [
            '/crm/danh-muc/loai-su-kien',
            '/crm/danh-muc/loai-su-kien/tao-moi',
            '/crm/danh-muc/loai-su-kien/:id/chi-tiet',
          ],
          permission: [permissions.CRM],
          pro: true,
        },
        {
          title: 'Kỹ năng',
          key: 'skill',
          url: [
            '/crm/danh-muc/ky-nang',
            '/crm/danh-muc/ky-nang/tao-moi',
            '/crm/danh-muc/ky-nang/:id/chi-tiet',
          ],
          permission: [permissions.CRM],
          pro: true,
        },
        {
          title: 'Vấn đề khó khăn của trẻ',
          key: 'ChildrensProblems',
          url: [
            '/crm/danh-muc/van-de-kho-khan-cua-tre',
            '/crm/danh-muc/van-de-kho-khan-cua-tre/tao-moi',
            '/crm/danh-muc/van-de-kho-khan-cua-tre/:id/chi-tiet',
          ],
          permission: [permissions.CRM],
          pro: true,
        },
        {
          title: 'Câu hỏi đánh giá cho phụ huynh',
          key: 'review-question',
          url: ['/crm/danh-muc/cau-hoi-danh-gia-cho-phu-huynh'],
          permission: [permissions.CRM],
          pro: true,
        },
        {
          title: 'Kịch bản đánh giá',
          key: 'review-scenario',
          url: [
            '/crm/danh-muc/kich-ban-danhh-gia',
            '/crm/danh-muc/kich-ban-danhh-gia/tao-moi',
            '/crm/danh-muc/kich-ban-danhh-gia/:id/chi-tiet',
          ],
          permission: [permissions.CRM],
          pro: true,
        },
      ],
    },
    {
      title: 'Sale',
      key: 'sale',
      icon: 'icon icon-cash',
      permission: [permissions.CRM],
      children: [
        {
          title: 'Phụ huynh Lead',
          key: 'sale-lead',
          url: [
            '/crm/sale/ph-lead',
            '/crm/sale/ph-lead/trung',
            '/crm/sale/ph-lead/tao-moi',
            '/crm/sale/ph-lead/:id/chi-tiet',
            '/crm/sale/ph-lead/:id/chi-tiet/them-lich-su',
            '/crm/sale/ph-lead/:id/chi-tiet/gui-email',
            '/crm/sale/ph-lead/:id/chi-tiet/them-su-kien',
            '/crm/sale/ph-lead/:id/chi-tiet/:detailId/chi-tiet-su-kien',
          ],
          permission: [permissions.CRM],
          pro: true,
        },
        {
          title: 'Phụ huynh Tiềm năng',
          key: 'sale-potential',
          url: [
            '/crm/sale/ph-tiem-nang',
            '/crm/sale/ph-tiem-nang/tao-moi',
            '/crm/sale/ph-tiem-nang/:id/chi-tiet',
          ],
          permission: [permissions.CRM],
          pro: true,
        },
        {
          title: 'Đăng ký nhập học',
          key: 'sale-admission',
          url: [
            '/crm/sale/dang-ky-nhap-hoc',
            '/crm/sale/dang-ky-nhap-hoc/tao-moi',
            '/crm/sale/dang-ky-nhap-hoc/:id/chi-tiet',
          ],
          permission: [permissions.CRM],
          pro: true,
        },
      ],
    },
    {
      title: 'Chat',
      key: 'messages',
      icon: 'icon icon-bubble2',
      permission: [permissions.CRM],
      children: [
        {
          title: 'Facebook',
          key: 'facebook',
          url: ['/crm/chat/facebook'],
          permission: [permissions.CRM],
          pro: true,
        },
        {
          title: 'Zalo',
          key: 'zalo',
          url: ['/crm/chat/zalo'],
          permission: [permissions.CRM],
          pro: true,
        },
      ],
    },
    {
      title: 'Marketing',
      key: 'marketing',
      icon: 'icon icon-bullhorn',
      permission: [permissions.CRM],
      children: [
        {
          title: 'Quản lý chương trình',
          key: 'marketing-manage',
          url: [
            '/crm/tiep-thi/quan-ly-chuong-trinh',
            '/crm/tiep-thi/quan-ly-chuong-trinh/tao-moi',
            '/crm/tiep-thi/quan-ly-chuong-trinh/:id/chi-tiet',
            '/crm/tiep-thi/quan-ly-chuong-trinh/:id/chi-tiet/them-bai-viet',
          ],
          permission: [permissions.CRM],
          pro: true,
        },
        {
          title: 'Data marketing',
          key: 'marketing-data',
          url: [
            '/crm/tiep-thi/du-lieu',
            '/crm/tiep-thi/du-lieu/tao-moi',
            '/crm/tiep-thi/du-lieu/:id/chi-tiet',
            '/crm/tiep-thi/du-lieu/:id/chi-tiet/tao-moi',
          ],
          permission: [permissions.CRM],
          pro: true,
        },
      ],
    },
    {
      title: 'Đánh giá',
      key: 'evaluate',
      icon: 'icon icon-clipboard',
      permission: [permissions.CRM],
      children: [
        {
          title: 'Đánh giá từ PH',
          key: 'evaluate-parents',
          url: [
            '/crm/danh-gia/danh-gia-tu-phu-huynh',
            '/crm/danh-gia/danh-gia-tu-phu-huynh/tao-moi',
            '/crm/danh-gia/danh-gia-tu-phu-huynh/:id/chi-tiet',
          ],
          permission: [permissions.CRM],
          pro: true,
        },
        {
          title: 'Đánh giá đầu vào',
          key: 'nput-rating',
          url: ['/crm/danh-gia/danh-gia-dau-vao', '/crm/danh-gia/danh-gia-dau-vao/:id/chi-tiet'],
          permission: [permissions.CRM],
          pro: true,
        },
        {
          title: 'Đánh giá định kỳ',
          key: '',
          url: [],
          permission: [permissions.CRM],
          pro: true,
        },
      ],
    },
    {
      title: 'Cấu hình',
      key: 'configurationCrm',
      icon: 'icon icon-wrench',
      permission: [permissions.CRM],
      children: [
        {
          title: 'Cảnh báo',
          key: '',
          url: [],
          permission: [permissions.CRM],
          pro: true,
        },
        {
          title: 'Khai báo y tế',
          key: 'health-declaration',
          url: ['/crm/cau-hinh/khai-bao-y-te'],
          permission: [permissions.CRM],
          pro: true,
        },
        {
          title: 'Thông tin hồ sơ',
          key: 'configuration-file',
          url: ['/crm/cau-hinh/danh-sach-ho-so'],
          permission: [permissions.CRM],
          pro: true,
        },
        {
          title: 'Kiểm tra đầu vào',
          key: '',
          url: [],
          permission: [permissions.CRM],
          pro: true,
        },
      ],
    },
  ];
}

export async function getLeftMenuChildDevelop() {
  return [
    {
      title: 'Danh mục',
      key: 'childsDevelop',
      icon: 'icon icon-list',
      permission: [],
      children: [
        {
          title: 'Kỹ năng',
          key: 'child-develop',
          url: [
            '/su-phat-trien-cua-tre/danh-muc/ky-nang',
            '/su-phat-trien-cua-tre/danh-muc/ky-nang/tao-moi',
            '/su-phat-trien-cua-tre/danh-muc/ky-nang/:id/chi-tiet',
          ],
          permission: [],
          pro: true,
        },
        {
          title: 'Câu hỏi đánh giá của trẻ',
          key: 'review-question',
          url: ['/su-phat-trien-cua-tre/danh-muc/cau-hoi-danh-gia-cua-tre'],
          permission: [],
          pro: true,
        },
        {
          title: 'Vấn đề khó khăn của trẻ',
          key: 'childrens-problems',
          url: [
            '/su-phat-trien-cua-tre/danh-muc/van-de-kho-khan-cua-tre',
            '/su-phat-trien-cua-tre/danh-muc/van-de-kho-khan-cua-tre/tao-moi',
            '/su-phat-trien-cua-tre/danh-muc/van-de-kho-khan-cua-tre/:id/chi-tiet',
          ],
          permission: [],
          pro: true,
        },
      ],
    },
    {
      title: 'Cấu hình kịch bản đánh giá',
      key: '/childrens-problems',
      icon: 'icon icon-setting',
      permission: [],
      url: [
        '/su-phat-trien-cua-tre/cau-hinh-kich-ban-danh-gia',
        '/su-phat-trien-cua-tre/cau-hinh-kich-ban-danh-gia/tao-moi',
        '/su-phat-trien-cua-tre/cau-hinh-kich-ban-danh-gia/:id/chi-tiet',
      ],
    },
  ];
}
