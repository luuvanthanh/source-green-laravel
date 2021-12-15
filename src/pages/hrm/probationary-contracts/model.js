import * as categories from '@/services/categories';
import { Helper } from '@/utils';
import moment from 'moment';
import * as services from './services';
import { variables } from './variables';

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
      data: payload,
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
      const flag = payload?.statusId;
      try {
        const response = yield saga.call(services.get, payload);
        if (response) {
          if (flag) {
            yield saga.put({
              type: 'SET_DATA',
              payload: response.parsePayload.filter(
                (item) =>
                  variables[flag] ===
                  Helper.getStatusContracts(moment(item?.contractFrom), moment(item?.contractTo))
                    .props?.children,
              ),
            });
          } else {
            yield saga.put({
              type: 'SET_DATA',
              payload: response.parsePayload,
            });
          }
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
