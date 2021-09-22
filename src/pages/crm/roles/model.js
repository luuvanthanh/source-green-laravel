export default {
  namespace: 'crmRoles',
  state: {
    data: [
      {
        id: 1,
        code: 'TTL01',
        name: 'Namvv',
        description: 'Nguyễn Văn Nam',
      },
      {
        id: 2,
        code: 'TTL01',
        name: 'Namvv',
        description: 'Nguyễn Văn Nam',
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
