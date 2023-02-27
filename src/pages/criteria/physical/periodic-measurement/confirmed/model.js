import { v4 as uuidv4 } from 'uuid';
import * as services from './services';

export default {
  namespace: 'physicalPeriodicMeasurementConfirmed',
  state: {
    dataTemplates: [],
    dataDetailItem: {},
    error: {
      isError: false,
      data: {},
    },
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, data: [] }),
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
        rates: payload?.rates?.map((k) => ({
          ...k,
          id: uuidv4(),
        })),
      },
      dataTemplates: payload.templates?.map((i) => ({
        ...i,
        physicalCriteraiTemplates: i?.templates?.map((item) => ({
          name: item?.template?.name,
          ...item,
          contentInput: item?.content,
          typeItem: 'confirmed',
          content: {
            ...item.content,
            checkId: item?.template?.id,
            type: item?.template?.content?.type,
            items: item.template?.content?.items?.map((itemDetail) => ({
              ...itemDetail,
              name: itemDetail?.item,
              checkId: itemDetail?.isChecked ? item?.template?.id : uuidv4(),
              typeItem: 'confirmed',
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
                          payload?.record?.id === item?.id
                            ? itemDetail?.checkId === payload?.value
                            : itemDetail?.isChecked,
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
    *UPDATE({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.update, payload);
        callback(response);
      } catch (error) {
        callback(null, error?.data);
      }
    },
    *DELETE({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.deleteItem, payload);
        callback(response);
      } catch (error) {
        callback(null, error?.data);
      }
    },
    *GET_CONFIRMATION({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getConfirmation, payload);
        callback(response);
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_BMI_STUDENT({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getBmiStudent, payload);
        callback(response);
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *UPDATE_CONFIRMATION({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.updateConfirmation, payload);
        callback(response);
      } catch (error) {
        callback(null, error?.data);
      }
    },
  },
};
