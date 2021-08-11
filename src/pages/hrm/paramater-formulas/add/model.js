import * as categories from '@/services/categories';
import * as services from './services';

export default {
  namespace: 'paramaterFormulasAdd',
  state: {
    details: {},
    error: {
      isError: false,
      data: {},
    },
    paramaterValues: [],
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
    SET_PARAMTER_VAUES: (state, { payload }) => ({
      ...state,
      paramaterValues: payload,
    }),
  },
  effects: {
    *GET_PARAMTER_VAUES({ payload }, saga) {
      try {
        // const response = yield saga.call(categories.getParamaterValues, payload);
        const response = yield saga.all({
          paramaterValues: saga.call(categories.getParamaterValues, payload),
          paramaterFormulas: saga.call(categories.getParamaterFormulas, payload),
        });
        if (response) {
          yield saga.put({
            type: 'SET_PARAMTER_VAUES',
            payload: response.paramaterValues.parsePayload.concat(
              response.paramaterFormulas.parsePayload,
            ),
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_DETAILS({ payload }, saga) {
      try {
        const response = yield saga.call(services.details, payload);
        if (response) {
          yield saga.put({
            type: 'SET_DETAILS',
            payload: response.parsePayload,
          });
        }
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
        callback(null, error);
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
