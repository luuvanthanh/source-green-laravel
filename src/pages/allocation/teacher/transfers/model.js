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
    *UPDATE({ payload, callback }, saga) {
      try {
        const res = yield saga.call(services.changeClassTeacher, payload);
        callback && callback(res)
        notification.success({
          message: 'THÔNG BÁO',
          description: 'Cập nhật thành công',
        });
      } catch (error) {
        callback && callback(null, error)
        notification.error({
          message: 'THÔNG BÁO',
          description: 'Cập nhật thất bại',
        });
      }
    },
  },
  subscriptions: {},
};
