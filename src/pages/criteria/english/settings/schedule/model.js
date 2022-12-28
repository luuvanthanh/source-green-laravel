import { notification } from 'antd';
import { head } from 'lodash';

import * as services from './services';

export default {
  namespace: 'englishSettingSchedule',
  state: {
    details: {},
    skill: [],
    dataSubject: [],
    error: {
      isError: false,
      data: {},
    },
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      details: payload,
    }),
    SET_DATA_SUBJECT: (state, { payload }) => ({
      ...state,
      dataSubject: head(payload?.items),
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
    *ADD({ payload, callback }, saga) {
      try {
        yield saga.call(services.add, payload);
        callback(payload);
        notification.success({
          message: 'Successful',
          description: 'You updated to success data.',
        });
      } catch (error) {
        callback(null, error?.data);
      }
    },
    *GET_DATA_SUBJECT({ payload }, saga) {
      try {
        const response = yield saga.call(services.getDataSubject, payload);
        yield saga.put({
          type: 'SET_DATA_SUBJECT',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
  },
};
