import * as categories from '@/services/categories';
import { notification } from 'antd';
import * as services from './services';

export default {
  namespace: 'kitchenMenusCreate',
  state: {
    details: {},
    error: {
      isError: false,
      data: {},
    },
    toolDetails: [],
    branches: [],
    classTypes: [],
    foodCommons: [],
    meals: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      details: payload,
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
    SET_BRANCHES: (state, { payload }) => ({
      ...state,
      branches: payload.parsePayload,
    }),
    SET_CLASS_TYPES: (state, { payload }) => ({
      ...state,
      classTypes: payload.parsePayload,
    }),
    SET_FOOD_COMMONS: (state, { payload }) => ({
      ...state,
      foodCommons: payload.items,
    }),
    SET_MEALS: (state, { payload }) => ({
      ...state,
      meals: payload.items,
    }),
  },
  effects: {
    *GET_FOOD_COMMONS({ payload }, saga) {
      try {
        const response = yield saga.call(categories.getFoodCommons, payload);
        yield saga.put({
          type: 'SET_FOOD_COMMONS',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_MEALS({ payload }, saga) {
      try {
        const response = yield saga.call(categories.getMeals, payload);
        yield saga.put({
          type: 'SET_MEALS',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_CLASS_TYPES({ payload }, saga) {
      try {
        const response = yield saga.call(categories.getClassTypes, payload);
        yield saga.put({
          type: 'SET_CLASS_TYPES',
          payload: response,
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
        const response = yield saga.call(categories.getBranches, payload);
        yield saga.put({
          type: 'SET_BRANCHES',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_DATA({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_TIMETABLE_FEES({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getTimeTableFees, payload);
        callback(response);
        if (response?.timetableFeeGroupByWeeks?.length <= 0) {
          notification.error({
            message: 'THÔNG BÁO',
            description: `Thời khóa biểu cho tháng ${payload?.month}/${payload?.year} chưa được tạo`,
          });
        }
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *IMPORT_EXCEL({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.importExcel, payload);
        callback(response);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *ADD({ payload, callback }, saga) {
      try {
        yield saga.call(services.add, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
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
    *REMOVE({ payload, callback }, saga) {
      try {
        yield saga.call(services.remove, payload.id);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
  },
};
