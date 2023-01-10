import * as categories from '@/services/categories';
import { head } from 'lodash';
import { notification } from 'antd';
import * as services from './services';

export default {
  namespace: 'EnglishMonthlyReport',
  state: {
    data: [],
    years: [],
    assessmentPeriod: [],
    dataType: [],
    pagination: {
      total: 0,
    },
    branches: [],
    dataAssess: {},
    classes: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: payload.parsePayload,
      pagination: payload.pagination,
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
      years:
        payload.parsePayload?.map((item) => ({
          id: item.id,
          name: `${item.yearFrom} - ${item.yearTo}`,
          ...item,
        })) || [],
    }),
    SET_ASESSMENT_PERIOD: (state, { payload }) => ({
      ...state,
      assessmentPeriod: payload.parsePayload?.map((i) => ({
        ...i,
        name: i?.nameAssessmentPeriod.name,
      })),
    }),
    SET_DATA_TYPE: (state, { payload }) => ({
      ...state,
      dataType: payload.parsePayload,
    }),
    SET_ASSESS: (state, { payload }) => ({
      ...state,
      dataAssess: head(payload.parsePayload),
    }),
    SET_DATA_STUDENTS: (state, { payload }) => ({
      ...state,
      pagination: payload.pagination,
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
    *GET_ASSESS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getAssess, payload);
        callback(response);
        yield saga.put({
          type: 'SET_ASSESS',
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
        yield saga.put({
          type: 'SET_DATA',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_DATA_STUDENTS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getStudent, payload);
        callback(response);
        yield saga.put({
          type: 'SET_DATA_STUDENTS',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *ADD_ONE_ITEM_REVIEW({ payload, callback }, saga) {
      try {
        yield saga.call(services.addOneItem, payload);
        callback(payload);
        notification.success({
          message: 'Successful',
          description: 'You updated to success data.',
        });
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *ADD_REVIEW({ payload, callback }, saga) {
      try {
        yield saga.call(services.addReview, payload);
        callback(payload);
        notification.success({
          message: 'Successful',
          description: 'You updated to success data.',
        });
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *UPDATE({ payload, callback }, saga) {
      try {
        yield saga.call(services.update, payload);
        callback(payload);
        notification.success({
          message: 'Successful',
          description: 'You updated to success data.',
        });
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *REMOVE({ payload }, saga) {
      try {
        yield saga.call(services.remove, payload.id);
        yield saga.put({
          type: 'GET_DATA',
          payload: payload.pagination,
        });
        notification.success({
          message: 'Successful',
          description: 'You deleted to success data.',
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
    *GET_DATA_TYPE({ payload }, saga) {
      try {
        const response = yield saga.call(services.getDataType, payload);
        yield saga.put({
          type: 'SET_DATA_TYPE',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *ADD_SENT({ payload, callback }, saga) {
      try {
        yield saga.call(services.addSent, payload);
        callback(payload);
        notification.success({
          message: 'Successful',
          description: 'You updated to success data.',
        });
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *ADD_SENT_ALL({ payload, callback }, saga) {
      try {
        yield saga.call(services.addSentAll, payload);
        callback(payload);
        notification.success({
          message: 'Successful',
          description: 'You updated to success data.',
        });
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *ADD_CONFIRMED_ALL({ payload, callback }, saga) {
      try {
        yield saga.call(services.addConfirmedAll, payload);
        callback(payload);
        notification.success({
          message: 'Successful',
          description: 'You updated to success data.',
        });
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *ADD_CONFIRM({ payload, callback }, saga) {
      try {
        yield saga.call(services.addConfirm, payload);
        callback(payload);
        notification.success({
          message: 'Successful',
          description: 'You updated to success data.',
        });
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *DELETE_CONFIRM({ payload, callback }, saga) {
      try {
        yield saga.call(services.removeConfirm, payload.id);
        notification.success({
          message: 'Successful',
          description: 'You deleted to success data.',
        });
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *UPDATE_SENT({ payload, callback }, saga) {
      try {
        yield saga.call(services.updateSent, payload);
        callback(payload);
        notification.success({
          message: 'Successful',
          description: 'You updated to success data.',
        });
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
  },
  subscriptions: {},
};
