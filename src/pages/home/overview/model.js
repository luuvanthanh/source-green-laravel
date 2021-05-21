import * as services from './services';

export default {
  namespace: 'overView',
  state: {
    notes: [],
    detailsNote: {},
    medicals: [],
    detailsMedical: {}
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA_NOTE: (state, { payload }) => ({
      ...state,
      notes: payload.parsePayload,
    }),
    SET_DATA_DETAILS_NOTE: (state, { payload }) => ({
      ...state,
      detailsNote: payload,
    }),
    SET_DATA_MEDICAL: (state, { payload }) => ({
      ...state,
      medicals: payload.parsePayload,
    }),
    SET_DATA_DETAILS_MEDICAL: (state, { payload }) => ({
      ...state,
      detailsMedical: payload,
    }),
  },
  effects: {
    *GET_DATA_NOTE({ payload }, saga) {
      try {
        const response = yield saga.call(services.getNote, payload);
        yield saga.put({
          type: 'SET_DATA_NOTE',
          payload: {
            parsePayload: response.items,
          },
        });
      } catch (error) {}
    },
    *GET_DETAILS_NOTE({ payload }, saga) {
      try {
        const response = yield saga.call(services.detailsNote, payload);
        yield saga.put({
          type: 'SET_DATA_DETAILS_NOTE',
          payload: response,
        });
      } catch (error) {}
    },
    *GET_DATA_MEDICAL({ payload }, saga) {
      try {
        const response = yield saga.call(services.getMedical, payload);
        yield saga.put({
          type: 'SET_DATA_MEDICAL',
          payload: {
            parsePayload: response.items,
          },
        });
      } catch (error) {}
    },
    *GET_DETAILS_MEDICAL({ payload }, saga) {
      try {
        const response = yield saga.call(services.detailsMedical, payload);
        yield saga.put({
          type: 'SET_DATA_DETAILS_MEDICAL',
          payload: response,
        });
      } catch (error) {}
    }
  },
  subscriptions: {},
};
