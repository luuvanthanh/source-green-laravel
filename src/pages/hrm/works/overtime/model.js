import { head } from 'lodash';
import * as categories from '@/services/categories';
import * as services from './services';

export default {
  namespace: 'worksOvertime',
  state: {
    data: [],
    pagination: {},
    error: {
      isError: false,
    },
    holidays: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: payload.parsePayload,
      pagination: payload.pagination,
    }),
    SET_HOLIDAYS: (state, { payload }) => ({
      ...state,
      holidays: head(payload?.parsePayload)?.holidayDetails || [],
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
  },
  effects: {
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
