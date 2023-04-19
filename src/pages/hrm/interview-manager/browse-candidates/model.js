import * as services from './services';

export default {
  namespace: 'hrmRecruitmentBrowseCandidates',
  state: {
    data: [],
    details: {},
    paginationReducer: {
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
      paginationReducer: payload.pagination,
    }),
    SET_DATA_DETAILS: (state, { payload }) => ({
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
    *GET_DATA({ payload }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        if (response) {
          yield saga.put({
            type: 'SET_DATA',
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
    *GET_DATA_DETAILS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getDataDetails, payload);
        callback(response.parsePayload);
        yield saga.put({
          type: 'SET_DATA_DETAILS',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *BROWSING_CANDIDATE({ payload, callback }, saga) {
      try {
        yield saga.call(services.BrowsingCandidate, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
  },
  subscriptions: {},
};
