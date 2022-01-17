export default {
  namespace: 'feePolicyReport',
  state: {
    data: [
      {
        key: 1,
        name: 'Lake view',

        children: [
          {
            key: 11,
            code: 'HS01',
            nameStudent: 'Nguyễn Cường',
            children: [
              {
                key: 11,
                date: '14/01/2021',
                money: '1.000.000',
              },
              {
                key: 11,
                date: '14/01/2021',
                money: '1.000.000',
              },
              {
                key: 11,
                date: '14/01/2021',
                money: '1.000.000',
              },
              {
                key: 11,
                date: '14/01/2021',
                money: '1.000.000',
              },
            ],
          },
          {
            key: 12,
            nameStudent: 'Nguyễn Cường',
            code: 'HS01',
            children: [
              {
                key: 11,
                date: '14/01/2021',
                money: '1.000.000',
              },
              {
                key: 11,
                date: '14/01/2021',
                money: '1.000.000',
              },
              {
                key: 11,
                date: '14/01/2021',
                money: '1.000.000',
              },
              {
                key: 11,
                date: '14/01/2021',
                money: '1.000.000',
              },
            ],
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
