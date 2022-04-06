import * as services from './services';

export default {
  namespace: 'crmFBDevV1',
  state: {
    data: [],
    tags: [],
    pagination: {
      total: 0,
    },
    error: {
      isError: false,
      data: {},
    },
    user: {
      accessToken:
        'EAAM8onYIpqUBAD15XPZAeHHnSHmfzxxyYDuENZBF6xSAN2bK8ZAEWx9eZANEFe4xk33iWwrII0MzNIZCfDtuwyosa210dOe314MCbampmw5VPC61tBp5q4mNKZAVUdFxeiFZBvlpVIfoWRVKLCDKFtxb4PGLDpWKqMSDHGDBGm6iRVEX3jRhuFKhZBSh4LdjFldoR1zoO4fOOvYBrnLKl6iBd6TYJz3aFwqZBkAXdITFntGlToISOXak8EtDpZAebHfooZD',
      userID: '2973416992874415',
    },
    pages: [],
    users: [],
    relationships: [],
    detailLead: [],
    employeeFB: [],
    conversationsId: [],
    detailPotential: [],
    token: {},
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: payload.parsePayload,
      pagination: payload.pagination,
    }),
    SET_USER: (state, { payload }) => ({
      ...state,
      user: payload,
    }),
    SET_PAGES: (state, { payload }) => ({
      ...state,
      pages: payload.data,
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
    SET_TAGS: (state, { payload }) => ({
      ...state,
      tags: payload.parsePayload,
    }),
    SET_CONVERSATIONS: (state, { payload }) => ({
      ...state,
      users: payload.parsePayload,
    }),
    SET_RELATIONSHIPS: (state, { payload }) => ({
      ...state,
      relationships: payload.parsePayload,
    }),
    SET_LEAD: (state, { payload }) => ({
      ...state,
      detailLead: payload.parsePayload,
    }),
    SET_EMPLOYEE_FACEBOOK: (state, { payload }) => ({
      ...state,
      employeeFB: payload.parsePayload,
    }),
    SET_CONVERSATIONS_ID: (state, { payload }) => ({
      ...state,
      conversationsId: payload.parsePayload,
    }),
    SET_POTENTIAL: (state, { payload }) => ({
      ...state,
      detailPotential: payload.parsePayload,
    }),
    SET_USER_TOKEN: (state, { payload }) => ({
      ...state,
      token: payload,
    }),
  },
  effects: {
    *GET_USER({ payload }, { put }) {
      try {
        yield put({
          type: 'SET_USER',
          payload,
        });
      } catch (error) {
        yield put({
          type: 'SET_ERROR',
        });
      }
    },
    *GET_USER_TOKEN({ payload }, saga) {
      try {
        const response = yield saga.call(services.getToket, payload);
        if (response) {
          yield saga.put({
            type: 'SET_USER_TOKEN',
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
    *GET_PAGES({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getPages, payload);
        yield saga.put({
          type: 'SET_PAGES',
          payload: response,
        });
        callback(response);
      } catch (error) {
        callback(null, error);
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_CONVERSATIONS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getConversations, payload);
        yield saga.put({
          type: 'SET_CONVERSATIONS',
          payload: response,
        });
        callback(response);
      } catch (error) {
        callback(null, error);
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_CONVERSATIONSCALL({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getConversationsCall, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_MESSAGES({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getMessages, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
    *SEND_MESSAGES({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.sendMessages, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
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
    *ADD_CONVERSATIONS({ payload, callback }, saga) {
      try {
        yield saga.call(services.addConversations, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },

    *ADD_EMPLOYEE({ payload, callback }, saga) {
      try {
        yield saga.call(services.addEmployee, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *GET_PAGESDB({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getPagesDb, payload);
        yield saga.put({
          type: 'SET_PAGESDB',
          payload: response,
        });
        callback(response);
      } catch (error) {
        callback(null, error);
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_TAGS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getTags, payload);
        yield saga.put({
          type: 'SET_TAGS',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *ADD_TAGS({ payload, callback }, saga) {
      try {
        yield saga.call(services.addTags, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *GET_CONVERSATIONSID({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getConversationsId, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_CONVERSATIONS_ID({ payload,callback }, saga) {
      try {
        const response = yield saga.call(services.getConversationsId, payload);
        callback(response);
        yield saga.put({
          type: 'SET_CONVERSATIONS_ID',
          payload: response,
        });
      } catch (error) {
        callback(null, error);
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *UPDATE_NOTE({ payload, callback }, saga) {
      try {
        yield saga.call(services.updateNote, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *GET_RELATIONSHIPS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getRelationships, payload);
        yield saga.put({
          type: 'SET_RELATIONSHIPS',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *ADD_LEAD({ payload, callback }, saga) {
      try {
        yield saga.call(services.addLead, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *GET_LEAD({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.detailsLead, payload);
        callback(response);
        yield saga.put({
          type: 'SET_LEAD',
          payload: response,
        });
      } catch (error) {
        callback(null, error);
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_EMPLOYEE_FACEBOOK({ payload }, saga) {
      try {
        const response = yield saga.call(services.getEmployeeFB, payload);
        yield saga.put({
          type: 'SET_EMPLOYEE_FACEBOOK',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *ADD_EMPLOYEE_FACEBOOK({ payload, callback }, saga) {
      try {
        yield saga.call(services.addEmployeeFB, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *DELETE_EMPLOYEE_FACEBOOK({ payload, callback }, saga) {
      try {
        yield saga.call(services.DeleteEmployeeFb, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_POTENTIAL({ payload }, saga) {
      try {
        const response = yield saga.call(services.getPotential, payload);
        yield saga.put({
          type: 'SET_POTENTIAL',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_TOKEN({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getToken, payload);
        callback(payload);
        yield saga.put({
          type: 'SET_TOKEN',
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
