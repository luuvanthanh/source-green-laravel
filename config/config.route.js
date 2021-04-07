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
        ],
      },
      // CRITERIA
      {
        path: '/thuc-don-cho-tre',
        component: './menu/layout',
        routes: [
          {
            path: '/thuc-don-cho-tre',
            component: './menu',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/thuc-don-cho-tre/tao-moi',
            component: './menu/add',
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
            path: '/ho-so-doi-tuong/phu-huynh',
            component: './object-profiles/parents',
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
        ],
      },
      // OBJECT PROFILES
      // SCHEDULES
      {
        path: '/diem-danh',
        component: './schedules/layout',
        routes: [
          {
            path: '/diem-danh',
            redirect: '/diem-danh/hoc-sinh',
          },
          {
            path: '/diem-danh/hoc-sinh',
            component: './schedules/children',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/cau-hinh',
            component: './schedules/settings',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/cau-hinh/tao-moi',
            component: './schedules/settings/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/cau-hinh/:id/chi-tiet',
            component: './schedules/settings/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/tong-hop-cong',
            component: './schedules/works/total',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/tong-hop-cong-gio',
            component: './schedules/works/hours',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/may-cham-cong-van-tay',
            component: './schedules/fingerprints',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/lich-su-vao-ra',
            component: './schedules/timekeeping',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/di-tre-ve-som',
            component: './schedules/late-early',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/don-xin-phep',
            component: './schedules/absents/annual-leave',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/don-xin-phep/tao-moi',
            component: './schedules/absents/annual-leave/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/cau-hinh/loai-nghi-phep',
            component: './schedules/absents/config/absent-types',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/cau-hinh/ly-do-nghi-phep',
            component: './schedules/absents/config/absent-reasons',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/cau-hinh/ly-do-nghi-phep/tao-moi',
            component: './schedules/absents/config/absent-reasons/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/diem-danh/cau-hinh/ly-do-nghi-phep/:id/chi-tiet',
            component: './schedules/absents/config/absent-reasons/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
        ],
      },
      // SCHEDULES
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
            path: '/cau-hinh/chi-nhanh',
            component: './configuration/stores',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/cau-hinh/chi-nhanh/tao-moi',
            component: './configuration/stores/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/cau-hinh/chi-nhanh/:id/chi-tiet',
            component: './configuration/stores/add',
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
            path: '/cau-hinh/lop-hoc',
            component: './configuration/class',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/cau-hinh/lop-hoc/tao-moi',
            component: './configuration/class/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/cau-hinh/lop-hoc/:id/chi-tiet',
            component: './configuration/class/add',
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
        ],
      },
      // CONFIGURATION
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
            path: '/phan-bo/hoc-sinh',
            component: './allocation/children',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
        ],
      },
      // ALLOCATION
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
