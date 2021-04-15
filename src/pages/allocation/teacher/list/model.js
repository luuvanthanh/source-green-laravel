import * as services from './services';

export default {
  namespace: 'allocationTeacherList',
  state: {
    data: [],
    pagination: {},
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
  },
  effects: {
    *GET_STUDENTS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getStudents, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_TEACHERS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getTeachers, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
  },
  subscriptions: {},
};
