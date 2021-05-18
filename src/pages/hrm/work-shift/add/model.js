import { notification } from 'antd';
import { get } from 'lodash';
import * as services from './services';
import * as categroies from '@/services/categories';

export default {
  namespace: 'workShiftsAdd',
  state: {
    details: {},
    error: {
      isError: false,
      data: {},
    },
    divistions: [],
    shifts: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
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
    SET_DIVISIONS: (state, { payload }) => ({
      ...state,
      divisions: payload.parsePayload,
    }),
    SET_SHIFTS: (state, { payload }) => ({
      ...state,
      shifts: payload.parsePayload,
    }),
  },
  effects: {
    *GET_DIVISIONS({ payload }, saga) {
      try {
        const response = yield saga.call(categroies.getDivisions, payload);
        yield saga.put({
          type: 'SET_DIVISIONS',
          payload: response,
        });
      } catch (error) {}
    },
    *GET_SHIFTS({ payload }, saga) {
      try {
        const response = yield saga.call(categroies.getShifts, payload);
        yield saga.put({
          type: 'SET_SHIFTS',
          payload: response,
        });
      } catch (error) {}
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
    *ADD({ payload, callback }, saga) {
      try {
        yield saga.call(services.add, payload);
        callback(payload);
        notification.success({
          message: 'THÔNG BÁO',
          description: 'Dữ liệu cập nhật thành công',
        });
      } catch (error) {
        notification.error({
          message: 'THÔNG BÁO',
          description: 'Vui lòng kiểm tra lại hệ thống',
        });
        callback(null, error);
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
        notification.error({
          message: 'THÔNG BÁO',
          description: 'Vui lòng kiểm tra lại hệ thống',
        });
        callback(null, error);
      }
    },
  },
  subscriptions: {},
};
