import * as services from './services';

export default {
  namespace: 'otherDeclarations',
  state: {
    data: [],
    pagination: {},
    paramaterValues: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: payload.parsePayload?.map((i) => ({
        ...i,
        children: _(i?.changeContractParameter.concat(i?.otherDeclarationDetail))
          .groupBy('employeeId')
          .map((items, id, _money) => ({
            ...items[0],
            id,
            detail: items?.map((k) => ({
              ...k,
              // total: k?.detail?.reduce(
              //   (accumulator, object) => accumulator + JSON?.parse(object?.value),
              //   0,
              // ),
            })),
          }))
          .value(),
      })),
      pagination: payload.pagination,
    }),
    SET_PARAMATER_VALUES: (state, { payload }) => ({
      ...state,
      paramaterValues: payload,
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
    *GET_PARAMATER_VALUES({ payload }, saga) {
      try {
        const response = yield saga.call(services.getParamaterValues, payload);
        if (response) {
          yield saga.put({
            type: 'SET_PARAMATER_VALUES',
            payload: response.parsePayload,
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
    *REMOVE({ payload, callback }, saga) {
      try {
        yield saga.call(services.remove, payload.id);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
  },
  subscriptions: {},
};
