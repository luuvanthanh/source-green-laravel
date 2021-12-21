// import * as services from './services';

export default {
  namespace: 'allocationRegisterAdd',
  state: {
    details: {
      id: 1,
        classTypes:"Preschool",
        class: "Preschool 1",
        date: "2021-12-20T04:51:36.941119Z",
        count: "2",
        handleStatus: "DOES_NOT_SOLVE",
        name: "Nguyễn Thị V",
    },
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
      details: payload,
    }),
  },
  effects: {
    // *GET_DETAILS({ payload,callback }, saga) {
    //   try {
    //     const response = yield saga.call(services.details, payload);
    //     callback(response);
    //     if (response) {
    //       yield saga.put({
    //         type: 'SET_DETAILS',
    //         payload: response,
    //       });
    //     }
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
    //     callback(null, error);
    //   }
    // },
    // *UPDATE({ payload, callback }, saga) {
    //   try {
    //     yield saga.call(services.update, payload);
    //     callback(payload);
    //   } catch (error) {
    //     callback(null, error);
    //   }
    // },
    // *REMOVE({ payload, callback }, saga) {
    //   try {
    //     yield saga.call(services.remove, payload.id);
    //     callback(payload);
    //   } catch (error) {
    //     callback(null, error);
    //   }
    // },
  },
  subscriptions: {},
};