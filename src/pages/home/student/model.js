import * as services from './services';

export default {
  namespace: 'studentHomePage',
  state: {
    students: [],
    detailsStudent: {},
    bus: [],
    childrensInClass: [],
    health: {
      everyDay: [],
      history: [],
    },
    criteriaGroupProperties: [],
    notes: [],
    paginationNote: {},
    medicals: [],
    paginationMedical: {}
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA_STUDENT: (state, { payload }) => ({
      ...state,
      students: payload.parsePayload,
    }),
    SET_DATA_DETAIL_STUDENT: (state, { payload }) => ({
      ...state,
      detailsStudent: payload,

    }),
    SET_DATA_BUS: (state, { payload }) => ({
      ...state,
      bus: payload.parsePayload,
    }),
    SET_DATA_CHILD_IN_CLASS: (state, { payload }) => ({
      ...state,
      childrensInClass: payload.parsePayload,
    }),
    SET_DATA_HEALTH_EVERY_DATE: (state, { payload }) => ({
      ...state,
      health: {
        ...state.health,
        everyDay: payload.parsePayload,
      }
    }),
    SET_DATA_HEALTH_HISTORY: (state, { payload }) => ({
      ...state,
      health: {
        ...state.health,
        history: payload.parsePayload,
      }
    }),
    SET_CRITERIA_GROUP_PROPERTIES: (state, { payload }) => ({
      ...state,
      criteriaGroupProperties: payload.items,
    }),
    SET_DATA_NOTE: (state, { payload }) => ({
      ...state,
      notes: payload.parsePayload,
      paginationNote: payload.pagination,
    }),
    SET_DATA_MEDICAL: (state, { payload }) => ({
      ...state,
      medicals: payload.parsePayload,
      paginationMedical: payload.pagination,
    }),
  },
  effects: {
    *GET_DATA_STUDENT({ payload }, saga) {
      try {
        const response = yield saga.call(services.getStudent, payload);
        yield saga.put({
          type: 'SET_DATA_STUDENT',
          payload: {
            parsePayload: response.items,
          },
        });
      } catch (error) {
        // continue regardless of error
      }
    },
    *GET_DETAIL_STUDENT({ payload }, saga) {
      try {
        const response = yield saga.call(services.detailsStudent, payload);
        yield saga.put({
          type: 'SET_DATA_DETAIL_STUDENT',
          payload: response,
        });
      } catch (error) {
        // continue regardless of error
      }
    },
    *GET_DATA_BUS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getBusByStudent, payload);
        yield saga.put({
          type: 'SET_DATA_BUS',
          payload: {
            parsePayload: response.items,
          },
        });
      } catch (error) {
        // continue regardless of error
      }
    },
    *GET_DATA_CHILD_IN_CLASS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getChildInClass, payload);
        yield saga.put({
          type: 'SET_DATA_CHILD_IN_CLASS',
          payload: {
            parsePayload: response.items,
          },
        });
      } catch (error) {
        // continue regardless of error
      }
    },
    *GET_DATA_HEALTH_EVERY_DAY({ payload }, saga) {
      try {
        const response = yield saga.call(services.getHealthEveryDay, payload);
        yield saga.put({
          type: 'SET_DATA_HEALTH_EVERY_DATE',
          payload: {
            parsePayload: response.studentCriterias,
          },
        });
      } catch (error) {
        // continue regardless of error
      }
    },
    *GET_DATA_HEALTH_HISTORY({ payload }, saga) {
      try {
        const response = yield saga.call(services.getHealthHistory, payload);
        yield saga.put({
          type: 'SET_DATA_HEALTH_HISTORY',
          payload: {
            parsePayload: response || [],
          },
        });
      } catch (error) {
        // continue regardless of error
      }
    },
    *GET_DATA_HEALTH_CHART({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getHealthChart, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_CRITERIA_GROUP_PROPERTIES({ payload }, saga) {
      try {
        const response = yield saga.call(services.getCriteriaGroupProperties, payload);
        yield saga.put({
          type: 'SET_CRITERIA_GROUP_PROPERTIES',
          payload: response,
        });
      } catch (error) {
        // continue regardless of error
      }
    },
    *GET_DATA_NOTE({ payload }, saga) {
      try {
        const response = yield saga.call(services.getNote, payload);
        yield saga.put({
          type: 'SET_DATA_NOTE',
          payload: {
            parsePayload: response.items,
            pagination: {
              total: response.totalCount || 0,
            },
          },
        });
      } catch (error) {
        // continue regardless of error
      }
    },
    *GET_DATA_MEDICAL({ payload }, saga) {
      try {
        const response = yield saga.call(services.getMedical, payload);
        yield saga.put({
          type: 'SET_DATA_MEDICAL',
          payload: {
            parsePayload: response,
          },
        });
      } catch (error) {
        // continue regardless of error
      }
    },
  },
  subscriptions: {},
};
