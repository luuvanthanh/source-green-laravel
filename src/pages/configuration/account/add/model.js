import * as categories from '@/services/categories';
import * as services from './services';

export default {
  namespace: 'configurationAccountAdd',
  state: {
    dataStores: [],
    isError: false,
    error: {
      isError: false,
      data: {},
    },
    details: {},
    roles: [],
    parents: [],
    employees: [],
  },
  reducers: {
    INIT_STATE: (state) => ({
      ...state,
      isError: false,
      error: { isError: false, data: {} },
      data: [],
    }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      dataStores: payload,
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
    SET_DETAILS: (state, { payload }) => ({
      ...state,
      details: payload,
    }),
    SET_ROLES: (state, { payload }) => ({
      ...state,
      roles: payload.items,
    }),
    SET_PARENTS: (state, { payload }) => ({
      ...state,
      parents: payload.items,
    }),
    SET_EMPLOYEES: (state, { payload }) => ({
      ...state,
      employees: payload.items,
    }),
  },
  effects: {
    *GET_ROLES({ payload }, saga) {
      try {
        const response = yield saga.call(categories.getRoles, payload);
        yield saga.put({
          type: 'SET_ROLES',
          payload: response,
        });
      // eslint-disable-next-line no-empty
      } catch (error) {}
    },
    *GET_PARENTS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getParents, payload);
        yield saga.put({
          type: 'SET_PARENTS',
          payload: response,
        });
      // eslint-disable-next-line no-empty
      } catch (error) {}
    },
    *GET_EMPLOYEES({ payload }, saga) {
      try {
        const response = yield saga.call(services.getEmployees, payload);
        yield saga.put({
          type: 'SET_EMPLOYEES',
          payload: response,
        });
      // eslint-disable-next-line no-empty
      } catch (error) {}
    },
    *ADD({ payload, callback }, saga) {
      try {
        yield saga.call(services.add, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *ADD_EMPLOYEES_ACCOUNTS({ payload, callback }, saga) {
      try {
        yield saga.call(services.addEmployeesAccounts, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *ADD_PARENTS_ACCOUNTS({ payload, callback }, saga) {
      try {
        yield saga.call(services.addParentAccounts, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *GET_DETAILS({ payload }, saga) {
      try {
        const response = yield saga.call(services.details, payload);
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
  },
  subscriptions: {},
};
