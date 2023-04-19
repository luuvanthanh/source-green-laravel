import * as categories from '@/services/categories';

export default {
  namespace: 'categories',
  state: {
    boGroups: [],
    divisions: [],
    employees: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DIVISIONS: (state, { payload }) => ({
      ...state,
      divisions: payload.parsePayload,
    }),
    SET_EMPLOYEES: (state, { payload }) => ({
      ...state,
      employees: payload.parsePayload?.map(i=> ({
        ...i,
        name: i?.fullName
      })),
    }),
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
    *GET_DIVISIONS({ payload }, saga) {
      try {
        const response = yield saga.call(categories.getDivisions, payload);
        yield saga.put({
          type: 'SET_DIVISIONS',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_EMPLOYEES({ payload }, saga) {
      try {
        const response = yield saga.call(categories.getEmployees, payload);
        yield saga.put({
          type: 'SET_EMPLOYEES',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
  },
  subscriptions: {},
};
