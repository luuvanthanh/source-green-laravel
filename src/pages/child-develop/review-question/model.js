import * as services from './services';

export default {
  namespace: 'childDevelopReviewQuestion',
  state: {
    details: {},
    tags: [],
    colorTags: [],
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
    SET_TAGS: (state, { payload }) => ({
      ...state,
      tags: payload,
    }),
    SET_COLOR_TAGS: (state, { payload }) => ({
      ...state,
      colorTags: payload.parsePayload,
    }),
  },
  effects: {
    *GET_TAGS({ payload,callback }, saga) {
      try {
        const response = yield saga.call(services.getTags, payload);
        callback(response);
        if (response) {
          yield saga.put({
            type: 'SET_TAGS',
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
    *REMOVE({ payload, callback }, saga) {
      try {
        yield saga.call(services.remove, payload.id);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_COLOR_TAGS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getColorTags, payload);
        yield saga.put({
          type: 'SET_COLOR_TAGS',
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
