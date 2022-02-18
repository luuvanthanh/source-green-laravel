import * as services from './services';

export default {
  namespace: 'CRMnewStudentAdd',
  state: {
    details: {},
    students: [],
    classes: [],
    yearsSchool: [],
    paymentForm: [],
    fees: [],
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
    SET_STUDENTS: (state, { payload }) => ({
      ...state,
      students: payload.filter( i => i.student_info_id === i?.studentInfo?.id),
    }),
    SET_CLASS: (state, { payload }) => ({
      ...state,
      classes: payload,
    }),
    SET_YEARS: (state, { payload }) => ({
      ...state,
      yearsSchool: payload,
    }),
    SET_FEES: (state, { payload }) => ({
      ...state,
      fees: payload,
    }),
    SET_PAYMENT: (state, { payload }) => ({
      ...state,
      paymentForm: payload,
    }),
  },
  effects: {
    *GET_DETAILS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.details, payload);
        if (response) {
          yield saga.put({
            type: 'SET_DETAILS',
            payload: response?.parsePayload,
          });
          callback(response?.parsePayload);
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
        callback(null, error?.data?.error);
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
    *UPDATE({ payload, callback }, saga) {
      try {
        yield saga.call(services.update, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *GET_MONEY_FEE_POLICIES({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.moneyFeePolicies, payload);
        if (response) {
          yield saga.put({
            type: 'SET_DETAILS',
            payload: response?.parsePayload,
          });
          callback(response?.parsePayload);
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
        callback(null, error?.data?.error);
      }
    },
    *GET_STUDENTS({ payload }, saga) {
      const response = yield saga.call(services.getStudents, payload);
      if (response) {
        yield saga.put({
          type: 'SET_STUDENTS',
          payload: response?.parsePayload,
        });
      }
    },
    *GET_CLASS({ payload }, saga) {
      const response = yield saga.call(services.getClass, payload);
      if (response) {
        yield saga.put({
          type: 'SET_CLASS',
          payload: response?.parsePayload,
        });
      }
    },
    *GET_YEARS({ payload }, saga) {
      const response = yield saga.call(services.getYears, payload);
      if (response) {
        yield saga.put({
          type: 'SET_YEARS',
          payload: response?.parsePayload,
        });
      }
    },
    *GET_FEES({ payload }, saga) {
      const response = yield saga.call(services.getFees, payload);
      if (response) {
        yield saga.put({
          type: 'SET_FEES',
          payload: response?.parsePayload,
        });
      }
    },
    *GET_PAYMENT({ payload }, saga) {
      const response = yield saga.call(services.getPayment, payload);
      if (response) {
        yield saga.put({
          type: 'SET_PAYMENT',
          payload: response?.parsePayload,
        });
      }
    },
  },
  subscriptions: {},
};
