export default [
  {
    path: '/',
    component: '../layouts',
    routes: [
      {
        path: '/',
        redirect: '/san-pham-tour/tour-cho-duyet',
      },
      {
        path: '/login',
        component: './login',
      },
      {
        path: '/danh-muc',
        component: './category/layout',
        routes: [
          {
            path: '/danh-muc',
            component: './category',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/danh-muc/tour',
            component: './category/tours',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/danh-muc/loai-hinh-du-lich',
            component: './category/product-areas',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/danh-muc/nhom-tour',
            component: './category/product-group',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/danh-muc/loai-tour',
            component: './category/product-types',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/danh-muc/dia-diem',
            component: './category/locations',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/danh-muc/dich-vu',
            component: './category/services',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/danh-muc/dich-vu-cung-cap',
            component: './category/bo-group',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/danh-muc/tien-ich',
            component: './category/utilities',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
          {
            path: '/danh-muc/danh-muc-chung',
            component: './category/bo-data-type',
            wrappers: ['@/wrappers/auth'],
            authority: [],
          },
        ],
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
        path: '/404',
        component: './404'
      },
      {
        component: './404'
      }
    ],
  },
];
