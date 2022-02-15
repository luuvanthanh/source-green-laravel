import * as services from './services';

export default {
  namespace: 'crmSaleCheckList',
  state: {
    data: [],
    dataCoincide: [],
    city: [],
    district: [],
    pagination: {
      total: 0,
    },
    error: {
      isError: false,
      data: {},
    },
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [], dataCoincide: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: payload.parsePayload,
    }),
    SET_DATA_COINCIDE: (state, { payload }) => ({
      ...state,
      dataCoincide: payload.parsePayload,
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
    SET_CITIES: (state, { payload }) => ({
      ...state,
      city: payload.parsePayload,
    }),
    SET_DISTRICTS: (state, { payload }) => ({
      ...state,
      district: payload.parsePayload,
    }),
  },
  effects: {
    *GET_DATA({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        callback(response);
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
    *GET_DATA_COINCIDE({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getCoincide, payload);
        callback(response.parsePayload);
      } catch (error) {
        callback(null, error);
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
    *ADD({ payload, callback }, saga) {
      try {
        yield saga.call(services.add, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *ADD_COINCIDE({ payload, callback }, saga) {
      try {
        yield saga.call(services.addCoincide, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
  },
  subscriptions: {},
};
