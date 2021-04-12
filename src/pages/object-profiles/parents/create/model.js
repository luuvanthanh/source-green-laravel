import { notification } from 'antd';
import { variables } from '@/utils';
import * as services from './services';

export default {
  namespace: 'OPParentsAdd',
  state: {
    details: {},
    error: {
      status: null,
      isError: false,
    },
    employees: [],
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
    SET_EMPLOYEES: (state, { payload }) => ({
      ...state,
      employees: payload.items,
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
        const response = yield saga.call(services.add, payload);
        callback(response);
        notification.success({
          message: 'THÔNG BÁO',
          description: 'Dữ liệu cập nhật thành công',
        });
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *UPDATE({ payload, callback }, saga) {
      try {
        yield saga.call(services.update, payload);
        callback(payload);
        notification.success({
          message: 'THÔNG BÁO',
          description: 'Dữ liệu cập nhật thành công',
        });
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *GET_EMPLOYEES({ payload }, saga) {
      try {
        const response = yield saga.call(services.getEmployees, payload);
        yield saga.put({
          type: 'SET_EMPLOYEES',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
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
