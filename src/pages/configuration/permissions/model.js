import * as services from './services';

export default {
  namespace: 'configurationPermissions',
  state: {
    data: [],
    permissions: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: payload,
    }),
    SET_PERMISSION_BY_ROLE: (state, { payload }) => ({
      ...state,
      permissions: payload,
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
        const response = yield saga.call(services.getPermission, payload);
        yield saga.put({
          type: 'SET_DATA',
          payload: response,
        });
        callback(response);
      } catch (error) {
        callback(null, error);
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_PERMISSION_BY_ROLE({ payload }, saga) {
      try {
        const response = yield saga.call(services.getPermissionByRole, payload);
        yield saga.put({
          type: 'SET_PERMISSION_BY_ROLE',
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
  },
  subscriptions: {},
};
