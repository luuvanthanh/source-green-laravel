import * as services from './services';
import variablesModules from '../variables';

export default {
  namespace: 'overView',
  state: {
    notes: [],
    detailsNote: {},
    medicals: [],
    detailsMedical: {},
    medicalsStudent: [],
    bus: {},
    listBusByStatus: {
      data: [],
      pagination: {},
    },
    attendances: [],
    listAttendancesByStatus: {
      data: [],
      pagination: {},
    },
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA_NOTE: (state, { payload }) => ({
      ...state,
      notes: payload.parsePayload,
    }),
    SET_DATA_DETAILS_NOTE: (state, { payload }) => ({
      ...state,
      detailsNote: payload,
    }),
    SET_DATA_MEDICAL: (state, { payload }) => ({
      ...state,
      medicals: payload.parsePayload,
    }),
    SET_DATA_DETAILS_MEDICAL: (state, { payload }) => ({
      ...state,
      detailsMedical: payload,
    }),
    SET_LIST_MEDICAL_BY_STUDENT: (state, { payload }) => ({
      ...state,
      medicalsStudent: payload,
    }),
    SET_DATA_BUS: (state, { payload }) => ({
      ...state,
      bus: {
        ...state.bus,
        ...payload
      },
    }),
    SET_DATA_BUS_BY_STATUS: (state, { payload }) => ({
      ...state,
      listBusByStatus: {
        data: payload.parsePayload,
        pagination: payload.pagination,
      },
    }),
    SET_DATA_ATTENDANCE: (state, { payload }) => ({
      ...state,
      attendances:
        variablesModules.DATA_ATTENDANCE.map((item) => ({
          ...item,
          number: payload[item.id] || 0,
        })) || payload,
    }),
    SET_DATA_ATTENDANCE_BY_STATUS: (state, { payload }) => ({
      ...state,
      listAttendancesByStatus: {
        data: payload.parsePayload,
        pagination: payload.pagination,
      },
    }),
  },
  effects: {
    *GET_DATA_NOTE({ payload }, saga) {
      try {
        const response = yield saga.call(services.getNote, payload);
        yield saga.put({
          type: 'SET_DATA_NOTE',
          payload: {
            parsePayload: response.items,
          },
        });
      } catch (error) {
        // continue regardless of error
      }
    },
    *GET_DETAILS_NOTE({ payload }, saga) {
      try {
        const response = yield saga.call(services.detailsNote, payload);
        yield saga.put({
          type: 'SET_DATA_DETAILS_NOTE',
          payload: response,
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
            parsePayload: response.items,
          },
        });
      } catch (error) {
        // continue regardless of error
      }
    },
    *GET_DETAILS_MEDICAL({ payload }, saga) {
      try {
        const response = yield saga.call(services.detailsMedical, payload);
        yield saga.put({
          type: 'SET_DATA_DETAILS_MEDICAL',
          payload: response,
        });
      } catch (error) {
        // continue regardless of error
      }
    },
    *GET_LIST_MEDICAL_BY_STUDENT({ payload }, saga) {
      try {
        const response = yield saga.call(services.listMedicalbyStudent, payload);
        yield saga.put({
          type: 'SET_LIST_MEDICAL_BY_STUDENT',
          payload: response,
        });
      } catch (error) {
        // continue regardless of error
      }
    },
    *GET_DATA_BUS({ payload }, saga) {
      try {
        let response = null;
        if (payload?.Status === variablesModules.TITLE_BUS.SCHOOL.status || payload.Status === variablesModules.TITLE_BUS.HOME.status) {
          response = yield saga.call(services.getBusByStatusHomeWardSchoolWard, payload);
          if (payload?.Status === variablesModules.TITLE_BUS.SCHOOL.status) {
            response = {
              schoolGetInStatusTotal: response?.summary?.schoolGetInStatusTotal || 0,
              schoolGetOffStatusTotal: response?.summary?.schoolGetOffStatusTotal || 0
            };
          } else {
            response = {
              homeGetInStatusTotal: response?.summary?.homeGetInStatusTotal || 0,
              homeGetOffStatusTotal: response?.summary?.homeGetOffStatusTotal || 0
            };
          }
        } else {
          response = yield saga.call(services.getBusByStatus, payload);
          if (!payload?.Status) {
            response = {
              studentTotal: response?.totalCount || 0
            };
          } else {
            response = {
              absentStudentTotal: response?.totalCount || 0
            };
          }
        }
        if (response) {
          yield saga.put({
            type: 'SET_DATA_BUS',
            payload: response
          });
        }
      } catch (error) {
        // continue regardless of error
      }
    },
    *GET_DATA_BUS_BY_STATUS({ payload }, saga) {
      try {
        let response = null;
        if (payload?.Status === variablesModules.TITLE_BUS.SCHOOL.status || payload.Status === variablesModules.TITLE_BUS.HOME.status) {
          response = yield saga.call(services.getBusByStatusHomeWardSchoolWard, payload);
        } else {
          response = yield saga.call(services.getBusByStatus, payload);
        }
        if (response) {
          yield saga.put({
            type: 'SET_DATA_BUS_BY_STATUS',
            payload: {
              parsePayload: response?.items,
              pagination: {
                total: response?.totalCount || 0,
              },
            },
          });
        }
      } catch (error) {
        // continue regardless of error
      }
    },
    *GET_DATA_ATTENDANCE({ payload }, saga) {
      try {
        const response = yield saga.call(services.getAttendance, payload);
        yield saga.put({
          type: 'SET_DATA_ATTENDANCE',
          payload: response.payload,
        });
      } catch (error) {
        // continue regardless of error
      }
    },
    *GET_DATA_ATTENDANCE_BY_STATUS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getAttendanceByStatus, payload);
        yield saga.put({
          type: 'SET_DATA_ATTENDANCE_BY_STATUS',
          payload: response,
        });
      } catch (error) {
        // continue regardless of error
      }
    },
  },
  subscriptions: {},
};
