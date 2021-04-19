import { notification } from 'antd';
import { get } from 'lodash';
import * as services from './services';

export default {
  namespace: 'criteriaGroupPropertiesAdd',
  state: {
    details: {},
    error: {
      isError: false,
      data: {},
    },
    criteriaGroups: [],
    criteriaDataTypes: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
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
    SET_CRITERIA_GROUPS: (state, { payload }) => ({
      ...state,
      criteriaGroups: payload.items,
    }),
    SET_CRITERIA_DATATYPES: (state, { payload }) => ({
      ...state,
      criteriaDataTypes: payload.items,
    }),
  },
  effects: {
    *GET_CRITERIA_GROUPS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getCriteriaGroups, payload);
        yield saga.put({
          type: 'SET_CRITERIA_GROUPS',
          payload: response,
        });
      } catch (error) {}
    },
    *GET_CRITERIA_DATATYPES({ payload }, saga) {
      try {
        const response = yield saga.call(services.getCriteriaDataTypes, payload);
        yield saga.put({
          type: 'SET_CRITERIA_DATATYPES',
          payload: response,
        });
      } catch (error) {}
    },
    *GET_DETAILS({ payload }, saga) {
      try {
        const response = yield saga.call(services.details, payload);
        if (response) {
          yield saga.put({
            type: 'SET_DETAILS',
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
    *ADD({ payload, callback }, saga) {
      try {
        yield saga.call(services.add, payload);
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
  },
  subscriptions: {},
};
