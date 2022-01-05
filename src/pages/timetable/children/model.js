import * as categories from '@/services/categories';
import * as services from './services';

export default {
  namespace: 'timeTablesChildren',
  state: {
    objectData: {
      data: [],
      duration: null,
      fromTime: null,
      toTime:null,
    },
    years: [],
    branches: [],
    classes: [],
    error: {
      isError: false,
      data: {}
    }
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      objectData: {
        data: payload.parsePayload,
        duration: payload.duration,
        fromTime: payload.fromTime,
        toTime: payload.toTime,
      },
    }),
    SET_YEARS: (state, {payload}) => ({
      ...state,
      years: payload
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
    SET_BRANCHES: (state, { payload }) => ({
      ...state,
      branches: payload.parsePayload,
    }),
    SET_CLASSES: (state, { payload }) => ({
      ...state,
      classes: payload.items,
    }),
  },
  effects: {
    *GET_BRANCHES({ payload, callback }, saga) {
      try {
        const response = yield saga.call(categories.getBranches, payload);
        callback(response.parsePayload);
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
    *GET_CLASSES({ payload }, saga) {
      try {
        const response = yield saga.call(categories.getClasses, payload);
        yield saga.put({
          type: 'SET_CLASSES',
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
        if(response.timetableDetailGroupByTimes) {
          yield saga.put({
            type: 'SET_DATA',
            payload: {
              parsePayload: response.timetableDetailGroupByTimes,
              duration: response.timetableSetting.periodDuration,
              fromTime: response.timetableSetting.fromTime,
              toTime: response.timetableSetting.toTime
            },
          });
        } else {
          yield saga.put({
            type: 'SET_DATA',
            payload: {
              parsePayload: [],
              duration: 0,
              fromTime: null,
              toTime: null
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
    *GET_YEARS({payload, callback}, saga) {
      try {
        const response = yield saga.call(services.getYears, payload);
        if(response) {
          callback(response.items);
          yield saga.put({
            type: 'SET_YEARS',
            payload: response.items,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data
        });
      }
    }, 
  },
  subscriptions: {},
};
