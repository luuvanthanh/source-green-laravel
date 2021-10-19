export default {
  namespace: 'crmSMarketingge',
  state: {
    data: [
      {
        id: 1,
        key: 1,
        code: 'PH20210001',
        name: 'Nguyễn Văn Nam',
        sex: 'Nữ',
        email: 'anhn@gmail.com',
        phone: '0934900900',
        address: '52 Huỳnh Ngọc Huệ',
        district: 'Quận 2',
        city: 'TP Hồ Chí Minh',
      },
      {
        id: 2,
        key: 2,
        code: 'PH20210001',
        name: 'Nguyễn Văn Nam',
        sex: 'Nữ',
        email: 'anhn@gmail.com',
        phone: '0934900900',
        address: '52 Huỳnh Ngọc Huệ',
        district: 'Quận 2',
        city: 'TP Hồ Chí Minh',
      },
      {
        id: 3,
        key: 3,
        code: 'PH20210001',
        name: 'Nguyễn Văn Nam',
        sex: 'Nữ',
        email: 'anhn@gmail.com',
        phone: '0934900900',
        address: '52 Huỳnh Ngọc Huệ',
        district: 'Quận 2',
        city: 'TP Hồ Chí Minh',
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
  effects: {
    *GET_DATA({ payload }, saga) {
      try {
        const response = yield saga.call(payload);
        yield saga.put({
          type: 'SET_DATA',
          payload: {
            parsePayload: response.parsePayload,
            pagination: response.pagination,
          },
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
  },
  subscriptions: {},
};
