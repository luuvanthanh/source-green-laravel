import { v4 as uuidv4 } from 'uuid';
import * as categories from '@/services/categories';
import * as services from './services';

export default {
  namespace: 'menuStudentExchangeFood',
  state: {
    data: [],
    dataFood: [],
    years: [],
    paginationReducer: {
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
      data: payload.items?.map(i=> ({...i,  id: uuidv4() })),
      paginationReducer: {
        total:  payload.totalCount
      },
    }),
    SET_YEARS: (state, { payload }) => ({
      ...state,
      years:
        payload.parsePayload?.map((item) => ({
          id: item.id,
          name: `Năm học  ${item.yearFrom} - ${item.yearTo}`,
          ...item,
        })) || [],
    }),
    SET_FOOD: (state, { payload }) => ({
      ...state,
      dataFood: payload,
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
    *GET_FOOD({ payload }, saga) {
      try {
        const response = yield saga.call(services.getFood, payload);
        yield saga.put({
          type: 'SET_FOOD',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_YEARS({ payload }, saga) {
      try {
        const response = yield saga.call(categories.getYears, payload);
        yield saga.put({
          type: 'SET_YEARS',
          payload: {
            parsePayload: response,
          },
        });
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
  },
  subscriptions: {},
};
