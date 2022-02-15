import * as services from './services';

export default {
  namespace: 'crmTags',
  state: {
    details: {},
    tags: [],
    colorTags: [
      {
        id: 1,
        name: "#FF8D8D",
      },
      {
        id: 2,
        name: "#FFA5AC",
      },
      {
        id: 3,
        name: "#FFC0A5",
      },
      {
        id: 4,
        name: "#FFCC97",
      },
      {
        id: 5,
        name: "#FFEE97",
      },
      {
        id: 6,
        name: "#DEFF97",
      },
      {
        id: 7,
        name: "#ACFF97",
      },
      {
        id: 8,
        name: "#97FFBA",
      },

      {
        id: 9,
        name: "#7FEBE5",
      },
      {
        id: 10,
        name: "#8DC8FF",
      },
      {
        id: 11,
        name: "#96ADFF",
      },
      {
        id: 12,
        name: "#A59DFF",
      },
      {
        id: 13,
        name: "#D49DFF",
      },
      {
        id: 14,
        name: "#FD9DFF",
      },
      {
        id: 15,
        name: "#FF9DDE",
      },
    ],
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
