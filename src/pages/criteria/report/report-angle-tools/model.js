import { isEmpty } from 'lodash';
import * as services from './services';

  export default {
    namespace: 'reportAngleTools',
    state: {
      data: [],
      pagination: {
        total: 0,
      },
      error: {
        isError: false,
        data: {},
      },
      branches: [],
      classes: [],
      toolGroups: [],
      toolDetails: [],
    },
    reducers: {
      INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
      SET_DATA: (state, { payload }) => ({
        ...state,
        data: payload.parsePayload.map((key) => ({
         branch : (key?.branch || {}),
         children:( 
          key?.curriculumReviewGroupByClasses.map((item) => ({
            class : item?.class,
            id: item?.class?.id,
            children: (
              item?.curriculumReviewGroupByStudents.map((i) => ({
                ...i,
                toolGroup: i?.curriculumReviewGroupByToolGroups[0]?.toolGroup,
                children: 
                   i?.curriculumReviewGroupByToolGroups[0]?.curriculumReviews?.map(y =>
                    ({
                       ...y,
                       toolDetail: {
                         ...y?.toolDetail,
                         fileUrl: !isEmpty(y?.toolDetail?.fileUrl) ? JSON.parse(y?.toolDetail?.fileUrl) : "",
                       }
                    }),
                   ),
              }))
            )
          }))
         )
        })),
        pagination: payload.pagination,
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
      SET_TOOL_GROUPS: (state, { payload }) => ({
        ...state,
        toolGroups: payload.parsePayload.items,
      }),
      SET_TOOL_DETAILS: (state, { payload }) => ({
        ...state,
        toolDetails: payload.parsePayload.items,
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
      *GET_TOOL_GROUPS({ payload }, saga) {
        try {
          const response = yield saga.call(services.getToolGroups, payload);
          yield saga.put({
            type: 'SET_TOOL_GROUPS',
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
      *GET_TOOL_DETAILS({ payload }, saga) {
        try {
          const response = yield saga.call(services.getToolDetails, payload);
          yield saga.put({
            type: 'SET_TOOL_DETAILS',
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
    },
    subscriptions: {},
  };