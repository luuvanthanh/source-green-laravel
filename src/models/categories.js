import * as categories from '@/services/categories';

export default {
  namespace: 'categories',
  state: {
    boGroups: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_BUSINESS_OBJECT_GROUP: (state, { payload }) => ({
      ...state,
      boGroups: payload.boGroups.items,
    }),
  },
  effects: {
    *GET_BUSINESS_OBJECT_GROUP(_, saga) {
      try {
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
