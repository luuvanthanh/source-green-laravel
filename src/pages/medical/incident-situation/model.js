import * as categories from '@/services/categories';
  import * as services from './services';
  
  export default {
    namespace: 'medicalIncidentSituation',
    state: {
      data: [],
      pagination: {
        total: 0,
      },
      error: {
        isError: false,
        data: {},
      },
      branches: [],
      classes: [],
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
      SET_BRACHES: (state, { payload }) => ({
        ...state,
        branches: payload.parsePayload,
      }),
      SET_CLASSES: (state, { payload }) => ({
        ...state,
        classes: payload.items,
      }),
    },
    effects: {
      *GET_DATA({ payload }, saga) {
        try {
          const response = yield saga.call(services.get, payload);
          yield saga.put({
            type: 'SET_DATA',
            payload: {
              parsePayload: response.items,
              pagination: {
                total: response.totalCount,
              },
            },
          });
        } catch (error) {
          yield saga.put({
            type: 'SET_ERROR',
            payload: error.data,
          });
        }
      },
      *GET_BRACHES({ payload }, saga) {
        try {
          const response = yield saga.call(categories.getBranches, payload);
          yield saga.put({
            type: 'SET_BRACHES',
            payload: response,
          });
        } catch (error) {
          yield saga.put({
            type: 'SET_ERROR',
            payload: error.data,
          });
        }
      },
      *GET_CLASSES({ payload }, saga) {
        try {
          const response = yield saga.call(categories.getClasses, payload);
          yield saga.put({
            type: 'SET_CLASSES',
            payload: response,
          });
        } catch (error) {
          yield saga.put({
            type: 'SET_ERROR',
            payload: error.data,
          });
        }
      },
      *RECEIVED({ payload, callback }, saga) {
        try {
          yield saga.call(services.received, payload);
          callback(payload);
        } catch (error) {
          callback(null, error);
        }
      },
    },
    subscriptions: {},
  };