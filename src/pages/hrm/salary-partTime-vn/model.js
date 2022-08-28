import * as services from './services';

export default {
  namespace: 'salaryPartTimeVn',
  state: {
    data: {},
    dataTable: [],
    error: {
      isError: false,
      data: {},
    },
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA_PAYROLL: (state, { payload }) => ({
      ...state,
      data: payload.parsePayload,
    }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      dataTable:
      Object.keys(payload.payload)?.length > 1
        ? Object.keys(payload.payload).map((key) => ({
            id: key,
            name: key === 'TotalSum' ? 'Tổng cộng quỹ lương giáo viên' : key,
            key: key === 'TotalSum',
            ...(payload?.payload[key] || {}),
            children:
              payload?.payload[key]?.DataDetail &&
              Object.keys(payload?.payload[key]?.DataDetail).map((keyProduct) => ({
                ...(payload?.payload[key]?.DataDetail[keyProduct] || {}),
              })),
          }))
        : [],
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
    *GET_DATA_PAYROLL({ payload }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        if (response) {
          yield saga.put({
            type: 'SET_DATA_PAYROLL',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_DATA({ payload }, saga) {
      try {
        const response = yield saga.call(services.getData, payload);
        if (response) {
          yield saga.put({
            type: 'SET_DATA',
            payload: response,
          });
        }
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
