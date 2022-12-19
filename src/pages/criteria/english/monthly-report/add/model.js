import { notification } from 'antd';
import * as services from './services';

export default {
  namespace: 'EnglishMonthReportAdd',
  state: {
    details: [],
    skill: [],
    dataScriptReview: [],
    dataEvaluetionCriteria: [],
    error: {
      isError: false,
      data: {},
    },
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      details: payload.parsePayload,
    }),
    SET_DATA_SCRIPT_REVIEW: (state, { payload }) => ({
      ...state,
      dataScriptReview: payload.parsePayload,
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
    SET_SKILL: (state, { payload }) => ({
      ...state,
      skill: payload.parsePayload.filter((i) => i.use === true),
    }),
    SET_DATA_EVALUATION_CRITERRIA: (state, { payload }) => ({
      ...state,
      dataEvaluetionCriteria: payload.parsePayload,
    }),
  },
  effects: {
    *GET_DATA({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getData, payload);
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
        const response = yield saga.call(services.getDataStudent, payload);
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
    *ADD({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.add, payload);
        callback(response);
        notification.success({
          message: 'Successful',
          description: 'You update to success data.',
        });
      } catch (error) {
        callback(null, error?.data);
      }
    },
    *GET_DATA_SCRIPT_REVIEW({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getDataScriptReview, payload);
        callback(response);
        if (response) {
          yield saga.put({
            type: 'SET_DATA_SCRIPT_REVIEW',
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
    *GET_DATA_EVALUATION_CRITERRIA({ payload }, saga) {
      try {
        const response = yield saga.call(services.getDataEvaluetionCriteria, payload);
        if (response) {
          yield saga.put({
            type: 'SET_DATA_EVALUATION_CRITERRIA',
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
    *GET_DATA_DETAIL({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getDatDetail, payload);
        callback(response);
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
  },
};
