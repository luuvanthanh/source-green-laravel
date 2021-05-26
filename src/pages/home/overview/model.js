import * as services from './services';

export default {
  namespace: 'overView',
  state: {
    notes: [],
    detailsNote: {},
    medicals: [],
    detailsMedical: {},
    medicalsStudent: [],
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
    SET_LIST_MEDICAL_BY_STUDENT: (state, { payload }) => ({
      ...state,
      medicalsStudent: payload,
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
      } catch (error) {
        // continue regardless of error
      }
    },
    *GET_DETAILS_NOTE({ payload }, saga) {
      try {
        const response = yield saga.call(services.detailsNote, payload);
        yield saga.put({
          type: 'SET_DATA_DETAILS_NOTE',
          payload: response,
        });
      } catch (error) {
        // continue regardless of error
      }
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
      } catch (error) {
        // continue regardless of error
      }
    },
    *GET_DETAILS_MEDICAL({ payload }, saga) {
      try {
        const response = yield saga.call(services.detailsMedical, payload);
        yield saga.put({
          type: 'SET_DATA_DETAILS_MEDICAL',
          payload: response,
        });
      } catch (error) {
        // continue regardless of error
      }
    },
    *GET_LIST_MEDICAL_BY_STUDENT({ payload }, saga) {
      try {
        const response = yield saga.call(services.listMedicalbyStudent, payload);
        yield saga.put({
          type: 'SET_LIST_MEDICAL_BY_STUDENT',
          payload: response,
        });
      } catch (error) {
        // continue regardless of error
      }
    }
  },
  subscriptions: {},
};
