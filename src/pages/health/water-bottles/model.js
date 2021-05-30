import { notification } from 'antd';
import * as services from './services';

export default {
  namespace: 'waterBottles',
  state: {
    data: [],
    pagination: {},
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
            pagination: {
              total: response.totalCount,
            },
          },
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_WATER_BOTTLES({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getWaterBottles, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *WATER_BOTTLES({ payload, callback }, saga) {
      try {
        yield saga.call(services.waterBottles, payload);
        callback(payload);
        notification.success({
          message: 'THÔNG BÁO',
          description: 'Cập nhật thành công',
        });
      } catch (error) {
        notification.error({
          message: 'THÔNG BÁO',
          description: error?.data?.error?.message || 'Cập nhật thất bại',
        });
        callback(null, error?.data?.error);
      }
    },
  },
  subscriptions: {},
};
