import * as services from './services';

export default {
  namespace: 'crmDeclaration',
  state: {
    details: {},
    error: {
      isError: false,
      data: {},
    },
    classproducts: [],
    sensitivePeriods: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      details: payload,
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
    SET_CLASS_products: (state, { payload }) => ({
      ...state,
      classproducts: payload.parsePayload,
    }),
    SET_SENSITIVE_PERIODS: (state, { payload }) => ({
      ...state,
      sensitivePeriods: payload.items,
    }),
  },
  effects: {
    *GET_DATA({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
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
  },
};
