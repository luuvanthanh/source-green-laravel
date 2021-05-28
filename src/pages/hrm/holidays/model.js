import { notification } from 'antd';
import { head } from 'lodash';
import * as services from './services';

export default {
  namespace: 'holidays',
  state: {
    data: [],
    pagination: {},
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: head(payload?.parsePayload)?.holidayDetails || [],
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
    *GET_DATA({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        callback(head(response?.parsePayload)?.holidayDetails || []);
      } catch (error) {
        callback(null, error);
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *REMOVE({ payload }, saga) {
      try {
        yield saga.call(services.remove, payload);
        yield saga.put({
          type: 'GET_DATA',
          payload: payload.pagination,
        });
        notification.success({
          message: 'THÔNG BÁO',
          description: 'Dữ liệu cập nhật thành công',
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
        notification.success({
          message: 'THÔNG BÁO',
          description: 'Cập nhật thành công',
        });
      } catch (error) {
        notification.error({
          message: 'THÔNG BÁO',
          description: 'Cập nhật thất bại',
        });
        callback(null, error);
      }
    },
  },
  subscriptions: {},
};
