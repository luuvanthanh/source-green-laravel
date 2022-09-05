import * as services from './services';

export default {
  namespace: 'hrmSalary',
  state: {
    data: {},
    dataTable: {},
    error: {
      isError: false,
      data: {},
    },
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA_PAYROLL: (state, { payload }) => ({
      ...state,
      data: payload.parsePayload,
    }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      dataTable: {
        ...(payload?.payload || {}),
        ListBranch: Object.keys(payload?.payload?.ListBranch).map((keyBranch) => ({
          id: keyBranch,
          name: keyBranch,
          ...(payload?.payload?.ListBranch[keyBranch] || {}),
          children:
            payload?.payload?.ListBranch[keyBranch] &&
            Object.keys(payload?.payload?.ListBranch[keyBranch]?.ListDivision).map(
              (keyDivision) => ({
                id: keyDivision,
                name: keyDivision,
                ...(payload?.payload?.ListBranch[keyBranch]?.ListDivision[keyDivision] || {}),
                children:
                  payload?.payload?.ListBranch[keyBranch]?.ListDivision[keyDivision]
                    ?.payrollDetail &&
                  payload?.payload?.ListBranch[keyBranch]?.ListDivision[
                    keyDivision
                  ]?.payrollDetail?.map((keyItem) => ({
                    ...keyItem,
                  })),
              }),
            ),
        })),
      },
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
    *GET_DATA_PAYROLL({ payload }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        if (response) {
          yield saga.put({
            type: 'SET_DATA_PAYROLL',
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
    *GET_DATA({ payload }, saga) {
      try {
        const response = yield saga.call(services.getData, payload);
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
  },
  subscriptions: {},
};
