import {
  getLeftMenuData,
  getTopMenuData,
  getLeftMenuCommunications,
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
  getLeftMenuFeePolicy,
  getLeftMenuNotes,
} from '@/services/menu';

export default {
  namespace: 'menu',
  state: {
    menuLeftData: [],
    menuTopData: [],
    menuLeftCommunications: [],
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
    menuLeftFeePolicy: [],
    menuLeftNotes: [],
  },
  reducers: {
    SET_STATE: (state, action) => ({ ...state, ...action.payload }),
  },
  effects: {
    *GET_DATA(action, { put, call }) {
      const menuLeftData = yield call(getLeftMenuData);
      const menuLeftCommunications = yield call(getLeftMenuCommunications);
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
      const menuLeftFeePolicy = yield call(getLeftMenuFeePolicy);
      const menuLeftNotes = yield call(getLeftMenuNotes);
      yield put({
        type: 'SET_STATE',
        payload: {
          menuLeftData,
          menuTopData,
          menuLeftCommunications,
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
          menuLeftFeePolicy,
          menuLeftNotes,
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
