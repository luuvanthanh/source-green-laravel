export default {
  namespace: 'crmSaleCheckList',
  state: {
    data: [
      {
        id: 1,
        index: 1,
        name: 'Namvv',
        phone: '09265125',
        email: 'a@gmail.com',
        address: '52 Hoàng Diệu',
        nameChildren: 'Nguyễn Anh Nhân',
        birth: '12/12/2021',
      },
      {
        id: 2,
        index: 1,
        name: 'Namvv',
        phone: '09265125',
        address: '52 Hoàng Diệu',
        email: 'a@gmail.com',
        nameChildren: 'Nguyễn Anh Nhân',
        birth: '12/12/2021',
      },
    ],
    branches: [
      {
        id: 1,
        name: 'Nguyễn Văn Nam',
      },
      {
        id: 2,
        name: 'Nguyễn Văn',
      },
    ],
    pagination: {
      total: 0,
    },
    error: {
      isError: false,
      data: {},
    },
  },
  reducers: {
    INIT_STATE: (state) => ({
      ...state,
      isError: false,
      data: [],
    }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: payload.parsePayload,
      pagination: payload.pagination,
    }),
    SET_ERROR: (state, { payload }) => ({
      ...state,
      error: {
        isError: true,
        data: {
          ...payload,
        },
      },
    }),
  },
  effects: {},
  subscriptions: {},
};
