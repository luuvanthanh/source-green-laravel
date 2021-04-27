import { notification } from 'antd';
import * as services from './services';

export default {
  namespace: 'mediaResult',
  state: {
    data: [],
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
  },
  effects: {
    *GET_DATA({ payload }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        yield saga.put({
          type: 'SET_DATA',
          payload: {
            parsePayload: response.items,
          },
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *VALIDATE({ payload, callback }, { call }) {
      try {
        const response = yield call(services.validate, payload);
        callback && callback(response);
        notification.success({
          message: 'THÔNG BÁO',
          description: 'Dữ liệu cập nhật thành công',
        });
      } catch (error) {
        notification.error({
          message: 'THÔNG BÁO',
          description: 'Dữ liệu cập nhật thất bại',
        });
      }
    },
    *VALIDATE_ALL({ payload, callback }, { call }) {
      try {
        const response = yield call(services.validate, payload);
        callback && callback(response);
        notification.success({
          message: 'THÔNG BÁO',
          description: 'Dữ liệu cập nhật thành công',
        });
      } catch (error) {
        notification.error({
          message: 'THÔNG BÁO',
          description: 'Dữ liệu cập nhật thất bại',
        });
      }
    },
    *REMOVE_IMAGE({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.removeImage, payload);
        callback && callback(response);
        notification.success({
          message: 'THÔNG BÁO',
          description: 'Dữ liệu cập nhật thành công',
        });
      } catch (error) {
        callback && callback(null, error);
        notification.error({
          message: 'THÔNG BÁO',
          description: 'Dữ liệu cập nhật thất bại',
        });
      }
    },
    *REMOVE({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.remove, payload);
        callback && callback(response);
        notification.success({
          message: 'THÔNG BÁO',
          description: 'Dữ liệu cập nhật thành công',
        });
      } catch (error) {
        callback && callback(null, error);
        notification.error({
          message: 'THÔNG BÁO',
          description: 'Dữ liệu cập nhật thất bại',
        });
      }
    },
    *REMOVE_ALL({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.removeAll, payload);
        callback && callback(response);
        notification.success({
          message: 'THÔNG BÁO',
          description: 'Dữ liệu cập nhật thành công',
        });
      } catch (error) {
        callback && callback(null, error);
        notification.error({
          message: 'THÔNG BÁO',
          description: 'Dữ liệu cập nhật thất bại',
        });
      }
    },
    *MERGE({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.merge, payload);
        callback && callback(response);
        notification.success({
          message: 'THÔNG BÁO',
          description: 'Dữ liệu cập nhật thành công',
        });
      } catch (error) {
        callback && callback(null, error);
        notification.error({
          message: 'THÔNG BÁO',
          description: 'Dữ liệu cập nhật thất bại',
        });
      }
    },
  },
  subscriptions: {},
};
