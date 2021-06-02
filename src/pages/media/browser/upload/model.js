import { notification } from 'antd';
import * as services from './services';

export default {
  namespace: 'mediaUpload',
  state: {},
  reducers: {},
  effects: {
    *UPLOAD({ payload, callback }, { call }) {
      try {
        const response = yield call(services.upload, payload);
        callback(response);
        notification.success({
          message: 'THÔNG BÁO',
          description: 'Dữ liệu cập nhật thành công',
        });
      } catch (error) {
        notification.error({
          message: 'THÔNG BÁO',
          description: 'Dữ liệu cập nhật thất bại',
        });
      }
    },
    *CREATE({ payload, callback }, { call }) {
      try {
        const response = yield call(services.create, payload);
        callback(response);
        notification.success({
          message: 'THÔNG BÁO',
          description: 'Dữ liệu cập nhật thành công',
        });
      } catch (error) {
        notification.error({
          message: 'THÔNG BÁO',
          description: 'Dữ liệu cập nhật thất bại',
        });
      }
    },
  },
  subscriptions: {},
};
