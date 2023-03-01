import * as categories from '@/services/categories';
import * as services from './services';

export default {
  namespace: 'physicalPeriodicMeasurement',
  state: {
    data: [],
    years: [],
    pagination: {
      total: 0,
    },
    branches: [],
    classes: [],
    period: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: payload.items,
      pagination: {
        total: payload.totalCount,
      },
    }),
    SET_BRANCHES: (state, { payload }) => ({
      ...state,
      branches: payload.parsePayload,
    }),
    SET_CLASSES: (state, { payload }) => ({
      ...state,
      classes: payload.items,
    }),
    SET_PERIOD: (state, { payload }) => ({
      ...state,
      period: payload.parsePayload?.map((i) => ({
        ...i,
        name: i?.nameAssessmentPeriod?.name,
      })),
    }),
    SET_YEARS: (state, { payload }) => ({
      ...state,
      years:
        payload.parsePayload?.map((item) => ({
          id: item.id,
          name: `${item.yearFrom} - ${item.yearTo}`,
          ...item,
        })) || [],
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
    *GET_BRANCHES({ payload, callback }, saga) {
      try {
        const response = yield saga.call(categories.getBranches, payload);
        callback(response);
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
    *GET_TOTAL_DATA({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getTotalData, payload);
        callback(response);
      } catch (error) {
        callback(error);
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_DATA({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        callback(response);
        yield saga.put({
          type: 'SET_DATA',
          payload: response,
        });
      } catch (error) {
        callback(error);
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_DATA_APPROVED({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getApproved, payload);
        callback(response);
        yield saga.put({
          type: 'SET_DATA',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_YEARS({ payload }, saga) {
      try {
        const response = yield saga.call(categories.getYears, payload);
        yield saga.put({
          type: 'SET_YEARS',
          payload: {
            parsePayload: response,
          },
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_PERIOD({ payload }, saga) {
      try {
        const response = yield saga.call(services.getPeriod, payload);
        yield saga.put({
          type: 'SET_PERIOD',
          payload: {
            parsePayload: response.parsePayload,
          },
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *APPROVE({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.approve, payload);
        callback(response);
      } catch (error) {
        callback(null, error?.data);
      }
    },
    *SEND({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.send, payload);
        callback(response);
      } catch (error) {
        callback(null, error?.data);
      }
    },
  },
  subscriptions: {},
};
