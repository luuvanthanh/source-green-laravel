import * as categories from '@/services/categories';
import * as services from './services';

export default {
  namespace: 'timeTablesAuto',
  state: {
    data: [],
    branches: [],
    classes: [],
    years: [],
    activities: [],
    search: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: payload,
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
    SET_YEARS: (state, { payload }) => ({
      ...state,
      years: payload.items,
    }),
    SET_ACTIVITIES: (state, { payload }) => ({
      ...state,
      activities: payload,
    }),
  },
  effects: {
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
    *GET_YEARS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getYears, payload);
        yield saga.put({
          type: 'SET_YEARS',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_ACTIVITIES({ payload }, saga) {
      try {
        const response = yield saga.call(services.getActivities, payload);
        yield saga.put({
          type: 'SET_ACTIVITIES',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_DATA({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
    *ADD_DRAG({ payload, callback }, saga) {
      try {
        yield saga.call(services.getAddDrag, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *ADD_POPUP({ payload, callback }, saga) {
      try {
        yield saga.call(services.getAddPopup, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    // *REMOVE({ payload, callback }, saga) {
    //   try {
    //     yield saga.call(services.remove, payload);
    //     callback(payload);
    //   } catch (error) {
    //     callback(null, error?.data?.error);
    //   }
    // },
  },
  subscriptions: {},
};
