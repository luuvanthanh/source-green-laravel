import * as categories from '@/services/categories';
import { notification } from 'antd';
import * as services from './services';

export default {
  namespace: 'englishStudyPlan',
  state: {
    data: [],
    branches: [],
    classes: [],
    dataYears: [],
    activities: [],
    search: [],
    program: [],
    checkModal: {
      check: false,
      data: {},
    },
    checkUse: {
      check: false,
    },
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
      dataYears:
        payload.parsePayload?.map((item) => ({
          id: item.id,
          name: `${item.yearFrom} - ${item.yearTo}`,
          ...item,
        })) || [],
    }),
    SET_PROGRAM: (state, { payload }) => ({
      ...state,
      program: payload.items,
    }),
    SET_ACTIVITIES: (state, { payload }) => ({
      ...state,
      activities: payload,
    }),
    SET_MODAL: (state, { payload }) => ({
      ...state,
      checkModal: payload,
    }),
    SET_USE: (state, { payload }) => ({
      ...state,
      checkUse: payload,
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
    *ADD_DRAG({ payload, callback }, saga) {
      try {
        yield saga.call(services.addDrag, payload);
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
    *GET_PROGRAM({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getProgram, payload);
        callback(response);
        yield saga.put({
          type: 'SET_PROGRAM',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *ADD_STUDY_PLAN({ payload, callback }, saga) {
      try {
        yield saga.call(services.addStudyPlane, payload);
        callback(payload);
        notification.success({
          message: 'Successful',
          description: 'You updated to success data.',
        });
      } catch (error) {
        callback(null, error);
      }
    },
    *SET_MODAL_ITEM({ payload }, saga) {
      yield saga.put({
        type: 'SET_MODAL',
        payload,
      });
    },
    *CHECK_USE({ payload }, saga) {
      yield saga.put({
        type: 'SET_USE',
        payload,
      });
    },
  },
  subscriptions: {},
};
