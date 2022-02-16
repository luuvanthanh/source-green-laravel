import * as categories from '@/services/categories';
import * as services from './services';

export default {
  namespace: 'HRMReportEmployeeOnLeave',
  state: {
    data: [],
    divisions: [],
    positions: [],
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
      data: Object.keys(payload.data).map((key) => ({
        id: key,
        name: key,
        children:
          payload?.data[key]?.divisionName &&
          Object.keys(payload?.data[key]?.divisionName).map((keyParent) => ({
            key: `${key}-${keyParent}`,
            name: keyParent,
            children:
              payload?.data[key]?.divisionName[keyParent]?.absent &&
              Object.keys(payload?.data[key]?.divisionName[keyParent]?.absent).map(
                (keyProduct) => ({
                  key: `${key}-${keyParent}-${keyProduct}`,
                  name: keyProduct,
                  ...(payload?.data[key]?.divisionName[keyParent]?.absent[keyProduct] || {}),
                }),
              ),
          })),
      })),
      pagination: payload.pagination,
    }),
    SET_DIVISIONS: (state, { payload }) => ({
      ...state,
      divisions: payload.parsePayload,
    }),
    SET_POSITIONS: (state, { payload }) => ({
      ...state,
      positions: payload.parsePayload,
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
        yield saga.put({
          type: 'SET_DATA',
          payload: response.payload,
        });
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
    *GET_POSITIONS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getPositions, payload);
        yield saga.put({
          type: 'SET_POSITIONS',
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
