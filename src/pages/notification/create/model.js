import { notification } from 'antd';
import * as services from './services';
import * as categories from '@/services/categories';

export default {
  namespace: 'notificationAdd',
  state: {
    branches: [],
    divisions: [],
    details: {},
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
    SET_BRANCHES: (state, { payload }) => ({
      ...state,
      branches: payload.parsePayload,
    }),
    SET_DIVISIONS: (state, { payload }) => ({
      ...state,
      divisions: payload.parsePayload,
    }),
    SET_DETAILS: (state, { payload }) => ({
      ...state,
      details: payload,
    }),
  },
  effects: {
    *GET_DETAILS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        callback(response);
        yield saga.put({
          type: 'SET_DETAILS',
          payload: response,
        });
      } catch (error) {
        callback(null, error);
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
      } catch (error) {}
    },
    *GET_DIVISIONS({ payload }, saga) {
      try {
        const response = yield saga.call(categories.getDivisions, payload);
        yield saga.put({
          type: 'SET_DIVISIONS',
          payload: response,
        });
      } catch (error) {}
    },
    *GET_EMPLOYEES({ payload, callback }, saga) {
      try {
        const response = yield saga.call(categories.getEmployees, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_PARENTS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(categories.getParents, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
    *ADD({ payload, callback }, saga) {
      try {
        yield saga.call(services.add, payload);
        callback(payload);
        notification.success({
          message: 'THÔNG BÁO',
          description: 'Dữ liệu cập nhật thành công',
        });
      } catch (error) {
        notification.error({
          message: 'THÔNG BÁO',
          description: 'Lỗi hệ thống vui lòng kiểm tra lại',
        });
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
        notification.error({
          message: 'THÔNG BÁO',
          description: error?.data?.error?.message || 'Lỗi hệ thống vui lòng kiểm tra lại',
        });
        callback(null, error?.data?.error);
      }
    },
  },
  subscriptions: {},
};
