import * as services from './services';

export default {
  namespace: 'crmSaleAdmissionAdd',
  state: {
    details: {},
    customerLead: [],
    studentsLead: [],
    writtenConsent: [],
    error: {
      isError: false,
      data: {},
    },
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_ERROR: (state, { payload }) => ({
      ...state,
      error: {
        isError: true,
        data: {
          ...payload,
        },
      },
    }),
    SET_DETAILS: (state, { payload }) => ({
      ...state,
      details: payload,
    }),
    SET_CUSTOMER_LEAD: (state, { payload }) => ({
      ...state,
      customerLead: payload.parsePayload,
    }),
    SET_STUDENTS_LEAD: (state, { payload }) => ({
      ...state,
      studentsLead: payload.parsePayload,
    }),
    SET_WRITTEN_CONSENT: (state, { payload }) => ({
      ...state,
      writtenConsent: payload.parsePayload,
    }),
  },
  effects: {
    // *GET_DETAILS({ payload }, saga) {
    //   try {
    //     const response = yield saga.call(services.details, payload);
    //     if (response) {
    //       yield saga.put({
    //         type: 'SET_DETAILS',
    //         payload: response.parsePayload,
    //       });
    //     }
    //   } catch (error) {
    //     yield saga.put({
    //       type: 'SET_ERROR',
    //       payload: error.data,
    //     });
    //   }
    // },
    *ADD({ payload, callback }, saga) {
      try {
        yield saga.call(services.add, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    // *UPDATE({ payload, callback }, saga) {
    //   try {
    //     yield saga.call(services.update, payload);
    //     callback(payload);
    //   } catch (error) {
    //     callback(null, error);
    //   }
    // },
    // *REMOVE({ payload, callback }, saga) {
    //   try {
    //     yield saga.call(services.remove, payload.id);
    //     callback(payload);
    //   } catch (error) {
    //     callback(null, error);
    //   }
    // },
    *GET_CUSTOMER_LEAD({ payload }, saga) {
      try {
        const response = yield saga.call(services.getCustomerLead, payload);
        yield saga.put({
          type: 'SET_CUSTOMER_LEAD',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_STUDENTS_LEAD({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getStudentsLead, payload);
        callback(response);
        yield saga.put({
          type: 'SET_STUDENTS_LEAD',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *ADD_WRITTEN_CONSENT({ payload, callback }, saga) {
      try {
        yield saga.call(services.addWrittenConsent, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_WRITTEN_CONSENT({ payload, callback }, saga) {
      try {
        yield saga.put({
          type: 'INIT_STATE',
        });
        const response = yield saga.call(services.getWrittenConsent, payload);
        callback(response);
        yield saga.put({
          type: 'SET_WRITTEN_CONSENT',
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
