import * as categories from '@/services/categories';
import * as services from './services';

export default {
  namespace: 'medicalIncidentSituation',
  state: {
    data: [],
    years: [],
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
      data: payload.parsePayload.map((key) => ({
        branch: key?.branch || {},
        children: key?.studentMedicalProblemGroupByClasses.map((item) => ({
          id: item?.class?.id || '',
          class: item?.class || '',
          children: item?.studentMedicalProblems.map((i) => ({
            ...i,
            branch: key?.branch || {},
            class: item?.class || '',
          })),
        })),
      })),
      pagination: payload.pagination,
    }),
    SET_YEARS: (state, { payload }) => ({
      ...state,
      years: payload.parsePayload?.map((item) => ({
        id: item.id,
        name: `Năm học  ${item.yearFrom} - ${item.yearTo}`,
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
    *GET_DATA({ payload }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        yield saga.put({
          type: 'SET_DATA',
          payload: {
            parsePayload: response,
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
  },
  subscriptions: {},
};
