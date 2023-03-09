import * as categories from '@/services/categories';
import { v4 as uuidv4 } from 'uuid';

import * as services from './services';

export default {
  namespace: 'teachingToolsStudent',
  state: {
    years: [],
    assessmentPeriod: [],
    pagination: {
      total: 0,
    },
    branches: [],
    detail: {},
    classes: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      pagination: payload.pagination,
    }),
    SET_BRANCHES: (state, { payload }) => ({
      ...state,
      branches: payload.parsePayload,
    }),
    SET_CLASSES: (state, { payload }) => ({
      ...state,
      classes: payload.items,
    }),
    SET_DETAIL: (state, { payload }) => ({
      ...state,
      detail: {
        ...payload,
        studentHasSensitivePeriodDetailGroupSensitivePeriods: payload?.studentHasSensitivePeriodDetailGroupSensitivePeriods?.map(
          (item) => ({
            ...item,
            studentHasSensitivePeriodDetails: item?.studentHasSensitivePeriodDetails?.map(
              (itemChild) => ({
                ...itemChild,
                id: uuidv4(),
                children: itemChild.reviewJson?.map((itemChildReview) => ({
                  id: uuidv4(),
                  ...itemChildReview,
                })),
              }),
            ),
          }),
        ),
      },
    }),
    SET_YEARS: (state, { payload }) => ({
      ...state,
      years:
        payload.parsePayload?.map((item) => ({
          id: item.id,
          name: `Năm học  ${item.yearFrom} - ${item.yearTo}`,
          ...item,
        })) || [],
    }),
    SET_ASESSMENT_PERIOD: (state, { payload }) => ({
      ...state,
      assessmentPeriod: payload,
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
    *GET_NO_SENDING({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getNoSending, payload);
        callback(response);
        yield saga.put({
          type: 'SET_DATA',
          payload: {
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
    *GET_SENDING({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getSending, payload);
        callback(response);
        yield saga.put({
          type: 'SET_DATA',
          payload: {
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
    *ADD({ payload, callback }, saga) {
      try {
        yield saga.call(services.add, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
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
    *GET_ASESSMENT_PERIOD({ payload }, saga) {
      try {
        const response = yield saga.call(services.getAssessmentPeriod, payload);
        yield saga.put({
          type: 'SET_ASESSMENT_PERIOD',
          payload: response.items,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_DETAIL({ payload }, saga) {
      try {
        const response = yield saga.call(services.getDetail, payload);
        yield saga.put({
          type: 'SET_DETAIL',
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
