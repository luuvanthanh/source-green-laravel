export default {
  namespace: 'crmBasis',
  state: {
    data: [
      {
        id: 1,
        code: 'TTL01',
        nameBasis: 'Cơ sở Quận 2',
        city: 'TP HCM',
        district: 'Quận 2',
        address: '169 - 171 Đường số 5, Phường An Phú',
      },
      {
        id: 2,
        code: 'TTL01',
        nameBasis: 'Cơ sở Quận 2',
        city: 'TP HCM',
        district: 'Quận 2',
        address: '169 - 171 Đường số 5, Phường An Phú',
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
