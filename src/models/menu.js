import {
  getLeftMenuData,
  getTopMenuData,
  getLeftMenuExchange,
  getLeftMenuProfile,
  getLeftMenuSchedules,
  getLeftMenuConfiguration,
  getLeftMenuVehicel,
  getLeftMenuCriteria,
  getLeftMenuChildren,
  getLeftMenuAllocation,
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
    menuLeftCriteria: [],
    menuLeftChildren: [],
    menuLeftAllocation: [],
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
      const menuLeftCriteria = yield call(getLeftMenuCriteria);
      const menuLeftChildren = yield call(getLeftMenuChildren);
      const menuLeftAllocation = yield call(getLeftMenuAllocation);
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
          menuLeftCriteria,
          menuLeftChildren,
          menuLeftAllocation,
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
