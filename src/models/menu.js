import {
  getLeftMenuData,
  getTopMenuData,
  getLeftMenuExchange,
  getLeftMenuProfile,
  getLeftMenuSchedules,
  getLeftMenuConfiguration,
  getLeftMenuVehicel,
} from '@/services/menu';

export default {
  namespace: 'menu',
  state: {
    menuLeftData: [],
    menuTopData: [],
    menuLeftExchange: [],
    menuLeftObjectProfiles: [],
    menuLeftSchedules: [],
    menuConfiguration: [],
    menuLeftVehicel: [],
  },
  reducers: {
    SET_STATE: (state, action) => ({ ...state, ...action.payload }),
  },
  effects: {
    *GET_DATA(action, { put, call }) {
      const menuLeftData = yield call(getLeftMenuData);
      const menuLeftExchange = yield call(getLeftMenuExchange);
      const menuLeftObjectProfiles = yield call(getLeftMenuProfile);
      const menuLeftSchedules = yield call(getLeftMenuSchedules);
      const menuTopData = yield call(getTopMenuData);
      const menuConfiguration = yield call(getLeftMenuConfiguration);
      const menuLeftVehicel = yield call(getLeftMenuVehicel);
      yield put({
        type: 'SET_STATE',
        payload: {
          menuLeftData,
          menuTopData,
          menuLeftExchange,
          menuLeftObjectProfiles,
          menuLeftSchedules,
          menuConfiguration,
          menuLeftVehicel,
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
