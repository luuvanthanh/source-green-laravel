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
  getLeftMenuSalary,
  getLeftMenuPhysical,
  getLeftMenuCRM,
  getLeftMenuChildDevelop,
  getLeftMenuCurrency,
  getLeftMenuEnglish,
  getLeftMenuPhysicalItem,
} from '@/services/menu';
import * as services from '@/services/categories';

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
    menuLeftSalary: [],
    menuLeftPhysical: [],
    menuLeftCRM: [],
    menuLeftChildDevelop: [],
    menuLeftCurrency: [],
    menuLeftEnglish: [],
    menuLeftReport: [],
    dataReport: [],
  },
  reducers: {
    SET_STATE: (state, action) => ({ ...state, ...action.payload }),
    SET_MENU_REPORT: (state, { payload }) => ({
      ...state,
      dataReport: payload?.map((item) => ({
        title: item.name,
        key: `report-${item.id}`,
        url: [],
        id: item.id,
        permission: [],
        children: item?.children?.map((i) => ({
          title: i.name,
          id: i.id,
          key: `report-${i.id}`,
          url: [`/bao-cao-erp/${i.id}`],
          permission: [],
          scriptCode: i?.scriptCode,
          pro: true,
        })),
        pro: true,
      })),
    }),
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
      const menuLeftSalary = yield call(getLeftMenuSalary);
      const menuLeftPhysical = yield call(getLeftMenuPhysical);
      const menuLeftCRM = yield call(getLeftMenuCRM);
      const menuLeftChildDevelop = yield call(getLeftMenuChildDevelop);
      const menuLeftCurrency = yield call(getLeftMenuCurrency);
      const menuLeftEnglish = yield call(getLeftMenuEnglish);
      const menuLeftPhysicalItem = yield call(getLeftMenuPhysicalItem);
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
          menuLeftSalary,
          menuLeftPhysical,
          menuLeftCRM,
          menuLeftChildDevelop,
          menuLeftCurrency,
          menuLeftEnglish,
          menuLeftPhysicalItem,
        },
      });
    },
    *GET_MENU_REPORT({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getReport, payload);
        yield saga.put({
          type: 'SET_MENU_REPORT',
          payload: response.items,
        });
        callback(response?.items);
      } catch (error) {
        throw error.data;
      }
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
