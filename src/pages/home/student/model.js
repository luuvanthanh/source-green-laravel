import * as services from './services';

export default {
  namespace: 'studentHomePage',
  state: {
    students: [],
    detailsStudent: {},
    bus: []
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA_STUDENT: (state, { payload }) => ({
      ...state,
      students: payload.parsePayload,
    }),
    SET_DATA_DETAIL_STUDENT: (state, { payload }) => ({
      ...state,
      detailsStudent: payload,

    }),
    SET_DATA_BUS: (state, { payload }) => ({
      ...state,
      bus: payload.parsePayload,
    }),
  },
  effects: {
    *GET_DATA_STUDENT({ payload }, saga) {
      try {
        const response = yield saga.call(services.getStudent, payload);
        yield saga.put({
          type: 'SET_DATA_STUDENT',
          payload: {
            parsePayload: response.items,
          },
        });
      } catch (error) {
        // continue regardless of error
      }
    },
    *GET_DETAIL_STUDENT({ payload }, saga) {
      try {
        const response = yield saga.call(services.detailsStudent, payload);
        yield saga.put({
          type: 'SET_DATA_DETAIL_STUDENT',
          payload: response,
        });
      } catch (error) {
        // continue regardless of error
      }
    },
    *GET_DATA_BUS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getBusByStudent, payload);
        yield saga.put({
          type: 'SET_DATA_BUS',
          payload: {
            parsePayload: response.items,
          },
        });
      } catch (error) {
        // continue regardless of error
      }
    },
  },
  subscriptions: {},
};
