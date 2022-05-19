import { variables } from '@/utils';
import * as categories from '@/services/categories';
import * as services from './services';

export default {
  namespace: 'OPchildrenAdd',
  state: {
    details: {},
    error: {
      status: null,
      isError: false,
    },
    parents: [],
    employees: [],
    branches: [],
    classes: [],
  },
  reducers: {
    INIT_STATE: (state) => ({
      ...state,
      details: {},
      error: {
        status: null,
        isError: false,
      },
    }),
    SET_DETAILS: (state, { payload }) => ({
      ...state,
      details: payload,
      error: {
        status: null,
        isError: false,
      },
    }),
    SET_PARENTS: (state, { payload }) => ({
      ...state,
      parents: payload.items,
    }),
    SET_EMPLOYEES: (state, { payload }) => ({
      ...state,
      employees: payload.parsePayload,
    }),
    SET_BRANCHES: (state, { payload }) => ({
      ...state,
      branches: payload.parsePayload,
    }),
    SET_CLASSES: (state, { payload }) => ({
      ...state,
      classes: payload.items,
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
    *ADD({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.add, payload);
        callback(response);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *ADD_TRANSPORTER({ payload, callback }, saga) {
      try {
        yield saga.call(services.addTransporter, payload);
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
    *STORE_STUDENT({ payload, callback }, saga) {
      try {
        yield saga.call(services.storeStudent, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *UPDATE_STATUS({ payload, callback }, saga) {
      try {
        yield saga.call(services.updateStatus, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *GET_DETAILS({ payload }, saga) {
      try {
        yield saga.put({
          type: 'INIT_STATE',
        });
        const response = yield saga.call(services.details, payload);
        if (response.status === variables.STATUS_204) {
          yield saga.put({
            type: 'SET_ERROR',
            payload: {
              status: variables.STATUS_204,
            },
          });
          return;
        }
        yield saga.put({
          type: 'SET_DETAILS',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_PARENTS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getParents, payload);
        yield saga.put({
          type: 'SET_PARENTS',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_EMPLOYEES({ payload }, saga) {
      try {
        const response = yield saga.call(categories.getEmployees, payload);
        yield saga.put({
          type: 'SET_EMPLOYEES',
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
    *UPDATE_STATUS_RESTORE({ payload, callback }, saga) {
      try {
        yield saga.call(services.updateStatusRestore, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
  },
  subscriptions: {},
};
