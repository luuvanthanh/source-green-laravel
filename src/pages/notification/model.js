import { notification } from 'antd';
import * as categories from '@/services/categories';
import * as services from './services';

export default {
  namespace: 'notifications',
  state: {
    data: [],
    years: [],
    branches: [],
    category: [],
    pagination: {
      total: 0,
    },
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
    SET_YEARS: (state, { payload }) => ({
      ...state,
      years:
        payload.parsePayload?.map((item) => ({
          id: item.id,
          name: `Năm học  ${item.yearFrom} - ${item.yearTo}`,
          ...item,
        })) || [],
    }),
    SET_BRANCHES: (state, { payload }) => ({
      ...state,
      branches: payload.parsePayload.parsePayload,
    }),
    SET_CATEGORY: (state, { payload }) => ({
      ...state,
      category: payload.items,
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
    *REMOVE({ payload, callback }, saga) {
      try {
        yield saga.call(services.remove, payload);
        callback(payload);
        notification.success({
          message: 'Thông báo',
          description: 'Bạn đã xoá thành công dữ liệu',
        });
      } catch (error) {
        callback(null, error);
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_YEARS({ payload }, saga) {
      try {
        const response = yield saga.call(categories.getYears, payload);
        yield saga.put({
          type: 'SET_YEARS',
          payload: {
            parsePayload: response,
          },
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_BRANCHES({ payload }, saga) {
      try {
        const response = yield saga.call(services.getBranches, payload);
        yield saga.put({
          type: 'SET_BRANCHES',
          payload: {
            parsePayload: response,
          },
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_CATEGORY({ payload }, saga) {
      try {
        const response = yield saga.call(services.getCategory, payload);
        yield saga.put({
          type: 'SET_CATEGORY',
          payload: response,
        });
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
