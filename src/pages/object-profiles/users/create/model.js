import { notification } from 'antd';
import { get } from 'lodash';
import { variables } from '@/utils';
import * as services from './services';

export default {
  namespace: 'OPusersAdd',
  state: {
    details: {},
    error: {
      status: null,
      isError: false,
    },
  },
  reducers: {
    INIT_STATE: (state) => ({
      ...state,
      details: {},
      error: {
        status: null,
        isError: false,
      },
    }),
    SET_DETAILS: (state, { payload }) => ({
      ...state,
      details: payload,
      error: {
        status: null,
        isError: false,
      },
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
    *GET_DETAILS({ payload }, saga) {
      try {
        yield saga.put({
          type: 'INIT_STATE',
        });
        const response = yield saga.call(services.details, payload);
        if (response.status === variables.STATUS_204) {
          yield saga.put({
            type: 'SET_ERROR',
            payload: {
              status: variables.STATUS_204,
            },
          });
          return;
        }
        yield saga.put({
          type: 'SET_DETAILS',
          payload: response,
        });
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
