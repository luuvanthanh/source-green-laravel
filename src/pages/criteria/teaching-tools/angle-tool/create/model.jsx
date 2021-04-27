import { notification } from 'antd';
import { get } from 'lodash';
import * as services from './services';

export default {
  namespace: 'criteriaAngleToolCreate',
  state: {
    data: [],
    pagination: {
      total: 0
    }
  },
  reducers: {
    INIT_STATE: state => ({ ...state, isError: false, data: [] }),
  },
  effects: {
    *GET_DATA({ payload }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        yield saga.put({
          type: 'SET_DATA',
          payload: {
            parsePayload: response.items,
            pagination: {
              total: response.totalCount
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
  },
};
