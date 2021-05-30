import { notification } from 'antd';
import * as services from './services';

export default {
  namespace: 'allocationArrangeClass',
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
        const res = yield saga.call(services.createClassStudent, payload);
        callback(res);
        notification.success({
          message: 'THÔNG BÁO',
          description: 'Tạo thành công',
        });
      } catch (error) {
        callback(null, error);
        notification.error({
          message: 'THÔNG BÁO',
          description: 'Tạo thất bại',
        });
      }
    },
  },
  subscriptions: {},
};
