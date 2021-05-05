import { isEmpty, get } from 'lodash';
import { notification } from 'antd';
import * as services from './services';
import * as categories from '@/services/categories';

export default {
  namespace: 'shiftStudentsAdd',
  state: {
    dataStores: [],
    isError: false,
    error: {
      isError: false,
      data: {},
    },
    details: {},
    branches: [],
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
    SET_BRANCHES: (state, { payload }) => ({
      ...state,
      branches: payload.parsePayload,
    }),
  },
  effects: {
    *GET_BRANCHES({ payload }, saga) {
      try {
        const response = yield saga.call(categories.getBranches, payload);
        yield saga.put({
          type: 'SET_BRANCHES',
          payload: response,
        });
      } catch (error) {}
    },
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
        if (!isEmpty(error.data.errors)) {
          if (get(error.data, 'errors[0].source.pointer') === 'shift_id') {
            notification.error({
              message: 'Thông báo',
              description:
                'Ca đang được sử dụng, sửa ca sẽ thay đổi các ca xếp sẵn từ hiện tại. Giữ liệu cũ vẫn được giữ nguyên',
            });
          }
        }
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
        if (!isEmpty(error.data.errors)) {
          if (get(error.data, 'errors[0].source.pointer') === 'shift_id') {
            notification.error({
              message: 'Thông báo',
              description:
                'Ca đang được sử dụng, sửa ca sẽ thay đổi các ca xếp sẵn từ hiện tại. Giữ liệu cũ vẫn được giữ nguyên',
            });
          }
        }
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
