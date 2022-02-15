import * as services from './services';

export default {
  namespace: 'childDevelopReviewScenario',
  state: {
    data: [],
    skill: [],
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
    SET_ERROR: (state, { payload }) => ({
      ...state,
      error: {
        isError: true,
        data: {
          ...payload,
        },
      },
    }),
    SET_SKILL: (state, { payload }) => ({
      ...state,
      skill: payload.parsePayload.filter((i) => i.use === true),
    }),
  },
  effects: {
    *GET_DATA({ payload }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
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
    *REMOVE({ payload, callback }, saga) {
      try {
        yield saga.call(services.remove, payload.id);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_SKILL({ payload }, saga) {
      try {
        const response = yield saga.call(services.getSkill, payload);
        yield saga.put({
          type: 'SET_SKILL',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *UPDATE_USE({ payload, callback }, saga) {
      try {
        yield saga.call(services.updateUse, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
  },
  subscriptions: {},
};
