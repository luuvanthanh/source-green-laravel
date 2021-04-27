import { notification } from 'antd';
import * as services from './services';

export default {
  namespace: 'healthUpdate',
  state: {
    error: {
      isError: false,
      data: {},
    },
    details: [],
    criteriaGroupProperties: [],
    waterBottles: {},
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DETAILS: (state, { payload }) => ({
      ...state,
      details: payload,
    }),
    SET_WATER_BOTTLES: (state, { payload }) => ({
      ...state,
      waterBottles: payload,
    }),
    SET_CRITERIA_GROUP_PROPERTIES: (state, { payload }) => ({
      ...state,
      criteriaGroupProperties: payload?.items || [],
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
    *GET_CRITERIA_GROUP_PROPERTIES({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getCriteriaGroupProperties, payload);
        yield saga.put({
          type: 'SET_CRITERIA_GROUP_PROPERTIES',
          payload: response,
        });
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_DETAILS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        yield saga.put({
          type: 'SET_DETAILS',
          payload: response,
        });
        callback(response);
      } catch (error) {
        callback(null, error);
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_WATER_BOTTLES({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getWaterBottles, payload);
        yield saga.put({
          type: 'SET_WATER_BOTTLES',
          payload: response,
        });
        callback(response);
      } catch (error) {
        callback(null, error);
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
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
