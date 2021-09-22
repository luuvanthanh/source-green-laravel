export default {
  namespace: 'crmRolesAdd',
  state: {
    branches: [{
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
      data: []
    }),
    SET_DATA: (state, {
      payload
    }) => ({
      ...state,
      data: payload.parsePayload,
      pagination: payload.pagination,
    }),
    SET_ERROR: (state, {
      payload
    }) => ({
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
    * GET_DATA({
      payload
    }, saga) {
      try {
        const response = yield saga.call(payload);
        yield saga.put({
          type: 'SET_DATA',
          payload: {
            parsePayload: response.parsePayload,
            pagination: response.pagination
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