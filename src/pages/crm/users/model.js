export default {
  namespace: 'crmUsers',
  state: {
    data: [
      {
        id: 1,
        code: 'TTL01',
        name: 'Namvv',
        nameLogin: 'Nguyễn Văn Nam',
        email: 'Namvv@gmail.com',
        roles: 'Namvv',
      },
      {
        id: 2,
        code: 'TTL01',
        name: 'Namvv',
        nameLogin: 'Nguyễn Văn Nam',
        email: 'Namvv@gmail.com',
        roles: 'Namvv',
      },
      {
        id: 3,
        code: 'TTL01',
        name: 'Namvv',
        nameLogin: 'Nguyễn Văn Nam',
        email: 'Namvv@gmail.com',
        roles: 'Namvv',
      },
      {
        id: 4,
        code: 'TTL01',
        name: 'Namvv',
        nameLogin: 'Nguyễn Văn Nam',
        email: 'Namvv@gmail.com',
        roles: 'Namvv',
      },
      {
        id: 5,
        code: 'TTL01',
        name: 'Namvv',
        nameLogin: 'Nguyễn Văn Nam',
        email: 'Namvv@gmail.com',
        roles: 'Namvv',
      },
      {
        id: 6,
        code: 'TTL01',
        name: 'Namvv',
        nameLogin: 'Nguyễn Văn Nam',
        email: 'Namvv@gmail.com',
        roles: 'Namvv',
      },
      {
        id: 7,
        code: 'TTL01',
        name: 'Namvv',
        nameLogin: 'Nguyễn Văn Nam',
        email: 'Namvv@gmail.com',
        roles: 'Namvv',
      },
      {
        id: 8,
        code: 'TTL01',
        name: 'Namvv',
        nameLogin: 'Nguyễn Văn Nam',
        email: 'Namvv@gmail.com',
        roles: 'Namvv',
      },
      {
        id: 9,
        code: 'TTL01',
        name: 'Namvv',
        nameLogin: 'Nguyễn Văn Nam',
        email: 'Namvv@gmail.com',
        roles: 'Namvv',
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
