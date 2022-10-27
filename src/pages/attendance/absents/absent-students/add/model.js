import * as categories from '@/services/categories';
import * as services from './services';

export default {
  namespace: 'absentStudentsAdd',
  state: {
    data: [],
    holiday: [],
    pagination: {
      total: 0,
    },
    categories: {
      absentTypes: [],
      absentReasons: [],
      users: [],
    },
    students: [],
    branches: [],
    classes: [],
    error: {
      isError: false,
      data: {},
    },
    details: {},
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
    SET_DETAILS: (state, { payload }) => ({
      ...state,
      details: payload,
    }),
    SET_BRANCHES: (state, { payload }) => ({
      ...state,
      branches: payload.parsePayload,
    }),
    SET_CLASSES: (state, { payload }) => ({
      ...state,
      classes: payload.items,
    }),
    SET_HOLIDAY: (state, { payload }) => ({
      ...state,
      holiday: payload.map((i) => i.holidayDetails).flat(Infinity),
    }),
  },
  effects: {
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
    *GET_CATEGORIES({ _ }, saga) {
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
    *GET_DETAILS({ payload }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
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
    *GET_HOLIDAY({ payload }, saga) {
      try {
        const response = yield saga.call(services.getHoliday, payload);
        if (response) {
          yield saga.put({
            type: 'SET_HOLIDAY',
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
  },
  subscriptions: {},
};
