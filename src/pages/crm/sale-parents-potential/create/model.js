export default {
  namespace: 'crmSaleParentsPotentialAdd',
  state: {
    details: {},
    detailsAccount: {},
    roles: [],
    error: {
      status: null,
      isError: false,
      data: {},
    },
    data: [
      {
        id: 1,
        name: 'test 01',
        updateDay: '12/12/2021',
        status: 'PENDING',
      },
      {
        id: 2,
        name: 'test 02',
        updateDay: '12/12/2021',
        status: 'VERIFIED',
      },
    ],
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
