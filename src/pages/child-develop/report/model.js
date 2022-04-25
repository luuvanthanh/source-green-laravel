import * as categories from '@/services/categories';
import * as services from './services';

  export default {
    namespace: 'childDevelopReport',
    state: {
      data: [],
      branches: [],
    classes: [],
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
      *GET_DATA({ payload, callback }, saga) {
        try {
          const response = yield saga.call(services.get, payload);
          callback(response);
          if (response) {
            yield saga.put({
              type: 'SET_DATA',
              payload: response,
            });
          }
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
    },
    subscriptions: {},
  };