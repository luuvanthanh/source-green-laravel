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
      icon: 'icon icon-folder',
      permission: [],
      pro: true,
    },
    {
      title: 'Thời khóa biểu',
      key: 'calendar',
      url: ['/thoi-khoa-bieu', '/thoi-khoa-bieu/tao-moi'],
      icon: 'icon icon-calendar',
      permission: [],
      pro: true,
      plus: false,
    },
    {
      title: 'Thực đơn cho trẻ',
      key: 'menu',
      url: ['/thuc-don-cho-tre', '/thuc-don-cho-tre/tao-moi'],
      icon: 'icon icon-calendar',
      permission: [],
      pro: true,
      plus: false,
    },
    {
      title: 'Khảo sát',
      key: 'survey',
      url: ['/khao-sat', '/khao-sat/tao-moi'],
      icon: 'icon icon-calendar',
      permission: [],
      pro: true,
      plus: false,
    },
    {
      title: 'Quản lý xe bus',
      key: 'tours',
      url: ['/san-pham-tour/tour-cho-duyet'],
      icon: 'icon icon-gold',
      permission: [],
      pro: true,
    },
    {
      title: 'Quản lý Điểm / Trường / Chi nhánh (Business unit)',
      key: 'dashboardDocs',
      url: ['/booking'],
      icon: 'icon icon-calendar1',
      permission: [],
      pro: true,
    },
  ];
}
export async function getTopMenuData() {
  return [
    {
      title: 'Settings',
      key: 'settings',
      icon: 'icon icon-cog utils__spin-delayed--pseudo-selector',
    },
    {
      title: 'Docs',
      key: 'documentation',
      url: 'https://docs.cleanuitemplate.com',
      target: '_blank',
      icon: 'icon icon-books',
    },
    {
      title: 'Pages',
      key: 'pages',
      icon: 'icon icon-stack',
      children: [
        {
          title: 'Dashboard Alpha',
          key: 'dashboardAlpha',
          url: '/dashboard/alpha',
        },
        {
          title: 'Dashboard Beta',
          key: 'dashboardBeta',
          url: '/dashboard/beta',
          pro: true,
        },
        {
          title: 'Dashboard Crypto',
          key: 'dashboardCrypto',
          url: '/dashboard/crypto',
          pro: true,
        },
        {
          title: 'Dashboard Gamma',
          key: 'dashboardGamma',
          url: '/dashboard/gamma',
          pro: true,
        },
        {
          title: 'Dashboard Docs',
          key: 'dashboardDocs',
          url: '/dashboard/docs',
          pro: true,
        },
        {
          divider: true,
        },
        {
          title: 'Default Pages',
          key: 'defaultPages',
          children: [
            {
              key: 'loginAlpha',
              title: 'Login Alpha',
              url: '/pages/login-alpha',
              pro: true,
            },
            {
              key: 'loginBeta',
              title: 'Login Beta',
              url: '/pages/login-beta',
              pro: true,
            },
            {
              key: 'register',
              title: 'Register',
              url: '/pages/register',
              pro: true,
            },
            {
              key: 'lockscreen',
              title: 'Lockscreen',
              url: '/pages/lockscreen',
              pro: true,
            },
            {
              key: 'pricingTable',
              title: 'Pricing Tables',
              url: '/pages/pricing-table',
              pro: true,
            },
            {
              key: 'invoice',
              title: 'Invoice',
              url: '/pages/invoice',
              pro: true,
            },
          ],
        },
        {
          title: 'Ecommerce',
          key: 'ecommerce',
          children: [
            {
              title: 'Dashboard',
              key: 'dashboard',
              url: '/ecommerce/dashboard',
              pro: true,
            },
            {
              title: 'Products Catalog',
              key: 'productsCatalog',
              url: '/ecommerce/products-catalog',
              pro: true,
            },
            {
              title: 'Products Details',
              key: 'productsDetails',
              url: '/ecommerce/product-details',
              pro: true,
            },
            {
              title: 'Products Edit',
              key: 'productsEdit',
              url: '/ecommerce/product-edit',
              pro: true,
            },
            {
              title: 'Products List',
              key: 'productsList',
              url: '/ecommerce/products-list',
              pro: true,
            },
            {
              title: 'Orders',
              key: 'orders',
              url: '/ecommerce/orders',
              pro: true,
            },
            {
              title: 'Cart',
              key: 'cart',
              url: '/ecommerce/cart',
              pro: true,
            },
          ],
        },
        {
          title: 'Apps',
          key: 'apps',
          children: [
            {
              title: 'Messaging',
              key: 'messaging',
              url: '/apps/messaging',
              pro: true,
            },
            {
              title: 'Mail',
              key: 'mail',
              url: '/apps/mail',
              pro: true,
            },
            {
              title: 'Profile',
              key: 'profile',
              url: '/apps/profile',
              pro: true,
            },
            {
              title: 'Gallery',
              key: 'gallery',
              url: '/apps/gallery',
              pro: true,
            },
          ],
        },
        {
          title: 'Blog',
          key: 'blog',
          children: [
            {
              title: 'Feed',
              key: 'blogFeed',
              url: '/blog/feed',
              pro: true,
            },
            {
              title: 'Post',
              key: 'blogPost',
              url: '/blog/post',
              pro: true,
            },
            {
              title: 'Add Post',
              key: 'blogAddPost',
              url: '/blog/add-blog-post',
              pro: true,
            },
          ],
        },
        {
          title: 'YouTube',
          key: 'youtube',
          children: [
            {
              title: 'Feed',
              key: 'youtubeFeed',
              url: '/youtube/feed',
              pro: true,
            },
            {
              title: 'View',
              key: 'youtubeView',
              url: '/youtube/view',
              pro: true,
            },
          ],
        },
        {
          title: 'GitHub',
          key: 'github',
          children: [
            {
              title: 'Explore',
              key: 'githubExplore',
              url: '/github/explore',
              pro: true,
            },
            {
              title: 'Discuss',
              key: 'githubDiscuss',
              url: '/github/discuss',
              pro: true,
            },
          ],
        },
      ],
    },
    {
      title: 'AntDesign',
      key: 'antComponents',
      icon: 'icon icon-menu',
      url: '/antd',
    },
    {
      title: 'Components',
      key: 'pagesBlocks',
      icon: 'icon icon-stack',
      children: [
        {
          title: 'Charts',
          key: 'charts',
          children: [
            {
              title: 'Chartist',
              key: 'chartist',
              url: '/charts/chartist',
            },
            {
              title: 'Chart',
              key: 'chart',
              url: '/charts/chart',
              pro: true,
            },
            {
              title: 'Peity',
              key: 'peity',
              url: '/charts/peity',
              pro: true,
            },
            {
              title: 'C3',
              key: 'c3',
              url: '/charts/c3',
              pro: true,
            },
          ],
        },
        {
          title: 'Mail Templates',
          key: 'mailTemplates',
          url: '/layout/mail-templates',
          pro: true,
        },
        {
          title: 'Icons',
          key: 'icons',
          children: [
            {
              title: 'FontAwesome',
              key: 'fontAwesome',
              url: '/icons/fontawesome',
            },
            {
              title: 'Linear',
              key: 'linear',
              url: '/icons/linear',
            },
            {
              title: 'Icomoon',
              key: 'icoMoon',
              url: '/icons/icomoon',
            },
          ],
        },
        {
          title: 'Bootstrap Grid',
          key: 'bootstrap',
          url: '/layout/bootstrap',
        },
        {
          title: 'Bootstrap Card',
          key: 'card',
          url: '/layout/card',
        },
        {
          title: 'Typography',
          key: 'typography',
          url: '/layout/typography',
        },
        {
          title: 'Utilities',
          key: 'utilities',
          url: '/layout/utilities',
        },
        {
          title: 'Nested Items',
          key: 'nestedItem1',
          disabled: true,
          children: [
            {
              title: 'Nested Item 1-1',
              key: 'nestedItem1-1',
              children: [
                {
                  title: 'Nested Item 1-1-1',
                  key: 'nestedItem1-1-1',
                },
                {
                  title: 'Nested Items 1-1-2',
                  key: 'nestedItem1-1-2',
                  disabled: true,
                },
              ],
            },
            {
              title: 'Nested Items 1-2',
              key: 'nestedItem1-2',
            },
          ],
        },
        {
          title: 'Disabled Item',
          key: 'disabledItem',
          disabled: true,
        },
      ],
    },
  ];
}
