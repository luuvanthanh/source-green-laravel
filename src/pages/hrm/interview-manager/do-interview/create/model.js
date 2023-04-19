import * as services from './services';

export default {
  namespace: 'hrmRecruitmentDoInterviewAdd',
  state: {
    details: {},
    skill: [],
    error: {
      isError: false,
      data: {},
    },
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, data: [] }),
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
  effects: {
    *GET_DATA({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getData, payload);
        callback(response.parsePayload);
        yield saga.put({
          type: 'SET_DATA',
          payload: response,
        });
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
    *GET_DATA_EVALUATION_CRITERIA({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getDataEvaluationCriteria, payload);
        callback(response.parsePayload);
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
  },
};
