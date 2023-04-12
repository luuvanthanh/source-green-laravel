import * as services from './services';

export default {
  namespace: 'hrmRecruitmentRecruitmentListAdd',
  state: {
    details: {},
    skill: [],
    error: {
      isError: false,
      data: {},
    },
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      details: payload?.parsePayload      ,
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
    *GET_DATA({ payload,callback }, saga) {
      try {
        const response = yield saga.call(services.getData, payload);
        callback(response.parsePayload);
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
    *GET_LINK_RECRUITMENT({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getRecruiment, payload);
        callback(response.parsePayload);
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
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *UPDATE({ payload, callback }, saga) {
      try {
        yield saga.call(services.update, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *ADD_DATA_USER({ payload, callback }, saga) {
     try {
        yield saga.call(services.addDataUser, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *ADD_USER_STATUS({ payload, callback }, saga) {
      try {
         yield saga.call(services.addUserStatus, payload);
         callback(payload);
       } catch (error) {
         callback(null, error?.data?.error);
       }
     },
    *GET_DATA_USER({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getDataUser, payload);
        callback(response.parsePayload);
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
  },
};
