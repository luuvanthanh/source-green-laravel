// import * as services from './services';

export default {
  namespace: 'childDevelopAssessmentPeriod',
  state: {
    data: [
      {
        id: 1,
        key: 1,
        code: "KN01",
        name: "Học kì I",
        date: "2018 - 2019",
        time: "01/01/2019 - 31/01/2019 ",
        use: true
      },
      {
        id: 2,
        key: 2,
        code: "KN02",
        name: "Học kì I",
        date: "2018 - 2019",
        time: "01/01/2019 - 31/01/2019 ",
        use: false
      },
      {
        id: 3,
        key: 3,
        code: "KN03",
        name: "Học kì I",
        date: "2018 - 2019",
        time: "01/01/2019 - 31/01/2019 ",
        use: true
      }
    ],
    pagination: {
      total: 0,
    },
    error: {
      isError: false,
      data: {},
    },
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: payload.parsePayload,
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
    // *GET_DATA({ payload }, saga) {
    //   try {
    //     const response = yield saga.call(services.get, payload);
    //     if (response) {
    //       yield saga.put({
    //         type: 'SET_DATA',
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
