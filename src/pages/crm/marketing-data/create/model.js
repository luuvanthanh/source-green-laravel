import * as services from './services';

export default {
  namespace: 'crmMarketingDataAdd',
  state: {
    details: {},
    detailsLead: {},
    error: {
      isError: false,
      data: {},
    },
    city: [],
    district: [],
    search: [],
    student: [],
    lead: [],
    parentLead: [],
    data: [],
    program: [],
    programs: [],
    relationships: [],
  },
  reducers: {
    INIT_STATE: (state) => ({
      ...state,
      detailsLead: {},
      isError: false,
      data: [],
      events: [],
    }),
    SET_DETAILS: (state, { payload }) => ({
      ...state,
      details: payload.parsePayload,
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
    SET_SEARCH: (state, { payload }) => ({
      ...state,
      search: payload.parsePayload,
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
    SET_PROGRAM: (state, { payload }) => ({
      ...state,
      program: payload.parsePayload,
    }),
    SET_DATA_PROGRAM: (state, { payload }) => ({
      ...state,
      programs:
        payload?.parsePayload?.marketingProgram?.map((item, index) => ({ ...item, index })) || [],
    }),
    SET_RELATIONSHIPS: (state, { payload }) => ({
      ...state,
      relationships: payload.parsePayload,
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
    *GET_SEARCH({ payload }, saga) {
      try {
        const response = yield saga.call(services.getSearch, payload);
        yield saga.put({
          type: 'SET_SEARCH',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *ADD_PROGRAM({ payload, callback }, saga) {
      try {
        yield saga.call(services.addProgram, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *GET_PROGRAM({ payload }, saga) {
      try {
        const response = yield saga.call(services.getProgram, payload);
        yield saga.put({
          type: 'SET_PROGRAM',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_DATA_PROGRAM({ payload }, saga) {
      try {
        const response = yield saga.call(services.getDataProgram, payload);
        yield saga.put({
          type: 'SET_DATA_PROGRAM',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *REMOVE_PROGRAM({ payload, callback }, saga) {
      try {
        yield saga.call(services.deleteProgram, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *GET_RELATIONSHIPS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getRelationships, payload);
        yield saga.put({
          type: 'SET_RELATIONSHIPS',
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
};
