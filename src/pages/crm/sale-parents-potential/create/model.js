import * as services from './services';

export default {
  namespace: 'crmSaleParentsPotentialAdd',
  state: {
    details: {},
    detailsLead: {},
    detailsTags: [],
    detailsReferences: [],
    error: {
      isError: false,
      data: {},
    },
    classTypes: [],
    sensitivePeriods: [],
    parents: [],
    employees: [],
    branches: [],
    classes: [],
    city: [],
    district: [],
    student: [],
    lead: [],
    parentLead: [],
  },
  reducers: {
    INIT_STATE: (state) => ({
      ...state,
      detailsLead: {},
      isError: false,
      data: [],
    }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      details: payload,
      detailsTags: payload,
    }),
    SET_DETAILS: (state, { payload }) => ({
      ...state,
      details: payload.parsePayload,
      error: {
        status: null,
        isError: false,
      },
    }),
    SET_STUDENT: (state, { payload }) => ({
      ...state,
      details: payload.parsePayload,
      error: {
        status: null,
        isError: false,
      },
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
    SET_CITIES: (state, { payload }) => ({
      ...state,
      city: payload.parsePayload,
    }),
    SET_DISTRICTS: (state, { payload }) => ({
      ...state,
      district: payload.parsePayload,
    }),
    SET_STUDENTS: (state, { payload }) => ({
      ...state,
      student: payload.parsePayload,
    }),
    SET_STATUS_LEAD: (state, { payload }) => ({
      ...state,
      detailsLead: payload,
      lead: payload.parsePayload,
    }),
    SET_PARENT_LEAD: (state, { payload }) => ({
      ...state,
      parentLead: payload.parsePayload,
    }),
  },
  effects: {
    *GET_STUDENTS({ payload, callback }, saga) {
      try {
        yield saga.put({
          type: 'INIT_STATE',
        });
        const response = yield saga.call(services.getStudent, payload);
        callback(response);
        yield saga.put({
          type: 'SET_STUDENTS',
          payload: response,
        });
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
    *ADD_STUDENTS({ payload, callback }, saga) {
      try {
        yield saga.call(services.addStudents, payload);
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
    *UPDATE_STATUS({ payload, callback }, saga) {
      try {
        yield saga.call(services.updateStatus, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *GET_DETAILS({ payload }, saga) {
      try {
        yield saga.put({
          type: 'INIT_STATE',
        });
        const response = yield saga.call(services.details, payload);
        yield saga.put({
          type: 'SET_DETAILS',
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
    *GET_STATUS_LEAD({ payload }, saga) {
      try {
        yield saga.put({
          type: 'INIT_STATE',
        });
        const response = yield saga.call(services.getStatusLead, payload);
        yield saga.put({
          type: 'SET_STATUS_LEAD',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_PARENT_LEAD({ payload }, saga) {
      try {
        const response = yield saga.call(services.getParentLead, payload);
        yield saga.put({
          type: 'SET_PARENT_LEAD',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *ADD_STATUS_LEAD({ payload, callback }, saga) {
      try {
        yield saga.call(services.addStatusLead, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
  },
};
