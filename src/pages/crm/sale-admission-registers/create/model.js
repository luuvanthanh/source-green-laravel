import * as services from './services';

export default {
  namespace: 'crmSaleAdmissionAdd',
  state: {
    details: {},
    customerLead: [],
    studentsLead: [],
    writtenConsent: [],
    employees: [],
    testInputs: [],
    students: {},
    city: [],
    district: [],
    parents: [],
    student: [],
    error: {
      isError: false,
      data: {},
    },
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
    SET_CUSTOMER_LEAD: (state, { payload }) => ({
      ...state,
      customerLead: payload.parsePayload,
    }),
    SET_STUDENTS_LEAD: (state, { payload }) => ({
      ...state,
      studentsLead: payload.parsePayload,
    }),
    SET_GET_PARENTS: (state, { payload }) => ({
      ...state,
      parents: payload.parsePayload,
    }),
    SET_CITIES: (state, { payload }) => ({
      ...state,
      city: payload.parsePayload,
    }),
    SET_DISTRICTS: (state, { payload }) => ({
      ...state,
      district: payload.parsePayload,
    }),
    SET_WRITTEN_CONSENT: (state, { payload }) => ({
      ...state,
      writtenConsent: payload.parsePayload,
    }),
    SET_STUDENTS: (state, { payload }) => ({
      ...state,
      students: payload,
    }),
    SET_EMPLOYEES: (state, { payload }) => ({
      ...state,
      employees: payload.parsePayload,
    }),
    SET_TEST_INPUT: (state, { payload }) => ({
      ...state,
      details: payload.parsePayload,
      testInputs: payload.parsePayload,
    }),
  },
  effects: {
    *GET_DETAILS({ payload }, saga) {
      try {
        const response = yield saga.call(services.details, payload);
        if (response) {
          yield saga.put({
            type: 'SET_DETAILS',
            payload: response.parsePayload,
          });
        }
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
        callback(null, error);
      }
    },
    *GET_CUSTOMER_LEAD({ payload }, saga) {
      try {
        const response = yield saga.call(services.getCustomerLead, payload);
        yield saga.put({
          type: 'SET_CUSTOMER_LEAD',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_STUDENTS_LEAD({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getStudentsLead, payload);
        callback(response);
        yield saga.put({
          type: 'SET_STUDENTS_LEAD',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_PARENTS({ payload, callback }, saga) {
      try {
        yield saga.put({
          type: 'INIT_STATE',
        });
        const response = yield saga.call(services.getParents, payload);
        callback(response);
        yield saga.put({
          type: 'SET_GET_PARENTS',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_DISTRICTS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getDistricts, payload);
        yield saga.put({
          type: 'SET_DISTRICTS',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_CITIES({ payload }, saga) {
      try {
        const response = yield saga.call(services.getCities, payload);
        yield saga.put({
          type: 'SET_CITIES',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *ADD_PARENTS({ payload, callback }, saga) {
      try {
        yield saga.call(services.addParents, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *ADD_WRITTEN_CONSENT({ payload, callback }, saga) {
      try {
        yield saga.call(services.addWrittenConsent, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_WRITTEN_CONSENT({ payload, callback }, saga) {
      try {
        yield saga.put({
          type: 'INIT_STATE',
        });
        const response = yield saga.call(services.getWrittenConsent, payload);
        callback(response);
        yield saga.put({
          type: 'SET_WRITTEN_CONSENT',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *UPDATE_STUDENTS({ payload, callback }, saga) {
      try {
        yield saga.call(services.updateStudents, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *GET_EMPLOYEES({ payload }, saga) {
      try {
        const response = yield saga.call(services.getEmloyees, payload);
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
    *ADD_TEST_INPUT({ payload, callback }, saga) {
      try {
        yield saga.call(services.addTestInput, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_TEST_INPUT({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getTestInputs, payload);
        callback(response);
        yield saga.put({
          type: 'SET_TEST_INPUT',
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
