export default {
  namespace: 'childDevelopReport',
  state: {
    data: [
      {
        key: 1,
        name: 'Bé Zia',
        detail: '55 tháng tuổi Lake View Preschool 1',
        test: '25 tháng',
        data: [
          {
            key: 10,
            namekh: 'Tương tác xã hội',
            test: 'Chơi đúng cách ở các góc, các lĩnh vực đời sống (24 - 30 tháng)',
          },
          {
            key: 10,
            namekh: 'Tương tác xã hội',
            test: 'Chơi đúng cách ở các góc, các lĩnh vực đời sống (24 - 30 tháng)',
          },
          {
            key: 10,
            namekh: 'Tương tác xã hội',
            test: 'Chơi đúng cách ở các góc, các lĩnh vực đời sống (24 - 30 tháng)',
          },
        ],
      },
      {
        key: 2,
        name: 'Bùi Ngọc Thy Nhân',
        detail: '55 tháng tuổi Lake View Preschool 1',
        test: '25 tháng',
        data: [
          {
            key: 20,
            namekh: 'Tương tác xã hội',
            test: 'Chơi đúng cách ở các góc, các lĩnh vực đời sống (24 - 30 tháng)',
          },
          {
            key: 20,
            namekh: 'Tương tác xã hội',
            test: 'Chơi đúng cách ở các góc, các lĩnh vực đời sống (24 - 30 tháng)',
          },
        ],
      },
      {
        key: 3,
        name: 'Nguyễn Thị Đáng',
        detail: '55 tháng tuổi Lake View Preschool 1',
        test: '25 tháng',
        data: [
          {
            key: 20,
            namekh: 'Tương tác xã hội',
            test: 'Chơi đúng cách ở các góc, các lĩnh vực đời sống (24 - 30 tháng)',
          },
          {
            key: 20,
            namekh: 'Tương tác xã hội',
            test: 'Chơi đúng cách ở các góc, các lĩnh vực đời sống (24 - 30 tháng)',
          },
        ],
      },
    ],
    pagination: {
      total: 0,
    },
    error: {
      isError: false,
      data: {},
    },
    branches: [],
    classes: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state }),
  },
  effects: {},
  subscriptions: {},
};
