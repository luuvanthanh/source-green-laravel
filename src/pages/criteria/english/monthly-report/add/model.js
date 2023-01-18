import { notification } from 'antd';
import * as services from './services';

export default {
  namespace: 'EnglishMonthlyReportAdd',
  state: {
    details: [],
    dataScriptReview: [],
    dataEvaluetionCriteria: [],
    dataDetails: {},
    error: {
      isError: false,
      data: {},
    },
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      details: payload.parsePayload,
    }),
    SET_DATA_SCRIPT_REVIEW: (state, { payload }) => ({
      ...state,
      dataScriptReview: payload.parsePayload,
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
    SET_DATA_EVALUATION_CRITERRIA: (state, { payload }) => ({
      ...state,
      dataEvaluetionCriteria: payload.parsePayload,
    }),
    SET_DATA_DETAIL: (state, { payload }) => {
      if (payload?.type === 'itemRadio') {
        return {
          ...state,
          dataDetails: {
            ...state?.dataDetails,
            scriptReviewSubject: state?.dataDetails?.scriptReviewSubject?.map((i) => ({
              ...i,
              scriptReviewSubjectDetail: i?.scriptReviewSubjectDetail?.map((item) => ({
                ...item,
                scriptReviewSubjectDetailChildren: item?.scriptReviewSubjectDetailChildren?.map(
                  (itemChildDetail) => ({
                    ...itemChildDetail,
                    radioId:
                      payload?.record?.id === itemChildDetail?.id
                        ? payload?.value.target.value
                        : itemChildDetail?.radioId,
                  }),
                ),
              })),
            })),
          },
        };
      }
      if (payload?.type === 'itemCheckInput') {
        return {
          ...state,
          dataDetails: {
            ...state?.dataDetails,
            scriptReviewComment: state?.dataDetails?.scriptReviewComment?.map((i) => ({
              ...i,
              scriptReviewCommentDetail: i?.scriptReviewCommentDetail?.map((item) => ({
                ...item,
                value: payload?.record?.id === i?.id ? payload?.value.target.value : item?.value,
              })),
            })),
          },
        };
      }
      if (payload?.type === 'itemCheckBox') {
        return {
          ...state,
          dataDetails: {
            ...state?.dataDetails,
            scriptReviewComment: state?.dataDetails?.scriptReviewComment?.map((i) => ({
              ...i,
              scriptReviewCommentDetail: i?.scriptReviewCommentDetail?.map((item) => ({
                ...item,
                checkBox:
                  payload?.record?.id === item?.id ? payload?.value.target.checked : item?.checkBox,
              })),
            })),
          },
        };
      }
      return { ...state, dataDetails: payload };
    },
  },
  effects: {
    *GET_DATA({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getData, payload);
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
    *GET_DATA_STUDENTS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getDataStudent, payload);
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
    *ADD({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.add, payload);
        callback(response);
        notification.success({
          message: 'Successful',
          description: 'You update to success data.',
        });
      } catch (error) {
        callback(null, error?.data);
      }
    },
    *UPDATE_CONFIRMED({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.updateComfirm, payload);
        callback(response);
        notification.success({
          message: 'Successful',
          description: 'You update to success data.',
        });
      } catch (error) {
        callback(null, error?.data);
      }
    },
    *GET_DATA_SCRIPT_REVIEW({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getDataScriptReview, payload);
        callback(response);
        if (response) {
          yield saga.put({
            type: 'SET_DATA_SCRIPT_REVIEW',
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
    *GET_DATA_EVALUATION_CRITERRIA({ payload }, saga) {
      try {
        const response = yield saga.call(services.getDataEvaluetionCriteria, payload);
        if (response) {
          yield saga.put({
            type: 'SET_DATA_EVALUATION_CRITERRIA',
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
    *GET_DATA_DETAIL({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getDatDetail, payload);
        callback(response);
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_SET_DATA_DETAIL({ payload }, saga) {
      yield saga.put({
        type: 'SET_DATA_DETAIL',
        payload,
      });
    },
  },
};
