
export default {
  namespace: 'crmAlert',
  state: {
    details: [],
    error: {
      isError: false,
      data: {},
    },
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state,  data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      details: payload.parsePayload,
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
};
