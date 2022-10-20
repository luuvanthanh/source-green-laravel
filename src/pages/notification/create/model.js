import { notification } from 'antd';
import * as categories from '@/services/categories';
import * as services from './services';

export default {
  namespace: 'notificationV1Add',
  state: {
    branches: [],
    divisions: [],
    category: [],
    module: [],
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
    SET_CATEGORY: (state, { payload }) => ({
      ...state,
      category: payload.items,
    }),
    SET_MODULE: (state, { payload }) => ({
      ...state,
      module: payload,
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
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_DIVISIONS({ payload }, saga) {
      try {
        const response = yield saga.call(categories.getDivisions, payload);
        yield saga.put({
          type: 'SET_DIVISIONS',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_EMPLOYEES({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getEmployees, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_PARENTS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getParents, payload);
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
          message: 'Thông báo',
          description: 'Bạn đã lưu thông báo thành công',
        });
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *SEND({ payload, callback }, saga) {
      try {
        yield saga.call(services.send, payload);
        callback(payload);
        notification.success({
          message: 'Thông báo',
          description: 'Bạn đã gửi thông báo thành công',
        });
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
    *GET_CLASS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getClass, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_CATEGORY({ payload }, saga) {
      try {
        const response = yield saga.call(services.getCategory, payload);
        yield saga.put({
          type: 'SET_CATEGORY',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_MODULE({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getModule, payload);
        callback(response);
        yield saga.put({
          type: 'SET_MODULE',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *ADD_APPROVE({ payload, callback }, saga) {
      try {
        yield saga.call(services.addApprove, payload);
        callback(payload);
        notification.success({
          message: 'Thông báo',
          description: 'Bạn đã duyệt thông báo thành công',
        });
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
  },
  subscriptions: {},
};
