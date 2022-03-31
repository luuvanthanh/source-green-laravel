import * as services from './services';

export default {
  namespace: 'crmCallCenter',
  state: {
    data: [],
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
  },
  effects: {
    *GET_EXTENSIONS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getExtensions, payload);
        callback(response?.parsePayload);
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *CHECK_PHONE({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.checkPhoneNumber, payload);
        callback(response);
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *PARENT_LEAD_STATUS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getParentLeadStatus, payload);
        callback(response);
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *PARENT_POTENTIALS_STATUS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getParentPotentialsStatus, payload);
        callback(response);
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_CRM_ID({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getCrmId, payload);
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
        yield saga.call(services.addResultCall, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
  },
  subscriptions: {},
};
