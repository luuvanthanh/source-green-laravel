import { isEmpty } from 'lodash';
import * as categories from '@/services/categories';
import * as services from './services';

export default {
  namespace: 'businessCardsAdd',
  state: {
    data: [],
    pagination: {
      total: 0,
    },
    categories: {
      absentTypes: [],
      users: [],
    },
    error: {
      isError: false,
      data: {},
    },
    shiftUsers: [],
    absentTypes: [],
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
    SET_CATEGORIES: (state, { payload }) => ({
      ...state,
      categories: {
        users: payload.users.parsePayload,
      },
    }),
    SET_SHIFT_USERS: (state, { payload }) => ({
      ...state,
      shiftUsers: !isEmpty(payload.payload) ? payload.payload : {},
    }),
    SET_ABSENT_TYPES: (state, { payload }) => ({
      ...state,
      absentTypes: payload.parsePayload,
    }),
  },
  effects: {
    *GET_ABSENT_TYPES({ payload }, saga) {
      try {
        const response = yield saga.call(services.getAbsentTypes, payload);
        yield saga.put({
          type: 'SET_ABSENT_TYPES',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_CATEGORIES({ _ }, saga) {
      try {
        const response = yield saga.all({
          users: saga.call(categories.getUsers),
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
    *GET_SHIFT_USERS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getShiftUsers, payload);
        yield saga.put({
          type: 'SET_SHIFT_USERS',
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
      } catch (error) {
        callback(null, error);
      }
    },
    *UPDATE({ payload, callback }, saga) {
      try {
        yield saga.call(services.update, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_DATA({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.get, payload.id);
        yield saga.put({
          type: 'GET_SHIFT_USERS',
          payload: {
            ...response.parsePayload,
          },
        });
        callback(response.parsePayload);
      } catch (error) {
        callback(null, error);
      }
    },
  },
  subscriptions: {},
};
