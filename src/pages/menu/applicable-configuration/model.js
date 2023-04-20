import * as services from './services';

export default {
  namespace: 'menuApplicableConfiguration',
  state: {
    details: {},
    dataFoodGroup: [],
    dataMaterials: [],
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
    SET_FOOD_GROUP: (state, { payload }) => ({
      ...state,
      dataFoodGroup: payload,
    }),
  },
  effects: {
    *GET_DETAILS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.details, payload);
        callback(response);
        if (response) {
          yield saga.put({
            type: 'SET_DETAILS',
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
    *ADD({ payload, callback }, saga) {
      try {
        yield saga.call(services.add, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_FOOD_GROUP({ payload }, saga) {
      try {
        const response = yield saga.call(services.getFoodGroups, payload);
        if (response) {
          yield saga.put({
            type: 'SET_FOOD_GROUP',
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
