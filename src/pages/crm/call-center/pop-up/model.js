import * as services from './services';

export default {
  namespace: 'crmCallCenter',
  state: {
    data: [],
    cities: [],
    district: [],
    townWards: [],
    isConnected: false,
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
    SET_CITIES: (state, { payload }) => ({
      ...state,
      cities: payload.parsePayload,
    }),
    SET_DISTRICTS: (state, { payload }) => ({
      ...state,
      district: payload.parsePayload,
    }),
    SET_TOWN_WARDS: (state, { payload }) => ({
      ...state,
      townWards: payload.parsePayload,
    }),
    SET_CHECK_STATUS: (state, { payload }) => ({
      ...state,
      isConnected: payload.isConnected,
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
    *GET_CITIES({ payload }, saga) {
      try {
        const response = yield saga.call(services.getCities, payload);
        yield saga.put({
          type: 'SET_CITIES',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_DISTRICTS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getDistricts, payload);
        yield saga.put({
          type: 'SET_DISTRICTS',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_TOWN_WARDS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getTownWards, payload);
        yield saga.put({
          type: 'SET_TOWN_WARDS',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *IS_CONNECTED({ payload }, saga) {
      yield saga.put({
        type: 'SET_IS_CONNECTED',
        payload,
      });
    },
  },
  subscriptions: {},
};
