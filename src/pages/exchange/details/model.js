import { notification } from 'antd';
import { get, isEmpty } from 'lodash';
import * as services from './services';
import variablesModules from '../utils/variables';

export default {
  namespace: 'exchangeDetails',
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
    SET_REMOVE: (state, { payload }) => ({
      ...state,
      details: {
        ...state.details,
        feedbacks: state.details.feedbacks.filter((item) => item.id !== payload.id),
      },
    }),
    SET_ADD: (state, { payload }) => ({
      ...state,
      details: {
        ...state.details,
        status: isEmpty(state?.details?.feedbacks)
          ? variablesModules.STATUS.IN_PROGRESS
          : state?.details?.status,
        feedbacks: [...state.details.feedbacks, payload],
      },
    }),
    SET_UPDATE: (state, { payload }) => ({
      ...state,
      details: {
        ...state.details,
        feedbacks: state.details.feedbacks.map((item) => (item.id === payload.id ? payload : item)),
      },
    }),
    SET_UPDATE_COMMUNICATION: (state, { payload }) => ({
      ...state,
      details: {
        ...state.details,
        status: payload.status,
      },
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
        const response = yield saga.call(services.details, payload);
        yield saga.put({
          type: 'SET_DATA',
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
        const response = yield saga.call(services.add, payload);
        yield saga.put({
          type: 'SET_ADD',
          payload: response,
        });
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *UPDATE({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.update, payload);
        yield saga.put({
          type: 'SET_UPDATE',
          payload: response,
        });
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *UPDATE_COMMUNICATION({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.updateCommunications, payload);
        yield saga.put({
          type: 'SET_UPDATE_COMMUNICATION',
          payload: response,
        });
        notification.success({
          message: 'THÔNG BÁO',
          description: 'Dữ liệu cập nhật thành côngh',
        });
        callback(payload);
      } catch (error) {
        notification.error({
          message: 'THÔNG BÁO',
          description: get(error.data, 'error.validationErrors[0].message'),
        });
        callback(null, error?.data?.error);
      }
    },
    *REMOVE({ payload }, saga) {
      try {
        yield saga.call(services.remove, payload.id);
        yield saga.put({
          type: 'SET_REMOVE',
          payload: payload,
        });
        notification.success({
          message: 'THÔNG BÁO',
          description: 'Dữ liệu cập nhật thành côngh',
        });
      } catch (error) {
        if (get(error.data, 'error.validationErrors[0]')) {
          notification.error({
            message: 'THÔNG BÁO',
            description: get(error.data, 'error.validationErrors[0].message'),
          });
        }
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
  },
  subscriptions: {},
};
