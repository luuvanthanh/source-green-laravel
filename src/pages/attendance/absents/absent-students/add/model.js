import { notification } from 'antd';
import { get } from 'lodash';
import * as services from './services';

export default {
  namespace: 'absentStudentsAdd',
  state: {
    data: [],
    pagination: {
      total: 0,
    },
    categories: {
      absentTypes: [],
      absentReasons: [],
      users: [],
    },
    students: [],
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
    SET_STUDENTS: (state, { payload }) => ({
      ...state,
      students: payload.items,
    }),
    SET_CATEGORIES: (state, { payload }) => ({
      ...state,
      categories: {
        absentTypes: payload.absentTypes.parsePayload,
        absentReasons: payload.absentReasons.parsePayload,
        users: [],
      },
    }),
  },
  effects: {
    *GET_CATEGORIES({ payload }, saga) {
      try {
        const response = yield saga.all({
          absentTypes: saga.call(services.getAbsentTypes),
          absentReasons: saga.call(services.getAbsentReasons),
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
    *GET_STUDENTS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getStudents, payload);
        yield saga.put({
          type: 'SET_STUDENTS',
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
        yield saga.call(services.add, payload);
        callback(payload);
        notification.success({
          message: 'Cập nhật thành công',
          description: 'Bạn đã cập nhật thành công dữ liệu',
        });
      } catch (error) {
        notification.error({
          message: 'Thông báo',
          description: 'Vui lòng kiểm tra lại hệ thống',
        });
        callback(null, error);
      }
    },
  },
  subscriptions: {},
};
