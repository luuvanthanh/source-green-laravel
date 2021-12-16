import * as categories from '@/services/categories';
import * as services from './services';

export default {
  namespace: 'probationaryContracts',
  state: {
    data: [],
    pagination: {},
    employees: [],
    categories: {
      branches: [],
      positions: [],
      typeOfContracts: [],
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
    SET_CATEGORIES: (state, { payload }) => ({
      ...state,
      categories: {
        positions: payload.positions.parsePayload,
        branches: payload.branches.parsePayload,
        typeOfContracts: payload.typeOfContracts.parsePayload,
      },
    }),
    SET_EMPLOYEES: (state, { payload }) => ({
      ...state,
      employees: payload.parsePayload,
    }),
  },
  effects: {
    *GET_CATEGORIES({ _ }, saga) {
      try {
        const response = yield saga.all({
          positions: saga.call(categories.getPositions),
          branches: saga.call(categories.getBranches),
          typeOfContracts: saga.call(categories.getTypeOfContracts, { type: 'THU_VIEC' }),
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
    *GET_DATA({ payload }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
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
    *REMOVE({ payload, callback }, saga) {
      try {
        yield saga.call(services.remove, payload.id);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
  },
  subscriptions: {},
};
