import { notification } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import * as services from './services';

export default {
  namespace: 'physicalPeriodicMeasurementAdd',
  state: {
    details: [],
    dataScriptReview: [],
    dataEvaluetionCriteria: [],
    dataStudent: {},
    dataTemplates: [],
    dataDetailItem: [],
    dataDetails: {},
    dataConfiguration: [],
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
    SET_DATA_CONFIGURATION: (state, { payload }) => ({
      ...state,
      dataConfiguration: payload.items,
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
      dataEvaluetionCriteria: payload.parsePayload?.map((i) => ({
        ...i,
        rates: i?.rates?.map((k) => ({
          ...k,
          id: uuidv4(),
        })),
      })),
    }),
    SET_DATA_DETAIL_ITEM: (state, { payload }) => ({
      ...state,
      dataDetailItem: {
        ...payload,
        information: {
          student: payload?.student,
          branch: payload?.student?.branch,
          class: payload?.class,
          assessmentPeriod: payload?.assessmentPeriod,
          schoolYear: payload?.schoolYear,
        },
      },
    }),
    SET_DATA_STUDENTS: (state, { payload }) => ({
      ...state,
      dataDetails: {
        ...payload,
        rates: payload.rates?.map((item) => ({
          id: uuidv4(),
          ...item,
        })),
      },
      dataTemplates: payload.templates?.map((i) => ({
        ...i,
        physicalCriteraiTemplates: i?.physicalCriteraiTemplates?.map((item) => ({
          ...item,
          typeItem: 'add',
          content: {
            ...item.content,
            checkId: uuidv4(),
            items: item.content?.items?.map((itemDetail) => ({
              name: itemDetail,
              checkId: uuidv4(),
              typeItem: 'add',
              id: item.id,
            })),
          },
          checkEmpty: false,
        })),
      })),
    }),
    SET_DATA_DETAIL: (state, { payload }) => {
      if (payload?.type === 'itemRadio') {
        return {
          ...state,
          dataTemplates: state?.dataTemplates?.map((i) => ({
            ...i,
            physicalCriteraiTemplates:
              i?.type !== 'CRITERIA'
                ? i.physicalCriteraiTemplates
                : i?.physicalCriteraiTemplates?.map((item) => ({
                    ...item,
                    isChecked: true,
                    content: {
                      ...item.content,
                      checkId:
                        payload?.record?.id === item?.id ? payload?.value : item?.content?.checkId,
                      items: item.content?.items?.map((itemDetail) => ({
                        ...itemDetail,
                        isChecked:
                          itemDetail?.checkId === payload?.value ? true : itemDetail?.isChecked,
                      })),
                    },
                  })),
            checkEmpty: true,
          })),
        };
      }
      if (payload?.type === 'itemInputSubject') {
        return {
          ...state,
          dataTemplates: state?.dataTemplates?.map((i) => ({
            ...i,
            physicalCriteraiTemplates:
              i?.type !== 'CRITERIA'
                ? i.physicalCriteraiTemplates
                : i?.physicalCriteraiTemplates?.map((item) => ({
                    ...item,
                    isChecked: true,
                    contentInput:
                      item?.id === payload?.record?.id ? payload?.value : item?.contentInput,
                  })),
            checkEmpty: true,
          })),
        };
      }
      if (payload?.type === 'itemInputComment') {
        return {
          ...state,
          dataTemplates: state?.dataTemplates?.map((i) => ({
            ...i,
            physicalCriteraiTemplates:
              i?.type !== 'FEEDBACK'
                ? i.physicalCriteraiTemplates
                : i?.physicalCriteraiTemplates?.map((item) => ({
                    ...item,
                    isChecked: true,
                    contentInput:
                      item?.id === payload?.record?.id ? payload?.value : item?.contentInput,
                  })),
            checkEmpty: true,
          })),
        };
      }
      if (payload?.type === 'itemCheckBox') {
        return {
          ...state,
          dataTemplates: state?.dataTemplates?.map((i) => ({
            ...i,
            physicalCriteraiTemplates:
              i?.type !== 'FEEDBACK'
                ? i.physicalCriteraiTemplates
                : i?.physicalCriteraiTemplates?.map((item) => ({
                    ...item,
                    isChecked: true,
                    content: {
                      ...item.content,
                      checkId: payload?.value,
                      items: item.content?.items?.map((itemDetail) => ({
                        ...itemDetail,
                        isChecked:
                          itemDetail?.checkId === payload?.record?.checkId
                            ? payload?.value
                            : itemDetail?.isChecked,
                      })),
                    },
                  })),
            checkEmpty: true,
          })),
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
        yield saga.put({
          type: 'SET_DATA_STUDENTS',
          payload: response,
        });
        callback(response);
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
    *GET_DATA_DETAIL({ payload }, saga) {
      try {
        const response = yield saga.call(services.getDatDetail, payload);
        yield saga.put({
          type: 'SET_DATA_DETAIL_ITEM',
          payload: response,
        });
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
    *GET_DATA_CONFIGURATION({ payload }, saga) {
      try {
        const response = yield saga.call(services.getDataConfiguration, payload);
        yield saga.put({
          type: 'SET_DATA_CONFIGURATION',
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
};
