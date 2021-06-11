import * as services from './services';

export default {
  namespace: 'scheduleStudents',
  state: {
    data: [],
    pagination: {},
    isError: false,
    error: {
      isError: false,
      data: {},
    },
    category: {
      shifts: [],
    },
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: payload.parsePayload,
      pagination: payload.pagination,
      error: {
        isError: false,
        data: {},
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
    SET_DATA_CATEGORY: (state, { payload }) => ({
      ...state,
      category: {
        shifts: payload.shifts?.parsePayload || [],
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
        });
      }
    },
    *GET_CATEGORY({ callback }, saga) {
      try {
        const response = yield saga.all({
          shifts: saga.call(services.getShifts),
        });
        if (response) {
          yield saga.put({
            type: 'SET_DATA_CATEGORY',
            payload: response,
          });
          callback(response);
        }
      } catch (error) {
        callback(error);
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *ADD({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.addSchedulesDetail, payload);
        if (response) {
          const response = yield saga.call(services.get, payload);
          if (response) {
            yield saga.put({
              type: 'SET_DATA',
              payload: response,
            });
          }
        }
        callback(response);
      } catch (error) {
        callback(null, error);
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *REMOVE({ payload }, saga) {
      try {
        yield saga.call(services.removeSchedulesDetail, payload);
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
        });
      }
    },
    *REMOVE_ONLY({ payload }, saga) {
      try {
        yield saga.call(services.removeSchedulesDetail, payload);
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
        });
      }
    },
  },
  subscriptions: {},
};
