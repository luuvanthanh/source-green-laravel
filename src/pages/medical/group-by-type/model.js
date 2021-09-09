import * as services from './services';

export default {
  namespace: 'medicalGroupByType',
  state: {
    details: {},
    error: {
      isError: false,
      data: {},
    },
    configs: [],
    parents: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_CONFIG_TYPES: (state, { payload }) => ({
      ...state,
      configs: payload,
    }),
    SET_PARENT_CONFIG_TYPES: (state, { payload }) => ({
      ...state,
      parents: payload,
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
    *GET_CONFIG_TYPES({ payload }, saga) {
      try {
        const response = yield saga.call(services.getConfigTypes, payload);
        yield saga.put({
          type: 'SET_CONFIG_TYPES',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_PARENT_CONFIG_TYPES({ payload }, saga) {
      try {
        const response = yield saga.call(services.getConfigTypes, payload);
        yield saga.put({
          type: 'SET_PARENT_CONFIG_TYPES',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_DATA({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
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
  },
};
