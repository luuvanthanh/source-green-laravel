import * as services from './services';

export default {
  namespace: 'childDevelopAssessmentPeriodAdd',
  state: {
    details: {},
    schoolYear: [],
    branches: [],
    dataClass: [],
    error: {
      isError: false,
      data: {},
    },
    paramaterValues: [],
    paramaterFormulas: [],
    problems: [],
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
    SET_SCHOOL_YEAR: (state, { payload }) => ({
      ...state,
      schoolYear: payload.parsePayload,
    }),
    SET_BRANCHES: (state, { payload }) => ({
      ...state,
      branches: payload.parsePayload,
    }),
    SET_CLASS: (state, { payload }) => ({
      ...state,
      dataClass: payload,
    }),
    SET_PROBLEMS: (state, { payload }) => ({
      ...state,
      problems: payload.parsePayload,
    }),
  },
  effects: {
    *GET_DETAILS({ payload }, saga) {
      try {
        const response = yield saga.call(services.details, payload);
        if (response) {
          yield saga.put({
            type: 'SET_DETAILS',
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
    *UPDATE({ payload, callback }, saga) {
      try {
        yield saga.call(services.update, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
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
    *GET_SCHOOL_YEAR({ payload }, saga) {
      try {
        const response = yield saga.call(services.getSchooolYear, payload);
        yield saga.put({
          type: 'SET_SCHOOL_YEAR',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
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
    *GET_CLASS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getClass, payload);
        callback(response);
        yield saga.put({
          type: 'SET_CLASS',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_PROBLEMS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getProblems, payload);
        yield saga.put({
          type: 'SET_PROBLEMS',
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
