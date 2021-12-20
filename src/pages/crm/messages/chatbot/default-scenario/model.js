// import * as services from './services';

export default {
  namespace: 'crmChatbotDefaultScenario',
  state: {
    details: [],
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
    // *GET_DATA({ payload, callback }, saga) {
    //   try {
    //     const response = yield saga.call(services.getData, payload);
    //     callback(response);
    //     yield saga.put({
    //       type: 'SET_DATA',
    //       payload: response,
    //     });
    //   } catch (error) {
    //     yield saga.put({
    //       type: 'SET_ERROR',
    //       payload: error.data,
    //     });
    //   }
    // },
    // *ADD({ payload, callback }, saga) {
    //   try {
    //     yield saga.call(services.add, payload);
    //     callback(payload);
    //   } catch (error) {
    //     callback(null, error?.data);
    //   }
    // },
    // *GET_SKILL({ payload }, saga) {
    //   try {
    //     const response = yield saga.call(services.getSkill, payload);
    //     yield saga.put({
    //       type: 'SET_SKILL',
    //       payload: response,
    //     });
    //   } catch (error) {
    //     yield saga.put({
    //       type: 'SET_ERROR',
    //       payload: error.data,
    //     });
    //   }
    // },
    // *UPDATE({ payload, callback }, saga) {
    //   try {
    //     yield saga.call(services.update, payload);
    //     callback(payload);
    //   } catch (error) {
    //     callback(null, error?.data?.error);
    //   }
    // },
  },
};