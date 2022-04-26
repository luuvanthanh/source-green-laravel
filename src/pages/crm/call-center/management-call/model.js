import * as services from './services';

export default {
  namespace: 'crmManagementCall',
  state: {
    data: [],
    lead: [],
    potential: [],
    isClickToCall: false,
    quickPhoneNumber: '',
    quickStatus: '',
    outboundHistory: {},
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
    SET_STATUS_LEAD: (state, { payload }) => ({
      ...state,
      lead: payload.parsePayload,
    }),
    SET_STATUS_POTENTIAL: (state, { payload }) => ({
      ...state,
      potential: payload.parsePayload,
    }),
    SET_IS_CLICK: (state, { payload }) => ({
      ...state,
      isClickToCall: payload?.isClickToCall,
      quickPhoneNumber: payload?.quickPhoneNumber,
      quickStatus: payload?.quickStatus,
      // outboundHistory: payload?.outboundHistory,
    }),
    SET_OUTBOUND_HISTORY: (state, { payload }) => ({
      ...state,
      outboundHistory: payload?.outboundHistory,
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
    *GET_COUNTCALL({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getCountCall, payload);
        callback(response?.payload);
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_STATUS_LEAD({ payload }, saga) {
      try {
        const response = yield saga.call(services.getStatusLead, payload);
        yield saga.put({
          type: 'SET_STATUS_LEAD',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_STATUS_POTENTIAL({ payload }, saga) {
      try {
        const response = yield saga.call(services.getStatusPotential, payload);
        yield saga.put({
          type: 'SET_STATUS_POTENTIAL',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *IS_CLICK({ payload }, saga) {
      yield saga.put({
        type: 'SET_IS_CLICK',
        payload,
      });
    },
    *OUTBOUND_HISTORY({ payload }, saga) {
      yield saga.put({
        type: 'SET_OUTBOUND_HISTORY',
        payload,
      });
    },
    *GET_SALER({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getSaler, payload);
        callback(response);
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
