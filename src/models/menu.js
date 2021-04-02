import {
  getLeftMenuData,
  getTopMenuData,
  getLeftMenuExchange,
  getLeftMenuProfile,
  getLeftMenuSchedules,
} from '@/services/menu';

export default {
  namespace: 'menu',
  state: {
    menuLeftData: [],
    menuTopData: [],
    MenuLeftExchange: [],
    MenuLeftObjectProfiles: [],
    MenuLeftSchedules: [],
  },
  reducers: {
    SET_STATE: (state, action) => ({ ...state, ...action.payload }),
  },
  effects: {
    *GET_DATA(action, { put, call }) {
      const menuLeftData = yield call(getLeftMenuData);
      const MenuLeftExchange = yield call(getLeftMenuExchange);
      const MenuLeftObjectProfiles = yield call(getLeftMenuProfile);
      const MenuLeftSchedules = yield call(getLeftMenuSchedules);
      const menuTopData = yield call(getTopMenuData);
      yield put({
        type: 'SET_STATE',
        payload: {
          menuLeftData,
          menuTopData,
          MenuLeftExchange,
          MenuLeftObjectProfiles,
          MenuLeftSchedules,
        },
      });
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({
        type: 'GET_DATA',
      });
    },
  },
};
