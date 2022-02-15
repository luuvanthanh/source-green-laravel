import * as categories from '@/services/categories';

export default {
  namespace: 'categories',
  state: {
    boGroups: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_BUSINESS_OBJECT_GROUP: (state, { payload }) => ({
      ...state,
      boGroups: payload.boGroups.items,
    }),
  },
  effects: {
    *GET_STUDENTS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(categories.getStudents, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_BRANCHES({ payload, callback }, saga) {
      try {
        const response = yield saga.call(categories.getBranches, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_CLASSES({ payload, callback }, saga) {
      try {
        const response = yield saga.call(categories.getClasses, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_TEACHERS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(categories.getTeachers, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
  },
  subscriptions: {},
};
