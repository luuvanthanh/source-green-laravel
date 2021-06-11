import { notification } from 'antd';
import * as services from './services';

export default {
  namespace: 'allocationTeacherTransfers',
  state: {
    data: [],
    pagination: {},
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
  },
  effects: {
    *GET_TEACHERS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getTeachers, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
    *UPDATE({ payload, callback }, saga) {
      try {
        const res = yield saga.call(services.changeClassTeacher, payload);
        callback(res);
        notification.success({
          message: 'THÔNG BÁO',
          description: 'Cập nhật thành công',
        });
      } catch (error) {
        callback(null, error);
        notification.error({
          message: 'THÔNG BÁO',
          description: 'Cập nhật thất bại',
        });
      }
    },
  },
  subscriptions: {},
};
