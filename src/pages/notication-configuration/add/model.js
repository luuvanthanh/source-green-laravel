import * as services from './services';

export default {
  namespace: 'noticationConfigurationAdd',
  state: {
    details: {},
    skill: [],
    dataBrowseObject: [],
    dataRecipients: [],
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
    SET_BROWSE_OBJECT: (state, { payload }) => ({
      ...state,
      dataBrowseObject: payload.items,
    }),
    SET_CRECIPIENTS: (state, { payload }) => ({
      ...state,
      dataRecipients: payload.items,
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
    *ADD({ payload, callback }, saga) {
      try {
        yield saga.call(services.add, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data);
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
    *GET_BROWSE_OBJECT({ payload }, saga) {
      try {
        const response = yield saga.call(services.getBrowseObject, payload);
        yield saga.put({
          type: 'SET_BROWSE_OBJECT',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_CRECIPIENTS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getRecipients, payload);
        yield saga.put({
          type: 'SET_CRECIPIENTS',
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
};
