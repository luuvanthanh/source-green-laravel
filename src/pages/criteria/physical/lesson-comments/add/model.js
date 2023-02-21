import * as services from './services';

export default {
  namespace: 'PhysicalLessonCommentsAdd',
  state: {
    details: {},
    branches: [],
    error: {
      isError: false,
      data: {},
    },
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      details: payload,
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
        callback(response);
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
    *GET_TEMPLATE_FOR_CREATING({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getTemplateForCreating, payload);
        callback(response);
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
        callback(null, error?.data);
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
    *REJECT_FEEDBACK({ payload, callback }, saga) {
      try {
        yield saga.call(services.rejectFeedback, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *APPROVE_FEEDBACK({ payload, callback }, saga) {
      try {
        yield saga.call(services.approveFeedback, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
  },
};
