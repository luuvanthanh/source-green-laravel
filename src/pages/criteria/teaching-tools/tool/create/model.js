import { notification } from 'antd';
import { get } from 'lodash';
import * as services from './services';

export default {
  namespace: 'criteriaToolCreate',
  state: {
    details: {},
    error: {
      isError: false,
      data: {},
    },
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
  },
  effects: {
    *GET_DATA({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
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
        if (get(error.data, 'error.validationErrors[0]')) {
          notification.error({
            message: 'THÔNG BÁO',
            description: get(error.data, 'error.validationErrors[0].message'),
          });
        }
        callback(null, error?.data?.error);
      }
    },
  },
};
