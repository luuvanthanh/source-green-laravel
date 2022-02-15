import * as services from './services';

export default {
  namespace: 'crmWebForm',
  state: {
    details: {},
    tags: [],
    branches: [],
    district: [],
    program: {},
    error: {
      isError: false,
      data: {},
    },
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_ERROR: (state, { payload }) => ({
      ...state,
      error: {
        isError: true,
        data: {
          ...payload,
        },
      },
    }),
    SET_DETAILS: (state, { payload }) => ({
      ...state,
      details: payload,
    }),
    SET_PROGRAMS: (state, { payload }) => ({
      ...state,
      program: payload,
    }),
    SET_BRANCHES: (state, { payload }) => ({
      ...state,
      branches: payload.parsePayload,
    }),
    SET_DISTRICTS: (state, { payload }) => ({
      ...state,
      district: payload.parsePayload,
    }),
  },
  effects: {
    *GET_PROGRAMS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getPrograms, payload);
        if (response) {
          yield saga.put({
            type: 'SET_PROGRAMS',
            payload: response.parsePayload,
          });
        }
      } catch (error) {
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
        callback(null, error);
      }
    },
    *GET_BRANCHES({ payload }, saga) {
      try {
        const response = yield saga.call(services.getBranches, payload);
        yield saga.put({
          type: 'SET_BRANCHES',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_DISTRICTS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getDistricts, payload);
        yield saga.put({
          type: 'SET_DISTRICTS',
          payload: response,
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
