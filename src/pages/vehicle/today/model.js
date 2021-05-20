// import { notification } from 'antd';
// import { get } from 'lodash';
import * as services from './services';

export default {
  namespace: 'busToday',
  state: {
    data: [],
    pagination: {
      total: 0,
    },
    busRoutes: [],
    summary: {},
    timelines: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: payload.parsePayload,
      pagination: payload.pagination,
      summary: payload.summary,
    }),
    SET_TIME_LINE: (state, { payload }) => ({
      ...state,
      timelines: payload.items,
    }),
    SET_BUS_ROUTES: (state, { payload }) => ({
      ...state,
      busRoutes: payload.items,
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
        const response = yield saga.call(services.get, payload);
        yield saga.put({
          type: 'SET_DATA',
          payload: {
            parsePayload: response.items,
            summary: response.summary,
            pagination: {
              total: response.totalCount,
            },
          },
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_TIME_LINE({ payload }, saga) {
      try {
        const response = yield saga.call(services.getTimeLine, payload);
        yield saga.put({
          type: 'SET_TIME_LINE',
          payload: response,
        });
      } catch (error) {}
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
    *GET_TRACKINGS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getTrackings, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
  },
  subscriptions: {},
};
