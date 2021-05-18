import { isEmpty, get } from 'lodash';
import { notification } from 'antd';
import * as services from './services';

export default {
  namespace: 'schedulesSettingAdd',
  state: {
    dataStores: [],
    isError: false,
    error: {
      isError: false,
      data: {},
    },
    details: {},
  },
  reducers: {
    INIT_STATE: (state) => ({
      ...state,
      isError: false,
      error: { isError: false, data: {} },
      data: [],
    }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      dataStores: payload,
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
    SET_DETAILS: (state, { payload }) => ({
      ...state,
      details: payload,
    }),
  },
  effects: {
    *ADD({ payload, callback }, saga) {
      try {
        yield saga.put({
          type: 'INIT_STATE',
        });
        yield saga.call(services.add, payload);
        notification.success({
          message: 'Cập nhật thành công',
          description: 'Bạn đã cập nhật thành công dữ liệu',
        });
        callback(payload);
      } catch (error) {
        notification.error({
          message: 'Thông báo',
          description: get(error.data, 'errors[0].detail') || 'Lỗi hệ thống vui lòng kiểm tra lại',
        });
        callback(null, error);
      }
    },
    *UPDATE({ payload, callback }, saga) {
      try {
        yield saga.call(services.update, payload);
        notification.success({
          message: 'Cập nhật thành công',
          description: 'Bạn đã cập nhật thành công dữ liệu',
        });
        callback(payload);
      } catch (error) {
        notification.error({
          message: 'Thông báo',
          description: get(error.data, 'errors[0].detail') || 'Lỗi hệ thống vui lòng kiểm tra lại',
        });
        callback(null, error);
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
  },
  subscriptions: {},
};
