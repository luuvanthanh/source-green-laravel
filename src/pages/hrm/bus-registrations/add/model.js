import { isEmpty, get } from 'lodash';
import { notification } from 'antd';
import * as services from './services';

export default {
  namespace: 'busRegistrationsAdd',
  state: {
    dataStores: [],
    isError: false,
    error: {
      isError: false,
      data: {},
    },
    details: {},
    categories: {
      users: [],
    },
    absentTypes: [],
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
    SET_CATEGORIES: (state, { payload }) => ({
      ...state,
      categories: {
        users: payload.users.parsePayload,
      },
    }),
    SET_ABSENT_TYPES: (state, { payload }) => ({
      ...state,
      absentTypes: payload.parsePayload,
    }),
  },
  effects: {
    *GET_ABSENT_TYPES({ payload }, saga) {
      try {
        const response = yield saga.call(services.getAbsentTypes);
        yield saga.put({
          type: 'SET_ABSENT_TYPES',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_CATEGORIES({ payload }, saga) {
      try {
        const response = yield saga.all({
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
