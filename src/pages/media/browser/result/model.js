import * as services from './services';

export default {
  namespace: 'mediaResult',
  state: {
    data: [],
    error: {
      isError: false,
      data: {},
    },
    recordedFiles: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: payload.parsePayload,
      pagination: payload.pagination,
    }),
    SET_RECORDED_FILES: (state, { payload }) => ({
      ...state,
      recordedFiles: payload.items,
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
    *GET_DATA({ payload }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        yield saga.put({
          type: 'SET_DATA',
          payload: {
            parsePayload: response.items,
          },
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_RECORDED_FILES({ payload }, saga) {
      try {
        const response = yield saga.call(services.getRecordedFiles, payload);
        yield saga.put({
          type: 'SET_RECORDED_FILES',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *VALIDATE({ payload, callback }, { call }) {
      try {
        const response = yield call(services.validate, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
    *VALIDATE_ALL({ payload, callback }, { call }) {
      try {
        const response = yield call(services.validate, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
    *REMOVE_IMAGE({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.removeImage, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
    *REMOVE({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.remove, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
    *REMOVE_RECORD_FILES({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.removeRecordFiles, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
    *REMOVE_ALL({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.removeAll, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
    *MERGE({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.merge, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
  },
  subscriptions: {},
};
