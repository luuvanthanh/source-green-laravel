import * as categories from '@/services/categories';
  import * as services from './services';
  
  export default {
    namespace: 'crmMarketingManageAdd',
    state: {
      details: {},
      detailsLead: {},
      detailsTags: [],
      detailsPost: [],
      detailsReferences :[],
      error: {
        isError: false,
        data: {},
      },
      classTypes: [],
      sensitivePeriods: [],
      parents: [],
      employees: [],
      branches: [],
      classes: [],
      city: [],
      district: [],
      student: [],
      lead: [],
      parentLead: [],
      tags: [],
      events: [],
      calendar:[],
      data: [],
      branchess: [],
      posts: [],
      pages: [],
      user: {},
      detailsAddPost: {},
      paginationComment: {
        total: 0,
      },
      paginationLike:{
        total: 0,
      },
    },
    reducers: {
      SET_BRANCHESS: (state, { payload }) => ({
        ...state,
        branchess: payload.parsePayload,
      }),
      INIT_STATE: (state) => ({
        ...state,
        detailsLead: {},
        isError: false,
        data: [],
        events: [],
        calendar: [],
      }),
      SET_DATA: (state, { payload }) => ({
        ...state,
         details: payload.parsePayload,
        calendar: payload.parsePayload,
      }),
      SET_CLASS_TYPES: (state, { payload }) => ({
        ...state,
        classTypes: payload.parsePayload,
      }),
      SET_SENSITIVE_PERIODS: (state, { payload }) => ({
        ...state,
        sensitivePeriods: payload.items,
      }),
      SET_DETAILS: (state, { payload }) => ({
        ...state,
        details: payload.parsePayload,
        error: {
          status: null,
          isError: false,
        },
      }),
      SET_DETAILS_POSTS: (state, { payload }) => ({
        ...state,
        detailsAddPost: payload.parsePayload,
      }),
      SET_STUDENT: (state, { payload }) => ({
        ...state,
        details: payload.parsePayload,
        error: {
          status: null,
          isError: false,
        },
      }),
      SET_PARENTS: (state, { payload }) => ({
        ...state,
        parents: payload.items,
      }),
      SET_EMPLOYEES: (state, { payload }) => ({
        ...state,
        employees: payload.parsePayload,
      }),
      SET_BRANCHES: (state, { payload }) => ({
        ...state,
        branches: payload.parsePayload,
      }),
      SET_CLASSES: (state, { payload }) => ({
        ...state,
        classes: payload.items,
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
      SET_CITIES: (state, { payload }) => ({
        ...state,
        city: payload.parsePayload,
      }),
      SET_DISTRICTS: (state, { payload }) => ({
        ...state,
        district: payload.parsePayload,
      }),
      SET_STUDENTS: (state, { payload }) => ({
        ...state,
        student: payload.parsePayload,
      }),
      SET_STATUS_LEAD: (state, { payload }) => ({
        ...state,
        detailsLead: payload,
        lead: payload.parsePayload,
      }),
      SET_PARENT_LEAD: (state, { payload }) => ({
        ...state,
        parentLead: payload.parsePayload,
      }),
  
      SET_TAGS: (state, { payload }) => ({
        ...state,
        tags: payload.parsePayload,
      }),
      SET_CUSTOMER_TAGS: (state, { payload }) => ({
        ...state,
        detailsTags: payload.parsePayload,
      }),
      SET_EVENTS: (state, { payload }) => ({
        ...state,
        details: payload.parsePayload,
        events: payload.parsePayload,
      }),
      SET_EVENTS_DETAILS: (state, { payload }) => ({
        ...state,
        details: payload.parsePayload,
      }),
      SET_REFERENCES: (state, { payload }) => ({
        ...state,
        detailsReferences: payload.parsePayload,
      }),
      SET_POSTS: (state, { payload }) => ({
        ...state,
        posts: payload.parsePayload?.map(i=> ({
          ...i,
          quantity_share: i?.postFacebookInfo?.reduce((n, {quantity_share}) => n + quantity_share, 0),
          quantity_comment: i?.postFacebookInfo?.reduce((n, {quantity_comment}) => n + quantity_comment, 0),
          quantity_reaction: i?.postFacebookInfo?.reduce((n, {quantity_reaction}) => n + quantity_reaction, 0),
        })),
      }),
      SET_PAGES: (state, { payload }) => ({
        ...state,
        pages: payload.data,
      }),
      SET_USER: (state, { payload }) => ({
        ...state,
        user: payload,
      }),
      SET_POSTS_LIKE: (state, { payload }) => ({
        ...state,
        paginationLike: payload.pagination,
      }),
      SET_POSTS_COMMENT: (state, { payload }) => ({
        ...state,
        paginationComment: payload.pagination,
      }),
    },
    effects: {
      *GET_STUDENTS({ payload, callback }, saga) {
        try {
          yield saga.put({
            type: 'INIT_STATE',
          });
          const response = yield saga.call(services.getStudent, payload);
          callback(response);
          yield saga.put({
            type: 'SET_STUDENTS',
            payload: response,
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
      *GET_DATA_POSTS({ payload, callback }, saga) {
        try {
          const response = yield saga.call(services.getDataPosts, payload);
          callback(response);
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
      *ADD_POSTS({ payload, callback }, saga) {
        try {
          yield saga.call(services.addPosts, payload);
          callback(payload);
        } catch (error) {
          callback(null, error?.data?.error);
        }
      },
      *ADD_STUDENTS({ payload, callback }, saga) {
        try {
          yield saga.call(services.addStudents, payload);
          callback(payload);
        } catch (error) {
          callback(null, error?.data?.error);
        }
      },
  
      *UPDATE({ payload, callback }, saga) {
        try {
          yield saga.call(services.update, payload);
          callback(payload);
        } catch (error) {
          callback(null, error?.data?.error);
        }
      },
      *UPDATE_POSTS({ payload, callback }, saga) {
        try {
          yield saga.call(services.updatePosts, payload);
          callback(payload);
        } catch (error) {
          callback(null, error?.data?.error);
        }
      },
      *UPDATE_STATUS({ payload, callback }, saga) {
        try {
          yield saga.call(services.updateStatus, payload);
          callback(payload);
        } catch (error) {
          callback(null, error?.data?.error);
        }
      },
      *GET_DETAILS({ payload }, saga) {
        try {
          yield saga.put({
            type: 'INIT_STATE',
          });
          const response = yield saga.call(services.details, payload);
          yield saga.put({
            type: 'SET_DETAILS',
            payload: response,
          });
        } catch (error) {
          yield saga.put({
            type: 'SET_ERROR',
            payload: error.data,
          });
        }
      },
      *GET_DETAILS_POSTS({ payload, callback }, saga) {
        try {
          yield saga.put({
            type: 'INIT_STATE',
          });
          const response = yield saga.call(services.detailsPosts, payload);
          callback(response);
          yield saga.put({
            type: 'SET_DETAILS_POSTS',
            payload: response,
          });
        } catch (error) {
          yield saga.put({
            type: 'SET_ERROR',
            payload: error.data,
          });
        }
      },
      *GET_DISTRICTS({ payload }, saga) {
        try {
          const response = yield saga.call(services.getDistricts, payload);
          yield saga.put({
            type: 'SET_DISTRICTS',
            payload: response,
          });
        } catch (error) {
          yield saga.put({
            type: 'SET_ERROR',
            payload: error.data,
          });
        }
      },
      *GET_CITIES({ payload }, saga) {
        try {
          const response = yield saga.call(services.getCities, payload);
          yield saga.put({
            type: 'SET_CITIES',
            payload: response,
          });
        } catch (error) {
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
      *GET_CUSTOMER_TAGS({ payload, callback }, saga) {
        try {
          yield saga.put({
            type: 'INIT_STATE',
          });
          const response = yield saga.call(services.getCustomerTags, payload);
          callback(response);
          yield saga.put({
            type: 'SET_CUSTOMER_TAGS',
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
      *GET_STATUS_LEAD({ payload }, saga) {
        try {
          yield saga.put({
            type: 'INIT_STATE',
          });
          const response = yield saga.call(services.getStatusLead, payload);
          yield saga.put({
            type: 'SET_STATUS_LEAD',
            payload: response,
          });
        } catch (error) {
          yield saga.put({
            type: 'SET_ERROR',
            payload: error.data,
          });
        }
      },
      *GET_PARENT_LEAD({ payload }, saga) {
        try {
          const response = yield saga.call(services.getParentLead, payload);
          yield saga.put({
            type: 'SET_PARENT_LEAD',
            payload: response,
          });
        } catch (error) {
          yield saga.put({
            type: 'SET_ERROR',
            payload: error.data,
          });
        }
      },
      *ADD_STATUS_LEAD({ payload, callback }, saga) {
        try {
          yield saga.call(services.addStatusLead, payload);
          callback(payload);
        } catch (error) {
          callback(null, error?.data?.error);
        }
      },
      *ADD_EVENTS({ payload, callback }, saga) {
        try {
          yield saga.call(services.addEvents, payload);
          callback(payload);
        } catch (error) {
          callback(null, error?.data?.error);
        }
      },
      *UPDATE_EVENTS({ payload, callback }, saga) {
        try {
          yield saga.call(services.updateEvents, payload);
          callback(payload);
        } catch (error) {
          callback(null, error?.data?.error);
        }
      },
      *REMOVE_EVENTS({ payload, callback }, saga) {
        try {
          yield saga.call(services.removeEvents, payload.id);
          callback(payload);
        } catch (error) {
          callback(null, error);
        }
      },
      *GET_EVENTS({ payload }, saga) {
        try {
          yield saga.put({
            type: 'INIT_STATE',
          });
          const response = yield saga.call(services.getEvents, payload);
         
          yield saga.put({
            type: 'SET_EVENTS_DETAILS',
            payload: response,
          });
        } catch (error) {
          yield saga.put({
            type: 'SET_ERROR',
            payload: error.data,
          });
        }
      },
      *EVENTS({ payload }, saga) {
        try {
          yield saga.put({
            type: 'INIT_STATE',
          });
          const response = yield saga.call(services.Events, payload);
          yield saga.put({
            type: 'SET_EVENTS',
            payload: response,
          });
        } catch (error) {
          yield saga.put({
            type: 'SET_ERROR',
            payload: error.data,
          });
        }
      },
      *ADD_REFERENCES({ payload, callback }, saga) {
        try {
          yield saga.call(services.addReferences, payload);
          callback(payload);
        } catch (error) {
          callback(null, error?.data?.error);
        }
      },
      *GET_REFERENCES({ payload ,callback}, saga) {
        try {
          yield saga.put({
            type: 'INIT_STATE',
          });
          const response = yield saga.call(services.getReferences, payload);
          callback(response);
          yield saga.put({
            type: 'SET_REFERENCES',
            payload: response,
          });
        } catch (error) {
          yield saga.put({
            type: 'SET_ERROR',
            payload: error.data,
          });
        }
      },
      *GET_DATA({ payload }, saga) {
        try {
          yield saga.put({
            type: 'INIT_STATE',
          });
          const response = yield saga.call(services.getData, payload);
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
      *GET_POSTS({ payload }, saga) {
        try {
          const response = yield saga.call(services.getPosts, payload);
          yield saga.put({
            type: 'SET_POSTS',
            payload: response,
          });
        } catch (error) {
          yield saga.put({
            type: 'SET_ERROR',
            payload: error.data,
          });
        }
      },
      *ADD_FACEBOOK({ payload, callback }, saga) {
        try {
          yield saga.call(services.addFacebook, payload);
          callback(payload);
        } catch (error) {
          callback(null, error?.data?.error);
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
      *REMOVE_FACEBOOK({ payload, callback }, saga) {
        try {
          yield saga.call(services.removeFacebook, payload);
          callback(payload);
        } catch (error) {
          callback(null, error);
        }
      },
      *GET_POSTS_LIKE({ payload, callback }, saga) {
        try {
          const response = yield saga.call(services.getPostLike, payload);
          callback(response);
          yield saga.put({
            type: 'SET_POSTS_LIKE',
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
      *GET_POSTS_COMMENT({ payload, callback }, saga) {
        try {
          const response = yield saga.call(services.getPostComment, payload);
          callback(response);
          yield saga.put({
            type: 'SET_POSTS_COMMENT',
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
    },
  };