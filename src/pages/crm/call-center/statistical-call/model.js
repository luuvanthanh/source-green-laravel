import * as services from './services';

export default {
  namespace: 'crmStatisticalCall',
  state: {
    data: [],
    saler: [],
    pagination: {
      total: 0,
    },
    error: {
      isError: false,
      data: {},
    },
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: payload.parsePayload,
      pagination: payload.pagination,
    }),
    SET_SALER: (state, { payload }) => ({
      ...state,
      saler: payload?.parsePayload.map((item) => ({ ...item, name: item.full_name })),
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
    *GET_DATA({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        yield saga.put({
          type: 'SET_DATA',
          payload: {
            parsePayload: response.parsePayload,
            pagination: response.pagination,
          },
        });
        callback(response);
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_CHART({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getChart, payload);
        callback(response);
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_CHART_TOTAL({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getChartTotal, payload);
        callback(response);
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_CHART_EMPLOYEE({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getChartEmployee, payload);
        callback(response);
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_SALER({ payload }, saga) {
      try {
        const response = yield saga.call(services.getSaler, payload);
        yield saga.put({
          type: 'SET_SALER',
          payload: {
            parsePayload: response.parsePayload,
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
