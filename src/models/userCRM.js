const UserModel = {
  namespace: 'userCRM',
  state: {},
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
  },
  reducers: {
    SET_USER: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
  },
  subscriptions: {},
};
export default UserModel;
