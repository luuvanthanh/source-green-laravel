
import * as categories from '@/services/categories';
import * as services from './services';

  export default {
    namespace: 'currencyPaymentPlanAdd',
    state: {
      details: {},
      yearsSchool: [],
      branches: [],
      classes: [],
      payment: [],
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
      SET_YEARS : (state, { payload }) => ({
        ...state,
        yearsSchool: payload,
      }),
      SET_BRANCHES: (state, { payload }) => ({
        ...state,
        branches: payload.parsePayload,
      }),
      SET_CLASSES: (state, { payload }) => ({
        ...state,
        classes: payload.items,
      }),
      SET_PAYMENT: (state, { payload }) => ({
        ...state,
        payment: payload.items,
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
      *GET_YEARS({ payload }, saga) {
        try {
          const response = yield saga.call(services.getYears, payload);
          if (response) {
            yield saga.put({
              type: 'SET_YEARS',
              payload: response?.parsePayload,
            });
          }
        } catch (error) {
          yield saga.put({
            type: 'SET_ERROR',
            payload: error.data,
          });
        }
      },
      *GET_BRANCHES({ payload }, saga) {
        try {
          const response = yield saga.call(categories.getBranches, payload);
          yield saga.put({
            type: 'SET_BRANCHES',
            payload: response,
          });
        } catch (error) {
          yield saga.put({
            type: 'SET_ERROR',
            payload: error.data,
          });
        }
      },
      *GET_CLASSES({ payload }, saga) {
        try {
          const response = yield saga.call(categories.getClasses, payload);
          console.log("res", response);
          yield saga.put({
            type: 'SET_CLASSES',
            payload: response,
          });
        } catch (error) {
          yield saga.put({
            type: 'SET_ERROR',
            payload: error.data,
          });
        }
      },
      *GET_PAYMENT({ payload, callback }, saga) {
        try {
          const response = yield saga.call(services.getPayment, payload);
          if (response) {
            yield saga.put({
              type: 'SET_PAYMENT',
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
    },
    subscriptions: {},
  };
  