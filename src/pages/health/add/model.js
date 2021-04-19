import * as services from './services';

export default {
  namespace: 'healthAdd',
  state: {
    error: {
      isError: false,
      data: {},
    },
    details: {},
    criteriaGroupProperties: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DETAILS: (state, { payload }) => ({
      ...state,
      details: payload,
    }),
    SET_CRITERIA_GROUP_PROPERTIES: (state, { payload }) => ({
      ...state,
      criteriaGroupProperties: payload.items,
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
    *GET_STUDENTS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getStudents, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_CRITERIA_GROUP_PROPERTIES({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getCriteriaGroupProperties, payload);
        yield saga.put({
          type: 'SET_CRITERIA_GROUP_PROPERTIES',
          payload: response,
        });
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_DETAILS({ payload }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        yield saga.put({
          type: 'SET_DETAILS',
          payload: response,
        });
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
        callback(null, error?.data?.error);
      }
    },
  },
  subscriptions: {},
};
