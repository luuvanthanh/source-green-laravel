// import { notification } from 'antd';
// import { get } from 'lodash';
import * as categories from '@/services/categories';
import * as services from './services';

export default {
  namespace: 'busHistory',
  state: {
    data: [],
    years: [],
    pagination: {
      total: 0,
    },
    busRoutes: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: payload.parsePayload,
      pagination: payload.pagination,
    }),
    SET_BUS_ROUTES: (state, { payload }) => ({
      ...state,
      busRoutes: payload.items,
    }),
    SET_YEARS: (state, { payload }) => ({
      ...state,
      years:
        payload.parsePayload?.map((item) => ({
          id: item.id,
          name: `Năm học  ${item.yearFrom} - ${item.yearTo}`,
        })) || [],
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
        yield saga.put({
          type: 'INIT_STATE',
        });
        if (payload.date) {
          const response = yield saga.call(services.get, payload);
          yield saga.put({
            type: 'SET_DATA',
            payload: {
              parsePayload: response.items,
              pagination: {
                total: response.totalCount,
              },
            },
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_BUS_ROUTES({ payload }, saga) {
      try {
        const response = yield saga.call(services.getBusRoutes, payload);
        yield saga.put({
          type: 'SET_BUS_ROUTES',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_TRACKING_CURRENT({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getTrackingCurrent, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
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
  },
  subscriptions: {},
};
