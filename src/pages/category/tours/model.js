import * as services from './services';
import { dataSource } from './data.json';

export default {
  namespace: 'categoryTours',
  state: {
    data: [],
    pagination: {
      total: 0
    }
  },
  reducers: {
    INIT_STATE: state => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: payload.parsePayload,
      pagination: payload.pagination
    }),
    SET_ERROR: (state, { payload }) => ({
      ...state,
      error: {
        isError: true,
        data: {
          ...payload
        }
      }
    })
  },
  effects: {
    *GET_DATA(_, saga) {
      try {
        // const response = yield saga.call(services.get, payload);
        yield saga.put({
          type: 'SET_DATA',
          payload: {
            parsePayload: dataSource,
            pagination: {
              total: 10
            }
          },
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data
        });
      }
    },
    *ADD({ payload, callback }, saga) {
      try {
        yield saga.call(services.add, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
  },
  subscriptions: {},
};
