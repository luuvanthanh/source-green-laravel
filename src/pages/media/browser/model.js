import { notification } from 'antd';
import * as services from './services';

export default {
  namespace: 'mediaBrowser',
  state: {
    data: [],
    pagination: {
      total: 0,
    },
    error: {
      isError: false,
      data: {},
    },
    progess: {},
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: payload.parsePayload,
      pagination: payload.pagination,
    }),
    SET_PROGRESS: (state, { payload }) => ({
      ...state,
      progess: payload.data,
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
        yield saga.put({
          type: 'SET_DATA',
          payload: {
            parsePayload: response.items,
            pagination: {
              total: response.totalCount,
            },
          },
        });
      } catch (error) {
        callback(null, error);
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_PROGRESS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getProgress, payload);
        callback(response);
        yield saga.put({
          type: 'SET_PROGRESS',
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
    *CLASSIFY({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.classify, payload);
        callback(response);
        notification.success({
          message: 'THÔNG BÁO',
          description: 'Tiến trình đang xử lý vui lòng chờ...',
        });
      } catch (error) {
        notification.error({
          message: 'THÔNG BÁO',
          description: 'Dữ liệu cập nhật thất bại',
        });
      }
    },
    *REMOVE({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.remove, payload);
        callback(response);
        notification.success({
          message: 'THÔNG BÁO',
          description: 'Dữ liệu cập nhật thành công',
        });
      } catch (error) {
        callback(null, error);
        notification.error({
          message: 'THÔNG BÁO',
          description: 'Dữ liệu cập nhật thất bại',
        });
      }
    },
  },
  subscriptions: {},
};
