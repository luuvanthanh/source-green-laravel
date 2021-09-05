import * as services from './services';

export default {
  namespace: 'foodCommonsCreate',
  state: {
    details: {},
    error: {
      isError: false,
      data: {},
    },
    toolDetails: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      details: payload,
    }),
    SET_TOOL_DETAILS: (state, { payload }) => ({
      ...state,
      toolDetails: payload.items,
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
        callback(response);
      } catch (error) {
        callback(null, error);
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_MEASURE_UNITS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getMeasureUnits, payload);
        callback(response);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *ADD_MEASURE_UNIT({ payload, callback }, saga) {
      try {
        yield saga.call(services.addMeasureUnit, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *ADD({ payload, callback }, saga) {
      try {
        yield saga.call(services.add, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *UPDATE({ payload, callback }, saga) {
      try {
        yield saga.call(services.update, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *REMOVE({ payload, callback }, saga) {
      try {
        yield saga.call(services.remove, payload.id);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
  },
};
