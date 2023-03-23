import * as categories from '@/services/categories';
import * as services from './services';

export default {
  namespace: 'seasonalContractsAdd',
  state: {
    data: [],
    pagination: {
      total: 0,
    },
    categories: {
      users: [],
      branches: [],
      positions: [],
      divisions: [],
      paramaterValues: [],
    },
    contractTypes: [],
    Staff: [],
    details: {},
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
    SET_DETAILS: (state, { payload }) => ({
      ...state,
      details: payload,
    }),
    SET_CATEGORIES: (state, { payload }) => ({
      ...state,
      categories: {
        users: payload.users.parsePayload,
        divisions: payload.divisions.parsePayload,
        positions: payload.positions.parsePayload,
        branches: payload.branches.parsePayload,
        paramaterValues: payload.paramaterValues.parsePayload,
      },
    }),
    SET_TYPE_CONTRACTS: (state, { payload }) => ({
      ...state,
      contractTypes: payload.parsePayload,
    }),
    SET_STAFF: (state, { payload }) => ({
      ...state,
      Staff: payload?.filter(
        (i) =>
          i?.positionLevelNow?.division?.code === 'CEO' ||
          i?.positionLevelNow?.division?.code === 'HC',
      ),
    }),
  },
  effects: {
    *GET_TYPE_CONTRACTS({ payload }, saga) {
      try {
        const response = yield saga.call(categories.getTypeOfContracts, payload);
        yield saga.put({
          type: 'SET_TYPE_CONTRACTS',
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
          users: saga.call(services.getUsers),
          divisions: saga.call(categories.getDivisions),
          positions: saga.call(categories.getPositions),
          branches: saga.call(categories.getBranches),
          paramaterValues: saga.call(categories.getParamaterValues, { type: 'CONTRACT' }),
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
    *GET_CONTRACTS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        callback(response.parsePayload);
      } catch (error) {
        callback(null, error);
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
    *GET_STAFF({ payload }, saga) {
      try {
        const response = yield saga.call(services.getStaff, payload);
        if (response) {
          yield saga.put({
            type: 'SET_STAFF',
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
