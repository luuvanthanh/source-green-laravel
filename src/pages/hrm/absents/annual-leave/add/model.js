import { notification } from 'antd';
import { get } from 'lodash';
import * as services from './services';

export default {
  namespace: 'absentsAdd',
  state: {
    data: [],
    pagination: {
      total: 0,
    },
    categories: {
      absentTypes: [],
      absentReasons: [],
      users: [],
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
    SET_CATEGORIES: (state, { payload }) => ({
      ...state,
      categories: {
        absentTypes: payload.absentTypes.parsePayload,
        absentReasons: payload.absentReasons.parsePayload,
        users: payload.users.parsePayload,
      },
    }),
  },
  effects: {
    *GET_CATEGORIES({ payload }, saga) {
      try {
        const response = yield saga.all({
          absentTypes: saga.call(services.getAbsentTypes),
          absentReasons: saga.call(services.getAbsentReasons),
          users: saga.call(services.getUsers),
        });
        yield saga.put({
          type: 'SET_CATEGORIES',
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
    *REMOVE({ payload }, saga) {
      try {
        yield saga.call(services.remove, payload.id);
        yield saga.put({
          type: 'GET_DATA',
          payload: payload.pagination,
        });
        notification.success({
          message: 'THÔNG BÁO',
          description: 'Dữ liệu cập nhật thành công',
        });
      } catch (error) {
        if (get(error.data, 'error.validationErrors[0]')) {
          notification.error({
            message: 'THÔNG BÁO',
            description: get(error.data, 'error.validationErrors[0].message'),
          });
        }
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
  },
  subscriptions: {},
};
