import * as categories from '@/services/categories';
import * as services from './services';

export default {
  namespace: 'extendedClass',
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
    *GET_BRANCHES({ payload, callback }, saga) {
      try {
        const response = yield saga.call(categories.getBranches, payload);
        yield saga.put({
          type: 'SET_BRANCHES',
          payload: response,
        });
        callback(response.parsePayload || []);
      } catch (error) {
        callback(null, error);
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
    *GET_YEARS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getYears, payload);
        yield saga.put({
          type: 'SET_YEARS',
          payload: response,
        });
        callback(response.items || []);
      } catch (error) {
        callback(null, error);
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
    *DRAG_AFTER({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
    *DRAG({ payload, callback }, saga) {
      try {
        yield saga.call(services.drag, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *UPDATE_ACTIVITIES({ payload, callback }, saga) {
      try {
        yield saga.call(services.updateActivies, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *EDIT_POPUP({ payload, callback }, saga) {
      try {
        yield saga.call(services.editPopUp, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *DRAG_CELL_BY_CELL({ payload, callback }, saga) {
      try {
        yield saga.call(services.dragCellByCell, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *REMOVE({ payload, callback }, saga) {
      try {
        yield saga.call(services.removeActivites, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
  },
  subscriptions: {},
};
