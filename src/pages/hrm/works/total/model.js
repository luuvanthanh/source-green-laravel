import { head } from 'lodash';
import { Helper } from '@/utils';
import * as categories from '@/services/categories';
import * as services from './services';

export default {
  namespace: 'works',
  state: {
    data: [],
    pagination: {},
    error: {
      isError: false,
    },
    holidays: [],
    divisions: [],
    branches: [],
    employees: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: Object.keys(payload.payload).map((key) => ({
        id: key,
        name: key,
        children:
          payload?.payload[key]?.Division &&
          Object.keys(payload?.payload[key]?.Division).map((keyParent) => ({
            key: `${key}-${keyParent}`,
            name: keyParent,
            children:
              payload?.payload[key]?.Division[keyParent]?.ListUser &&
              Object.keys(payload?.payload[key]?.Division[keyParent]?.ListUser).map(
                (keyProduct) => ({
                  key: `${key}-${keyParent}-${keyProduct}`,
                  name: keyProduct,
                  ...(payload?.payload[key]?.Division[keyParent]?.ListUser[keyProduct] || {}),
                }),
              ),
          })),
      })),
      pagination: payload.pagination,
    }),
    SET_HOLIDAYS: (state, { payload }) => ({
      ...state,
      holidays: head(payload?.parsePayload)?.holidayDetails
        ? Helper.getArrayHolidays(head(payload?.parsePayload)?.holidayDetails)
        : [],
    }),
    SET_ERROR: (state, { payload }) => ({
      ...state,
      error: {
        isError: true,
        status: payload.status,
        title: payload.status,
      },
    }),
    UPDATE_DATA: (state, { payload }) => ({
      ...state,
      data: state.data.map((item) =>
        item.id === payload.id ? { ...item, status: payload.status } : item,
      ),
    }),
    SET_DIVISIONS: (state, { payload }) => ({
      ...state,
      divisions: payload.parsePayload,
    }),
    SET_BRANCHES: (state, { payload }) => ({
      ...state,
      branches: payload.parsePayload,
    }),
    SET_EMPLOYEES: (state, { payload }) => ({
      ...state,
      employees: payload.parsePayload,
    }),
  },
  effects: {
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
    *GET_DIVISIONS({ payload }, saga) {
      try {
        const response = yield saga.call(categories.getDivisions, payload);
        yield saga.put({
          type: 'SET_DIVISIONS',
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
    *GET_HOLIDAYS({ payload }, saga) {
      try {
        const response = yield saga.call(categories.getHolidays, payload);
        if (response) {
          yield saga.put({
            type: 'SET_HOLIDAYS',
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
  },
  subscriptions: {},
};
