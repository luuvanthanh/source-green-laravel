export default {
  namespace: 'crmUsers',
  state: {
    data: [
      {
        id: 1,
        code: 'TTL01',
        name: 'Namvv',
        name_login: 'Nguyễn Văn Nam',
        email: 'Namvv@gmail.com',
      },
      {
        id: 2,
        code: 'TTL01',
        name: 'Namvv',
        name_login: 'Nguyễn Văn Nam',
        email: 'Namvv@gmail.com',
      },
      {
        id: 3,
        code: 'TTL01',
        name: 'Namvv',
        name_login: 'Nguyễn Văn Nam',
        email: 'Namvv@gmail.com',
      },
      {
        id: 4,
        code: 'TTL01',
        name: 'Namvv',
        name_login: 'Nguyễn Văn Nam',
        email: 'Namvv@gmail.com',
      },
      {
        id: 5,
        code: 'TTL01',
        name: 'Namvv',
        name_login: 'Nguyễn Văn Nam',
        email: 'Namvv@gmail.com',
      },
      {
        id: 6,
        code: 'TTL01',
        name: 'Namvv',
        name_login: 'Nguyễn Văn Nam',
        email: 'Namvv@gmail.com',
      },
      {
        id: 7,
        code: 'TTL01',
        name: 'Namvv',
        name_login: 'Nguyễn Văn Nam',
        email: 'Namvv@gmail.com',
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
