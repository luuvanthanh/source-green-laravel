import * as categories from '@/services/categories';
import * as services from './services';

export default {
  namespace: 'timetableAsymptotic',
  state: {
    dataExpected: [],
    dataStudying: [],
    paginationExpected: {
      total: 0,
    },
    paginationStudying: {
      total: 0,
    },
    years: [],
    branches: [],
    classes: [],
    error: {
      isError: false,
      data: {},
    },
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_YEARS: (state, { payload }) => ({ ...state, years: payload }),
    SET_DATA: (state, { payload }) => {
      if (payload.key === 'expected') {
        return { ...state, dataExpected: payload.items, paginationExpected: payload.pagination };
      }
      return { ...state, dataStudying: payload.items, paginationStudying: payload.pagination };
    },
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
    SET_CLASSES: (state, { payload }) => ({
      ...state,
      classes: payload.items,
    }),
  },
  effects: {
    *GET_DATA({ payload }, saga) {
      try {
        if (payload.status === 'EXPECTED') {
          const responseExpected = yield saga.call(services.get, payload);
          yield saga.put({
            type: 'SET_DATA',
            payload: {
              items: responseExpected.items,
              pagination: {
                total: responseExpected.totalCount
              },
              key: 'expected',
            },
          });
        }
        if (payload.status === 'STUDYING') {
          const responseStudying = yield saga.call(services.get, payload);
          yield saga.put({
            type: 'SET_DATA',
            payload: {
              items: responseStudying.items,
              pagination: {
                total: responseStudying.totalCount
              },
              key: 'studying',
            },
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_YEARS({ payload, callback }, saga) {
      try {
        const years = yield saga.call(services.getYears, payload);
        callback(years.items);
        if (years) {
          yield saga.put({
            type: 'SET_YEARS',
            payload: years.items,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_BRANCHES({ payload, callback }, saga) {
      try {
        const response = yield saga.call(categories.getBranches, payload);
        callback(response.parsePayload);
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
    *GET_CLASSES({ payload, callback }, saga) {
      try {
        const response = yield saga.call(categories.getClasses, payload);
        callback(response.items);
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
    *CREATE({ payload, callback }, saga) {
      try {
        yield saga.call(services.create, payload);
        callback(payload);
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