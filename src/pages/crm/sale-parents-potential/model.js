import * as services from './services';

export default {
  namespace: 'crmSaleParentsPotential',
  state: {
    data: [],
    city: [],
    district: [],
    tags: [],
    branch: [],
    lead: [],
    searchSource: [],
    employees: [],
    potential: [],
    pagination: {
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
      pagination: payload.pagination,
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
    SET_TAGS: (state, { payload }) => ({
      ...state,
      tags: payload.parsePayload,
    }),
    SET_STATUS_LEAD: (state, { payload }) => ({
      ...state,
      lead: payload.parsePayload,
    }),
    SET_EMPLOYEES: (state, { payload }) => ({
      ...state,
      employees: payload.parsePayload,
    }),
    SET_SEARCH: (state, { payload }) => ({
      ...state,
      searchSource: payload.parsePayload,
    }),
    SET_BRANCH: (state, { payload }) => ({
      ...state,
      branch: payload.parsePayload,
    }),
    SET_POTENTIAL: (state, { payload }) => ({
      ...state,
      potential: payload.parsePayload,
    }),
  },
  effects: {
    *GET_DATA({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        callback(response);
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
    *ADD({ payload, callback }, saga) {
      try {
        yield saga.call(services.add, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *GET_TAGS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getTags, payload);
        yield saga.put({
          type: 'SET_TAGS',
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
    *GET_EMPLOYEES({ payload }, saga) {
      try {
        const response = yield saga.call(services.getEmployees, payload);
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
    *GET_BRANCH({ payload }, saga) {
      try {
        const response = yield saga.call(services.getBranch, payload);
        yield saga.put({
          type: 'SET_BRANCH',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_POTENTIAL({ payload }, saga) {
      try {
        const response = yield saga.call(services.getPotential, payload);
        yield saga.put({
          type: 'SET_POTENTIAL',
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
