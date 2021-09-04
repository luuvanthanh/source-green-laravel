import * as services from './services';

export default {
  namespace: 'medicalTypesAdd',
  state: {
    details: {},
    error: {
      isError: false,
      data: {},
    },
    configs: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      details: payload,
    }),
    SET_CONFIG_TYPES: (state, { payload }) => ({
      ...state,
      configs: payload,
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
    *GET_CONFIG_TYPES({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getConfigTypes, payload);
        yield saga.put({
          type: 'SET_CONFIG_TYPES',
          payload: response,
        });
        callback(response);
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
        callback(null, error);
      }
    },
    *GET_DATA({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        yield saga.put({
          type: 'SET_CONFIG_TYPES',
          payload: response?.items || [],
        });
        callback(response);
      } catch (error) {
        callback(null, error);
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
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
