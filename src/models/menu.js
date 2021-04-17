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
  getLeftMenuMedical,
  getLeftMenuTimeTable,
  getLeftMenuNotification,
  getLeftMenuMedia,
  getLeftMenuHealth,
  getLeftMenuHRM,
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
    menuLeftMedical: [],
    menuLeftTimeTable: [],
    menuLeftNotification: [],
    menuLeftMedia: [],
    menuLeftHealth: [],
    menuLeftHRM: [],
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
      const menuLeftMedical = yield call(getLeftMenuMedical);
      const menuLeftTimeTable = yield call(getLeftMenuTimeTable);
      const menuLeftNotification = yield call(getLeftMenuNotification);
      const menuLeftMedia = yield call(getLeftMenuMedia);
      const menuLeftHealth = yield call(getLeftMenuHealth);
      const menuLeftHRM = yield call(getLeftMenuHRM);
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
          menuLeftMedical,
          menuLeftTimeTable,
          menuLeftNotification,
          menuLeftMedia,
          menuLeftHealth,
          menuLeftHRM,
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
