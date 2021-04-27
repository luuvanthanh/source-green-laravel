import { notification } from 'antd';
import * as services from './services';

export default {
  namespace: 'allocationTeacherNoClass',
  state: {
    data: [],
    pagination: {},
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
  },
  effects: {
    *ADD({ payload, callback }, saga) {
      try {
        const res = yield saga.call(services.createClassTeacher, payload);
        callback && callback(res)
        notification.success({
          message: 'THÔNG BÁO',
          description: 'Tạo thành công',
        });
      } catch (error) {
        callback && callback(null, error)
        notification.error({
          message: 'THÔNG BÁO',
          description: 'Tạo thất bại',
        });
      }
    },
  },
  subscriptions: {},
};
