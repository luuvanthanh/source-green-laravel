import * as categories from '@/services/categories';
import {  notification } from 'antd';
import moment from 'moment';
import * as services from './services';


export default {
  namespace: 'OPProfile',
  state: {
    dataPipiPupu: [],
    pagination: {
      total: 0,
    },
    branches: [],
    classes: [],
    students: [],
    groupProperty: [],
    detailsStudent: {},
    dataWater: [],
    dataHeight: {},
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      dataPipiPupu: payload,
      pagination: payload.pagination,
    }),
    SET_BRANCHES: (state, { payload }) => ({
      ...state,
      branches: payload.parsePayload,
    }),
    SET_CLASSES: (state, { payload }) => ({
      ...state,
      classes: payload.items,
    }),
    SET_STUDENTS: (state, { payload }) => ({
      ...state,
      students: payload.parsePayload,
    }),
    SET_GROUP_PROPERTY: (state, { payload }) => ({
      ...state,
      groupProperty: payload.parsePayload,
    }),
    SET_DETAIL_STUDENT: (state, { payload }) => ({
      ...state,
      detailsStudent: payload,
    }),
    SET_WATER: (state, { payload }) => ({
      ...state,
      dataWater: payload,
    }),
    SET_HEIGHT: (state, { payload }) => ({
      ...state,
      dataHeight: payload,
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
    *GET_CLASSES({ payload }, saga) {
      try {
        const response = yield saga.call(categories.getClasses, payload);
        yield saga.put({
          type: 'SET_CLASSES',
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
    *GET_GROUP_PROPERTY({ payload }, saga) {
      try {
        const response = yield saga.call(services.getGroupProperty, payload);
        yield saga.put({
          type: 'SET_GROUP_PROPERTY',
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
    *GET_DETAIL_STUDENT({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getDetailStudents, payload);
        callback(response);
        yield saga.put({
          type: 'SET_DETAIL_STUDENT',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_WATER({ payload }, saga) {
      try {
        const response = yield saga.call(services.getWater, payload);
        yield saga.put({
          type: 'SET_WATER',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_HEIGHT({ payload ,callback}, saga) {
      try {
        const response = yield saga.call(services.getHeight, payload);
        callback(response);
        yield saga.put({
          type: 'SET_HEIGHT',
          payload: response,
        });
      } catch (error) {
        notification.error({
          message: 'THÔNG BÁO',
          description: `Chưa có sức khỏe y tế được tạo từ ngày ${ moment(payload?.FromDate).format('DD/MM/YYYY')} đến ngày ${ moment(payload?.ToDate).format('DD/MM/YYYY')}`,
        });
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_MEDICAL({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getMedical, payload);
        callback(response);
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_EVALUATE({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getEvaluate, payload);
        callback(response);
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
