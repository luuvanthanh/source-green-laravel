import * as categories from '@/services/categories';
  import * as services from './services';
  
  export default {
    namespace: 'HRMWorkingSeniority',
    state: {
      data: [],
      divisions: [],
      employees: [],
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
        data: Object.entries(payload?.payload?.data)?.map(i => 
          ({
            ...i[1],
          })),
          pagination: payload?.payload
       }),
      SET_DIVISIONS: (state, { payload }) => ({
        ...state,
        divisions: payload.parsePayload,
      }),
      SET_EMPLOYEES: (state, { payload }) => ({
        ...state,
        employees: payload.parsePayload,
      }),
      SET_BRANCHES: (state, { payload }) => ({
        ...state,
        branches: payload.parsePayload,
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
    },
    effects: {
      *GET_DATA({ payload }, saga) {
        try {
          const response = yield saga.call(services.get, payload);
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
      *GET_DIVISIONS({ payload }, saga) {
        try {
          const response = yield saga.call(services.getDivisions, payload);
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
      *GET_BRANCHES({ payload }, saga) {
        try {
          const response = yield saga.call(categories.getBranches, payload);
          yield saga.put({
            type: 'SET_BRANCHES',
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
  