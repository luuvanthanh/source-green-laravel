export default [
  {
    path: '/',
    component: '../layouts',
    routes: [
      {
        path: '/',
        redirect: '/trang-chu',
      },
      {
        path: '/login',
        component: './login',
      },
      {
        path: '/trang-chu',
        component: './home',
      },
      // CRITERIA
      {
        path: '/tieu-chi-danh-gia',
        component: './criteria/layout',
        routes: [
          {
            path: '/tieu-chi-danh-gia/danh-gia-hoc-tap',
            component: './criteria/learn',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/tieu-chi-danh-gia/danh-gia-hoc-tap/tao-moi',
            component: './criteria/learn/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/tieu-chi-danh-gia/luong-nuoc-uong',
            component: './criteria/water',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/tieu-chi-danh-gia/cau-hinh/kieu-du-lieu',
            component: './criteria/criteria-datatypes',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/tieu-chi-danh-gia/cau-hinh/kieu-du-lieu/tao-moi',
            component: './criteria/criteria-datatypes/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/tieu-chi-danh-gia/cau-hinh/kieu-du-lieu/:id/chi-tiet',
            component: './criteria/criteria-datatypes/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/tieu-chi-danh-gia/cau-hinh/nhom-tieu-chi',
            component: './criteria/criteria-groups',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/tieu-chi-danh-gia/cau-hinh/nhom-tieu-chi/tao-moi',
            component: './criteria/criteria-groups/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/tieu-chi-danh-gia/cau-hinh/nhom-tieu-chi/:id/chi-tiet',
            component: './criteria/criteria-groups/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/tieu-chi-danh-gia/cau-hinh/thuoc-nhom-tieu-chi',
            component: './criteria/criteria-group-properties',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/tieu-chi-danh-gia/cau-hinh/thuoc-nhom-tieu-chi/tao-moi',
            component: './criteria/criteria-group-properties/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/tieu-chi-danh-gia/cau-hinh/thuoc-nhom-tieu-chi/:id/chi-tiet',
            component: './criteria/criteria-group-properties/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
        ],
      },
      // CRITERIA
      {
        path: '/thuc-don',
        component: './menu/layout',
        routes: [
          {
            path: '/thuc-don',
            component: './menu/index-v2',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/thuc-don/tao-moi',
            component: './menu/create-v2',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
        ],
      },
      {
        path: '/khao-sat',
        component: './survey/layout',
        routes: [
          {
            path: '/khao-sat',
            component: './survey',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/khao-sat/tao-moi',
            component: './survey/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
        ],
      },
      // VEHICEL
      {
        path: '/quan-ly-phuong-tien',
        component: './vehicle/layout',
        routes: [
          {
            path: '/quan-ly-phuong-tien',
            redirect: '/quan-ly-phuong-tien/xe',
          },
          {
            path: '/quan-ly-phuong-tien/xe',
            component: './vehicle/items',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-phuong-tien/xe/tao-moi',
            component: './vehicle/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-phuong-tien/quan-ly-lo-trinh',
            component: './vehicle/tutorial',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-phuong-tien/quan-ly-lo-trinh/tao-moi',
            component: './vehicle/tutorial/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-phuong-tien/lich-su',
            component: './vehicle/history',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-phuong-tien/hom-nay',
            component: './vehicle/today',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
        ],
      },
      // VEHICEL
      {
        path: '/dan-thuoc',
        component: './recommend/layout',
        routes: [
          {
            path: '/dan-thuoc',
            component: './recommend',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
        ],
      },
      // EXCHANGE
      {
        path: '/trao-doi',
        component: './exchange/layout',
        routes: [
          {
            path: '/trao-doi',
            redirect: '/trao-doi/danh-sach',
          },
          {
            path: '/trao-doi/danh-sach',
            component: './exchange/items',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/trao-doi/tao-moi',
            component: './exchange/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/trao-doi/:id/chi-tiet',
            component: './exchange/details',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/trao-doi/can-duyet',
            component: './exchange/approve',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
        ],
      },
      // EXCHANGE
      // OBJECT PROFILES
      {
        path: '/ho-so-doi-tuong',
        component: './object-profiles/layout',
        routes: [
          {
            path: '/ho-so-doi-tuong',
            redirect: '/ho-so-doi-tuong/hoc-sinh',
          },
          {
            path: '/ho-so-doi-tuong/hoc-sinh',
            component: './object-profiles/children',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/ho-so-doi-tuong/hoc-sinh/tao-moi',
            component: './object-profiles/children/create',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/ho-so-doi-tuong/hoc-sinh/:id/chi-tiet',
            component: './object-profiles/children/create',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/ho-so-doi-tuong/phu-huynh',
            component: './object-profiles/parents',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/ho-so-doi-tuong/phu-huynh/:id/chi-tiet',
            component: './object-profiles/parents/create',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/ho-so-doi-tuong/phu-huynh/tao-moi',
            component: './object-profiles/parents/create',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/ho-so-doi-tuong/nhan-vien',
            component: './object-profiles/users',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/ho-so-doi-tuong/nhan-vien/tao-moi',
            component: './object-profiles/users/create',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/ho-so-doi-tuong/nhan-vien/:id/chi-tiet',
            component: './object-profiles/users/create',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/ho-so-doi-tuong/phu-huynh/luu-tru',
            component: './object-profiles/stores/parents',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/ho-so-doi-tuong/hoc-sinh/luu-tru',
            component: './object-profiles/stores/students',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/ho-so-doi-tuong/nhan-vien/luu-tru',
            component: './object-profiles/stores/employees',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/ho-so-doi-tuong/cau-hinh/lop-hoc',
            component: './object-profiles/configuration/class',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/ho-so-doi-tuong/cau-hinh/lop-hoc/tao-moi',
            component: './object-profiles/configuration/class/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/ho-so-doi-tuong/cau-hinh/lop-hoc/:id/chi-tiet',
            component: './object-profiles/configuration/class/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/ho-so-doi-tuong/cau-hinh/co-so',
            component: './object-profiles/configuration/branches',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/ho-so-doi-tuong/cau-hinh/co-so/tao-moi',
            component: './object-profiles/configuration/branches/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/ho-so-doi-tuong/cau-hinh/co-so/:id/chi-tiet',
            component: './object-profiles/configuration/branches/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
        ],
      },
      // OBJECT PROFILES
      // Attendance
      {
        path: '/diem-danh',
        component: './attendance/layout',
        routes: [
          {
            path: '/diem-danh',
            redirect: '/diem-danh/hoc-sinh',
          },
          {
            path: '/diem-danh/hoc-sinh',
            component: './attendance/children',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/cau-hinh',
            component: './attendance/settings',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/cau-hinh/tao-moi',
            component: './attendance/settings/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/cau-hinh/:id/chi-tiet',
            component: './attendance/settings/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/tong-hop-cong',
            component: './attendance/works/total',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/tong-hop-cong-gio',
            component: './attendance/works/hours',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/may-cham-cong-van-tay',
            component: './attendance/fingerprints',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/lich-su-vao-ra',
            component: './attendance/timekeeping',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/di-tre-ve-som',
            component: './attendance/late-early',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/don-xin-phep',
            component: './attendance/absents/annual-leave',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/don-xin-phep/tao-moi',
            component: './attendance/absents/annual-leave/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/cau-hinh/loai-nghi-phep',
            component: './attendance/absents/config/absent-types',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/cau-hinh/ly-do-nghi-phep',
            component: './attendance/absents/config/absent-reasons',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/cau-hinh/ly-do-nghi-phep/tao-moi',
            component: './attendance/absents/config/absent-reasons/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/cau-hinh/ly-do-nghi-phep/:id/chi-tiet',
            component: './attendance/absents/config/absent-reasons/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/cong-them',
            component: './attendance/additional-times',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/cong-them/tao-moi',
            component: './attendance/additional-times/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/cong-them/:id/chi-tiet',
            component: './attendance/additional-times/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/cong-tru',
            component: './attendance/subtraction-times',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/cong-tru/tao-moi',
            component: './attendance/subtraction-times/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/cong-tru/:id/chi-tiet',
            component: './attendance/subtraction-times/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/khong-xac-dinh-cong',
            component: './attendance/timekeeping-invalid',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/bo-ca',
            component: './attendance/revoke-shifts',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/khai-bao-cong',
            component: './attendance/work-declarations',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/khai-bao-cong/tao-moi',
            component: './attendance/work-declarations/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/cong-gio-ho-tro',
            component: './attendance/work-hours',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/cong-gio-ho-tro/tao-moi',
            component: './attendance/work-hours/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
        ],
      },
      // Attendance
      // CONFIGURATION
      {
        path: '/cau-hinh',
        component: './configuration/layout',
        routes: [
          {
            path: '/cau-hinh',
            redirect: '/cau-hinh/tai-khoan',
          },
          {
            path: '/cau-hinh/tai-khoan',
            component: './configuration/account',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/cau-hinh/tai-khoan/tao-moi',
            component: './configuration/account/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/cau-hinh/tai-khoan/:id/chi-tiet',
            component: './configuration/account/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/cau-hinh/vai-tro',
            component: './configuration/roles',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/cau-hinh/vai-tro/tao-moi',
            component: './configuration/roles/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/cau-hinh/vai-tro/:id/chi-tiet',
            component: './configuration/roles/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/cau-hinh/phan-quyen',
            component: './configuration/permissions',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/cau-hinh/mon-hoc',
            component: './configuration/subjects',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/cau-hinh/mon-hoc/tao-moi',
            component: './configuration/subjects/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/cau-hinh/mon-hoc/:id/chi-tiet',
            component: './configuration/subjects/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/cau-hinh/lich-hoc',
            component: './configuration/schedules',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/cau-hinh/lich-hoc/tao-moi',
            component: './configuration/schedules/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/cau-hinh/lich-hoc/:id/chi-tiet',
            component: './configuration/schedules/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/cau-hinh/loai-cong-viec',
            component: './configuration/job-types',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/cau-hinh/loai-cong-viec/tao-moi',
            component: './configuration/job-types/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/cau-hinh/loai-cong-viec/:id/chi-tiet',
            component: './configuration/job-types/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/cau-hinh/cap-bac',
            component: './configuration/manager-level',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/cau-hinh/cap-bac/tao-moi',
            component: './configuration/manager-level/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/cau-hinh/cap-bac/:id/chi-tiet',
            component: './configuration/manager-level/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/cau-hinh/tablet-giao-vien',
            component: './configuration/tablet',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/cau-hinh/tablet-giao-vien/tao-moi',
            component: './configuration/tablet/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/cau-hinh/tablet-giao-vien/:id/chi-tiet',
            component: './configuration/tablet/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
        ],
      },
      // CONFIGURATION
      // HRM
      {
        path: '/quan-ly-nhan-su',
        component: './hrm/layout',
        routes: [
          {
            path: '/quan-ly-nhan-su',
            redirect: '/quan-ly-nhan-su/nhan-vien',
          },
          {
            path: '/quan-ly-nhan-su/cau-hinh/co-so',
            component: './hrm/configuration/branches',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-nhan-su/cau-hinh/co-so/tao-moi',
            component: './hrm/configuration/branches/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-nhan-su/cau-hinh/co-so/:id/chi-tiet',
            component: './hrm/configuration/branches/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-nhan-su/cau-hinh/loai-hop-dong',
            component: './hrm/configuration/type-of-contracts',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-nhan-su/cau-hinh/loai-hop-dong/tao-moi',
            component: './hrm/configuration/type-of-contracts/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-nhan-su/cau-hinh/loai-hop-dong/:id/chi-tiet',
            component: './hrm/configuration/type-of-contracts/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-nhan-su/cau-hinh/bo-phan',
            component: './hrm/configuration/divisions',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-nhan-su/cau-hinh/bo-phan/tao-moi',
            component: './hrm/configuration/divisions/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-nhan-su/cau-hinh/bo-phan/:id/chi-tiet',
            component: './hrm/configuration/divisions/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-nhan-su/cau-hinh/chuc-vu',
            component: './hrm/configuration/positions',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-nhan-su/cau-hinh/chuc-vu/tao-moi',
            component: './hrm/configuration/positions/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-nhan-su/cau-hinh/chuc-vu/:id/chi-tiet',
            component: './hrm/configuration/positions/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-nhan-su/cau-hinh/truong-dao-tao',
            component: './hrm/configuration/training-schools',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-nhan-su/cau-hinh/truong-dao-tao/tao-moi',
            component: './hrm/configuration/training-schools/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-nhan-su/cau-hinh/truong-dao-tao/:id/chi-tiet',
            component: './hrm/configuration/training-schools/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-nhan-su/cau-hinh/bang-cap',
            component: './hrm/configuration/degrees',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-nhan-su/cau-hinh/bang-cap/tao-moi',
            component: './hrm/configuration/degrees/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-nhan-su/cau-hinh/bang-cap/:id/chi-tiet',
            component: './hrm/configuration/degrees/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-nhan-su/cau-hinh/nganh-dao-tao',
            component: './hrm/configuration/training-majors',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-nhan-su/cau-hinh/nganh-dao-tao/tao-moi',
            component: './hrm/configuration/training-majors/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-nhan-su/cau-hinh/nganh-dao-tao/:id/chi-tiet',
            component: './hrm/configuration/training-majors/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-nhan-su/cau-hinh/trinh-do-hoc-van',
            component: './hrm/configuration/educational-levels',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-nhan-su/cau-hinh/trinh-do-hoc-van/tao-moi',
            component: './hrm/configuration/educational-levels/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-nhan-su/cau-hinh/trinh-do-hoc-van/:id/chi-tiet',
            component: './hrm/configuration/educational-levels/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-nhan-su/cau-hinh/tham-so-gia-tri',
            component: './hrm/configuration/paramater-values',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-nhan-su/cau-hinh/tham-so-gia-tri/tao-moi',
            component: './hrm/configuration/paramater-values/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-nhan-su/cau-hinh/tham-so-gia-tri/:id/chi-tiet',
            component: './hrm/configuration/paramater-values/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-nhan-su/cau-hinh/tham-so-cong-thuc',
            component: './hrm/configuration/paramater-formulas',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-nhan-su/cau-hinh/tham-so-cong-thuc/tao-moi',
            component: './hrm/configuration/paramater-formulas/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-nhan-su/cau-hinh/tham-so-cong-thuc/:id/chi-tiet',
            component: './hrm/configuration/paramater-formulas/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-nhan-su/nhan-vien',
            component: './hrm/users',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-nhan-su/nhan-vien/tao-moi',
            component: './hrm/users/create',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly-nhan-su/nhan-vien/:id/chi-tiet',
            component: './hrm/users/create',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
        ],
      },
      // HRM
      // ALLOCATION
      {
        path: '/phan-bo',
        component: './allocation/layout',
        routes: [
          {
            path: '/phan-bo',
            redirect: '/phan-bo/lich-su',
          },
          {
            path: '/phan-bo/lich-su',
            component: './allocation/histories',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/phan-bo/hoc-sinh/tre-chua-xep-lop',
            component: './allocation/children/arrange-class',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/phan-bo/hoc-sinh/chuyen-lop',
            component: './allocation/children/change-class',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/phan-bo/giao-vien/chua-xep-lop',
            component: './allocation/teacher/no-class',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/phan-bo/giao-vien/danh-sach',
            component: './allocation/teacher/list',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/phan-bo/giao-vien/dieu-chuyen',
            component: './allocation/teacher/transfers',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/phan-bo/nhan-vien/danh-sach',
            component: './allocation/users/list',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/phan-bo/nhan-vien/dieu-chuyen',
            component: './allocation/users/transfers',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/phan-bo/nhan-vien/chua-xep-lop',
            component: './allocation/users/no-class',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
        ],
      },
      // ALLOCATION
      // MEDICAL
      {
        path: '/y-te',
        component: './medical/layout',
        routes: [
          {
            path: '/y-te',
            redirect: '/y-te/thong-ke',
          },
          {
            path: '/y-te/thong-ke',
            component: './medical/items',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/y-te/thong-ke/:id/chi-tiet',
            component: './medical/items/details',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/y-te/thong-ke/tao-moi',
            component: './medical/items/create',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/y-te/lich-su',
            component: './medical/histories',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
        ],
      },
      {
        path: '/thoi-khoa-bieu',
        component: './timetable/layout',
        routes: [
          {
            path: '/thoi-khoa-bieu',
            component: './timetable/items',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/thoi-khoa-bieu/tao-moi',
            component: './timetable/items/create',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
        ],
      },
      // MEDICAL
      // NOTIFICATION
      {
        path: '/thong-bao',
        component: './notification/layout',
        routes: [
          {
            path: '/thong-bao',
            redirect: '/thong-bao',
          },
          {
            path: '/thong-bao/danh-sach',
            component: './notification',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/thong-bao/tao-moi',
            component: './notification/create',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/thong-bao/:id/chi-tiet',
            component: './notification/details',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
        ],
      },
      // NOTIFICATION
      // MEDIA
      {
        path: '/ghi-nhan',
        component: './media/layout',
        routes: [
          {
            path: '/ghi-nhan',
            redirect: '/ghi-nhan/danh-sach',
          },
          {
            path: '/ghi-nhan/danh-sach',
            component: './media',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/ghi-nhan/:id/chi-tiet',
            component: './media/details',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/ghi-nhan/duyet-hinh/ket-qua',
            component: './media/browser/result',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/ghi-nhan/duyet-hinh',
            component: './media/browser',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
        ],
      },
      // MEDIA
      // HEALTH
      {
        path: '/suc-khoe',
        component: './health/layout',
        routes: [
          {
            path: '/suc-khoe',
            redirect: '/suc-khoe/hom-nay',
          },
          {
            path: '/suc-khoe/hom-nay',
            component: './health',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/suc-khoe/lich-su',
            component: './health/history',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/suc-khoe/hom-nay/tao-moi',
            component: './health/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/suc-khoe/hom-nay/:id/chi-tiet',
            component: './health/update',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/suc-khoe/lich-su/:id/chi-tiet',
            component: './health/details',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
        ],
      },
      // HEALTH
      {
        path: '/404',
        component: './404',
      },
      {
        component: './404',
      },
    ],
  },
];
