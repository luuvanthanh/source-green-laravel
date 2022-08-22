import * as services from './services';

export default {
  namespace: 'salaryPartTimeForeigner',
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
      dataTable: Object.keys(payload.payload).map((key) => ({
        id: key,
        name: key,
        children:
          payload?.payload[key] &&
          Object.keys(payload?.payload[key]).map((keyParent) => ({
            ...(payload?.payload[key]?.[keyParent] || {}),
            children:
              payload?.payload[key]?.[keyParent]?.dataDetail &&
              Object.keys(payload?.payload[key]?.[keyParent]?.dataDetail).map(
                (keyProduct) => ({
                  ...(payload?.payload[key]?.[keyParent]?.dataDetail[keyProduct] || {}),
                }),
              ),
          })),
      })),
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
        console.log("res",response);
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
    *UPDATE({ payload, callback }, saga) {
      try {
        yield saga.call(services.update, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *UPDATE_SALARY({ payload, callback }, saga) {
      try {
        yield saga.call(services.updateSalary, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *UPDATE_SALARY_VN({ payload, callback }, saga) {
      try {
        yield saga.call(services.updateSalaryVn, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *UPDATE_SALARY_FOREIGN({ payload, callback }, saga) {
      try {
        yield saga.call(services.updateSalaryForeign, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
  },
  subscriptions: {},
};
