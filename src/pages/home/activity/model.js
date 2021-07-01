import * as services from './services';

export default {
  namespace: 'activity',
  state: {
    notes: {},
    medicals: {},
    studentCriterias: {},
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA_MEDICAL: (state, { payload }) => ({
      ...state,
      medicals: payload,
    }),
    SET_STUDENT_CRITERIAS: (state, { payload }) => ({
      ...state,
      studentCriterias: payload,
    }),
    SET_DATA_NOTE: (state, { payload }) => ({
      ...state,
      notes: payload,
    }),
  },
  effects: {
    *GET_DATA_NOTE({ payload }, saga) {
      try {
        const response = yield saga.call(services.getNote, payload);
        yield saga.put({
          type: 'SET_DATA_NOTE',
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
          payload: response,
        });
      } catch (error) {
        // continue regardless of error
      }
    },
    *GET_STUDENT_CRITERIAS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getStudentCriterias, payload);
        yield saga.put({
          type: 'SET_STUDENT_CRITERIAS',
          payload: response,
        });
      } catch (error) {
        // continue regardless of error
      }
    },
  },
  subscriptions: {},
};
