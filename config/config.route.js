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
      {
        path: '/thoi-khoa-bieu',
        component: './schedules/layout',
        routes: [
          {
            path: '/thoi-khoa-bieu',
            component: './schedules',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/thoi-khoa-bieu/tao-moi',
            component: './schedules/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
        ],
      },
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
      {
        path: '/chi-nhanh',
        component: './branch/layout',
        routes: [
          {
            path: '/chi-nhanh',
            component: './branch',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/chi-nhanh/tao-moi',
            component: './branch/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
        ],
      },
      {
        path: '/mon-hoc',
        component: './subjects/layout',
        routes: [
          {
            path: '/mon-hoc',
            component: './subjects',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/mon-hoc/tao-moi',
            component: './subjects/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
        ],
      },
      {
        path: '/quan-ly-phuong-tien',
        component: './vehicle/layout',
        routes: [
          {
            path: '/quan-ly-phuong-tien/xe',
            component: './vehicle',
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
      {
        path: '/quan-ly',
        component: './manager/layout',
        routes: [
          {
            path: '/quan-ly/lop-hoc',
            component: './manager/class',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly/lop-hoc/tao-moi',
            component: './manager/class/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly/lich-hoc',
            component: './manager/schedules',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/quan-ly/lich-hoc/tao-moi',
            component: './manager/schedules/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
        ],
      },
      {
        path: '/ho-so-doi-tuong',
        component: './profiles/layout',
        routes: [
          {
            path: '/ho-so-doi-tuong/phu-huynh',
            component: './profiles/parents',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/ho-so-doi-tuong/phu-huynh/tao-moi',
            component: './profiles/parents/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/ho-so-doi-tuong/nhan-su',
            component: './profiles/personnel',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/ho-so-doi-tuong/nhan-su/tao-moi',
            component: './profiles/personnel/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/ho-so-doi-tuong/hoc-sinh',
            component: './profiles/children',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/ho-so-doi-tuong/hoc-sinh/tao-moi',
            component: './profiles/children/add',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
        ],
      },
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
