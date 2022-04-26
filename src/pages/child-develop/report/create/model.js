import { head } from 'lodash';
import * as services from './services';

export default {
  namespace: 'childDevelopReportAdd',
  state: {
    details: {},
    skills: [],
    error: {
      isError: false,
      data: {},
    },
    paramaterValues: [],
    paramaterFormulas: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_ERROR: (state, { payload }) => ({
      ...state,
      error: {
        isError: true,
        data: {
          ...payload,
        },
      },
    }),
    SET_DETAILS: (state, { payload }) => ({
      ...state,
      details: head(payload),
    }),
    SET_SKILL: (state, { payload }) => ({
      ...state,
      skills: payload.parsePayload,
    }),
  },
  effects: {
    *GET_DETAILS({ payload , callback}, saga) {
      try {
        const response = yield saga.call(services.details, payload);
        callback(response?.parsePayload);
        if (response) {
          yield saga.put({
            type: 'SET_DETAILS',
            payload: response.parsePayload,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_SKILL({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getSkill, payload);
        callback(response);
        if (response) {
          yield saga.put({
            type: 'SET_SKILL',
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
  },
  subscriptions: {},
};