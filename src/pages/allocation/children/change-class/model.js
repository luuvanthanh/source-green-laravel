import { notification } from 'antd';
import * as services from './services';

export default {
  namespace: 'allocationChangeClass',
  state: {
    data: [],
    pagination: {},
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
  },
  effects: {
    *GET_STUDENTS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getStudents, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
    *UPDATE({ payload, callback }, saga) {
      try {
        const res = yield saga.call(services.changeClassStudent, payload);
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
